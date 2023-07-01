import Anotacao from "@/Models/Anotacao";
import RepositoryBase from "@/DataAccess/RepositoryBase";
import AppConfig from "@/AppConfig";

export default class AnotacaoRepository extends RepositoryBase<Anotacao> {

    constructor() {
        super(AppConfig.anotacaoTable);
    }

    obter(filtro: Anotacao): Promise<Anotacao[]> {
        return new Promise<Anotacao[]>((ok, err) => {
            const transaction = this.db.transaction(this.table, "readonly");
            const objectStore = transaction.objectStore(this.table);
            const index = objectStore.index(filtro.modo == 'grade' ? 'aula_disciplina_data' : 'disciplina_data');
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

    excluirPorDisciplina(id_disciplina: number, transaction?: IDBTransaction) {
        return this.deleteByIndex('disciplina', id_disciplina, transaction);
    }

    private parseAnotacao(anotacao: Anotacao, removerId: boolean) {
        return JSON.parse(JSON.stringify(anotacao, (key, value) => (removerId && key == 'id') || key == 'modo' ? undefined : value));
    }
}