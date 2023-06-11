import { AxiosStatic } from "axios";
import Auth from "@/api/Auth";
import DbRepository from "@/DataAccess/Repository/DbRepository";
import ApiRepository from "@/DataAccess/Repository/ApiRepository";
import DataAccessConfig from "@/DataAccess/DataAccessConfig";
import Anotacao from "@/Models/Anotacao";

export default interface IAnotacaoRepository {
    config(): Promise<void> | void;
    get acessoLocal(): boolean;

    obter(filtro: Anotacao): Promise<Anotacao[]>;
    salvar(anotacao: Anotacao): Promise<Anotacao>;
}

export class AnotacaoRepositoryFactory {
    static async CreateRepository(axios: AxiosStatic): Promise<IAnotacaoRepository> {
        let repository: IAnotacaoRepository;
        if (Auth.localAccess) {
            repository = new AnotacaoDbRepository();
            await repository.config();
        } else {
            repository = new AnotacaoApiRepository(axios);
            repository.config();
        }

        return repository;
    }
}

export class AnotacaoApiRepository extends ApiRepository<Anotacao> implements IAnotacaoRepository {

    constructor(axios: AxiosStatic) {
        super(axios, DataAccessConfig.anotacaoUrl);
    }

    obter(filtro: Anotacao): Promise<Anotacao[]> {
        return this.post(filtro);
    }

    salvar(anotacao: Anotacao): Promise<Anotacao> {
        return new Promise<Anotacao>(async (ok, err) => {
            try {
                let result = await this.axios.put<Anotacao>(this.url, anotacao);
                ok(result.data);
            } catch (error: any) {
                console.log(error);
                err(error?.request?.data?.message);
            }
        });
    }
}

export class AnotacaoDbRepository extends DbRepository<Anotacao> implements IAnotacaoRepository {

    constructor() {
        super(DataAccessConfig.anotacaoTable);
    }

    obter(filtro: Anotacao): Promise<Anotacao[]> {
        return new Promise<Anotacao[]>((ok, err) => {
            const transaction = this.db.transaction(this.table, "readonly");
            const objectStore = transaction.objectStore(this.table);
            const index = objectStore.index(filtro.modo!);
            const request = filtro.modo == 'grade'
                ? index.openCursor(IDBKeyRange.only([filtro.aula, filtro.id_disciplina, filtro.data]))
                : index.openCursor(IDBKeyRange.bound([filtro.id_disciplina, filtro.data.substring(0, 7)], [filtro.id_disciplina, filtro.data.substring(0, 7) + '\uffff']));
            const anotacoes: Anotacao[] = [];
            request.onsuccess = function () {
                const cursor = this.result;
                if (cursor) {
                    anotacoes.push(cursor.value);
                    cursor.continue();
                } else {
                    ok(anotacoes);
                }
            }
            request.onerror = function () {
                console.log(this.error);
                err(this.error?.message);
            }
        });
    }

    salvar(anotacao: Anotacao): Promise<Anotacao> {
        return new Promise((ok, err) => {
            const transaction = this.db.transaction(this.table, "readwrite");
            const objectStore = transaction.objectStore(this.table);
            let request: IDBRequest | undefined = undefined;
            let requestAdd: IDBRequest<IDBValidKey> | undefined = undefined;
            if (anotacao.id != undefined) {
                if (anotacao.anotacao != undefined && anotacao.anotacao != '') {
                    request = objectStore.put(this.parseAnotacao(anotacao, false));
                } else {
                    request = objectStore.delete(anotacao.id);
                }
            } else if (anotacao.anotacao != undefined && anotacao.anotacao != '') {
                requestAdd = objectStore.add(this.parseAnotacao(anotacao, true));
            } else {
                ok(anotacao);
            }

            if (request) {
                request.onsuccess = function () {
                    ok(anotacao);
                }
                request.onerror = function () {
                    console.log(this.error);
                    err(this.error?.message);
                }
            }

            if (requestAdd) {
                requestAdd.onsuccess = function () {
                    anotacao.id = this.result as number;
                    ok(anotacao);
                }
                requestAdd.onerror = function () {
                    console.log(this.error);
                    err(this.error?.message);
                }
            }
        });
    }

    private parseAnotacao(anotacao: Anotacao, removerId: boolean) {
        return JSON.parse(JSON.stringify(anotacao, (key, value) => (removerId && key == 'id') || key == 'modo' ? undefined : value));
    }

}