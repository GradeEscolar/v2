import Grade from "@/Models/Grade";
import AppConfig from "@/AppConfig";

export default abstract class DataContext {

    private static source: IDBDatabase | undefined = undefined;
    public get source(): IDBDatabase | undefined {
        return DataContext.source;
    }

    public config(): Promise<void> {

        if (DataContext.source)
            return new Promise(ok => ok());

        const request = window.indexedDB.open(AppConfig.db, 1);
        request.onupgradeneeded = this.upgradeneeded;

        return new Promise<void>((ok, err) => {
            request.onsuccess = async function () {
                DataContext.source = this.result;
                ok();
            };
            request.onerror = function () {
                DataContext.source = undefined;
                console.log(this.error);
                err(this.error?.message);
            };
        });
    }

    private upgradeneeded(this: IDBOpenDBRequest) {

        const db = this.result;
        const objectStoreNames: string[] = [AppConfig.usuarioTable, AppConfig.gradeTable, AppConfig.disciplinaTable, AppConfig.anotacaoTable, AppConfig.aulaTable];

        objectStoreNames.forEach(objectStoreName => {

            if (!db.objectStoreNames.contains(objectStoreName)) {
                db.createObjectStore(objectStoreName, { autoIncrement: true, keyPath: "id" });
            }

            const transaction = this.transaction!;
            const objectStore = transaction.objectStore(objectStoreName);

            DataContext.createIndex(objectStore, AppConfig.usuarioTable, 'nome', 'nome', { unique: true });
            DataContext.createIndex(objectStore, AppConfig.gradeTable, 'usuario', 'id_usuario', { unique: false });
            DataContext.createIndex(objectStore, AppConfig.disciplinaTable, 'usuario', 'id_usuario', { unique: false });
            DataContext.createIndex(objectStore, AppConfig.aulaTable, 'dia', 'dia', { unique: false });
            DataContext.createIndex(objectStore, AppConfig.anotacaoTable, 'grade', ['aula', 'id_disciplina', 'data'], { unique: true });
            DataContext.createIndex(objectStore, AppConfig.anotacaoTable, 'disciplina', ['id_disciplina', 'data'], { unique: true });
        });
    }

    private static createIndex(objectStore: IDBObjectStore, tableName: string, indexName: string, keyPath: string | Iterable<string>, options?: IDBIndexParameters) {
        if (objectStore.name == tableName && !objectStore.indexNames.contains(indexName)) {
            objectStore.createIndex(indexName, keyPath, options);
        }
    }

    private static iniciarGrade(db: IDBDatabase): Promise<void> {
        const transaction = db.transaction(AppConfig.gradeTable, "readwrite");
        const objectStore = transaction.objectStore(AppConfig.gradeTable);
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