import IDataContext from "./IDataContext";
import { AxiosStatic } from "axios";
import DataAccessConfig from "../DataAccessConfig";
import Grade from "@/Models/Grade";

export default class DbDataContext implements IDataContext {
    private static source: IDBDatabase | undefined = undefined;

    public get source(): IDBDatabase | AxiosStatic | undefined {
        return DbDataContext.source;
    }

    public config(): Promise<void> {

        if (DbDataContext.source)
            return new Promise(ok => ok());

        const request = window.indexedDB.open(DataAccessConfig.db, 1);
        request.onupgradeneeded = this.upgradeneeded;

        return new Promise<void>((ok, err) => {
            request.onsuccess = async function () {
                DbDataContext.source = this.result;
                await DbDataContext.iniciarGrade(this.result);
                ok();
            };
            request.onerror = function () {
                DbDataContext.source = undefined;
                console.log(this.error);
                err(this.error?.message);
            };
        });
    }

    private upgradeneeded(this: IDBOpenDBRequest) {
        const db = this.result;
        const objectStoreNames: string[] = [DataAccessConfig.gradeTable, DataAccessConfig.disciplinaTable, DataAccessConfig.anotacaoTable, DataAccessConfig.aulaTable];
        objectStoreNames.forEach(objectStoreName => {
            if (!db.objectStoreNames.contains(objectStoreName)) {
                db.createObjectStore(objectStoreName, { autoIncrement: true, keyPath: "id" });
            }

            if (objectStoreName == DataAccessConfig.aulaTable.toString()) {
                const transaction = this.transaction!;
                const objectStore = transaction.objectStore(objectStoreName);
                if (!objectStore.indexNames.contains('dia')) {
                    objectStore.createIndex('dia', 'dia', { unique: false });
                }
            }

            if (objectStoreName == DataAccessConfig.anotacaoTable.toString()) {
                const transaction = this.transaction!;
                const objectStore = transaction.objectStore(objectStoreName);
                if (!objectStore.indexNames.contains('grade')) {
                    objectStore.createIndex('grade', ['aula', 'id_disciplina', 'data'], { unique: true });
                }
                if (!objectStore.indexNames.contains('disciplina')) {
                    objectStore.createIndex('disciplina', ['id_disciplina', 'data'], { unique: false });
                }
            }
        });
    }

    private static iniciarGrade(db: IDBDatabase): Promise<void> {
        const transaction = db.transaction(DataAccessConfig.gradeTable, "readwrite");
        const objectStore = transaction.objectStore(DataAccessConfig.gradeTable);
        const count = objectStore.count();
        return new Promise<void>((ok, err) => {
            count.onsuccess = (ev) => {
                const hasData = (ev.target as IDBRequest).result == 1;
                if (!hasData) {
                    let grade = new Grade();
                    grade.dias = '2;3;4;5;6';
                    grade.aulas = 5;
                    let model = JSON.parse(JSON.stringify(grade, (key, value) => key == 'id' ? undefined : value));
                    const add = objectStore.add(model);
                    add.onsuccess = function () {
                        ok();
                    }
                    add.onerror = function () {
                        err(this.error);
                    }
                } else {
                    ok();
                }
            }
            count.onerror = function () {
                err(this.error);
            }
        });
    }
}