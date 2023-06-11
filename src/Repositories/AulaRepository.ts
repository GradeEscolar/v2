import { AxiosStatic } from "axios";
import Auth from "@/api/Auth";
import DbRepository from "@/DataAccess/Repository/DbRepository";
import ApiRepository from "@/DataAccess/Repository/ApiRepository";
import DataAccessConfig from "@/DataAccess/DataAccessConfig";
import Aula from "@/Models/Aula";

export default interface IAulaRepository {
    config(): Promise<void> | void;
    get acessoLocal(): boolean;

    obter(filtro: Aula): Promise<Aula[]>;
    salvar(aulas: Aula[]): Promise<void>;
}

export class AulaRepositoryFactory {
    static async CreateRepository(axios: AxiosStatic): Promise<IAulaRepository> {
        let repository: IAulaRepository;
        if (Auth.localAccess) {
            repository = new AulaDbRepository();
            await repository.config();
        } else {
            repository = new AulaApiRepository(axios);
            repository.config();
        }

        return repository;
    }
}

export class AulaApiRepository extends ApiRepository<Aula> implements IAulaRepository {

    constructor(axios: AxiosStatic) {
        super(axios, DataAccessConfig.aulaUrl);
    }

    obter(filtro: Aula): Promise<Aula[]> {
        return this.post(filtro);
    }

    salvar(aulas: Aula[]): Promise<void> {
        return new Promise<void>(async (ok, err) => {
            try {
                await this.axios.put<void>(this.url, aulas);
                ok();
            } catch (error: any) {
                console.log(error);
                err(error?.request?.data?.message);
            }
        });
    }

}

export class AulaDbRepository extends DbRepository<Aula> implements IAulaRepository {

    constructor() {
        super(DataAccessConfig.aulaTable);
    }

    async obter(filtro: Aula): Promise<Aula[]> {
        const transaction = this.db.transaction(this.table, "readonly");
        const objectStore = transaction.objectStore(this.table);
        const index = objectStore.index('dia');
        const request = index.openCursor(IDBKeyRange.only(filtro.dia));
        return new Promise((ok, err) => {
            const aulas: Aula[] = [];
            request.onsuccess = function () {
                const cursor = this.result;
                if (cursor) {
                    aulas.push(cursor.value);
                    cursor.continue();
                } else {
                    ok(aulas);
                }
            }
            request.onerror = function () {
                console.log(this.error);
                err(this.error?.message);
            }
        });
    }

    salvar(aulas: Aula[]): Promise<void> {

        return new Promise((ok, err) => {
            const adds = aulas.filter(a => a.id == undefined && a.id_disciplina != undefined);
            const upds = aulas.filter(a => a.id != undefined && a.id_disciplina != undefined);
            const dels = aulas.filter(a => a.id != undefined && a.id_disciplina == undefined);

            const transaction = this.db.transaction(this.table, "readwrite");
            const objectStore = transaction.objectStore(this.table);
            adds.forEach(add => objectStore.add(this.parseModel(add, true)));
            upds.forEach(upd => objectStore.put(this.parseModel(upd, false)));
            dels.forEach(del => objectStore.delete(del.id!));

            transaction.oncomplete = function () {
                ok();
            }
            transaction.onerror = function () {
                console.log(this.error);
                err(this.error?.message);
            }
        });
        
    }

}