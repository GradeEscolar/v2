import Aula from "@/Models/Aula";
import AppConfig from "@/AppConfig";
import RepositoryBase from "@/DataAccess/RepositoryBase";

export default class AulaRepository extends RepositoryBase<Aula> {

    constructor() {
        super(AppConfig.aulaTable);
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