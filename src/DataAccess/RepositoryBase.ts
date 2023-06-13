import IModel from "@/Models/IModel";
import IRepositoryBase from "./IRepositoryBase";
import DataContext from "./DataContext";

export default abstract class RepositoryBase<T extends IModel> extends DataContext implements IRepositoryBase<T> {
    
    protected get db(): IDBDatabase {
        return this.source as IDBDatabase;
    }

    protected table: string;

    constructor(table: string) {
        super();
        this.table = table;
    }

    public config(): Promise<void> {
        return super.config();
    }

    count(): Promise<number> {
        const transaction = this.db.transaction(this.table, "readonly");
        const objectStore = transaction.objectStore(this.table);
        const request = objectStore.count();
        return new Promise((ok, err) => {
            request.onsuccess = function () {
                ok(this.result);
            }
            request.onerror = function () {
                console.log(this.error);
                err(this.error?.message);
            }
        });
    }

    protected findOnly(indexName: string, indexValue: any): Promise<T[]> {
        const transaction = this.db.transaction(this.table, "readonly");
        const objectStore = transaction.objectStore(this.table);
        const index = objectStore.index(indexName);
        const request = index.openCursor(IDBKeyRange.only(indexValue));
        return new Promise((ok, err) => {
            const result: T[] = [];
            request.onsuccess = function () {
                const cursor = this.result;
                if (cursor) {
                    result.push(cursor.value);
                    cursor.continue();
                } else {
                    ok(result);
                }
            }
            request.onerror = function () {
                console.log(this.error);
                err(this.error?.message);
            }
        });
    }

    getAll(): Promise<T[]> {
        const transaction = this.db.transaction(this.table, "readonly");
        const objectStore = transaction.objectStore(this.table);
        const request = objectStore.getAll();
        return new Promise((ok, err) => {
            request.onsuccess = function () {
                ok(this.result as T[]);
            }
            request.onerror = function () {
                console.log(this.error);
                err(this.error?.message);
            }
        });
    }

    post(model: T): Promise<T[]> {
        return this.getAll();
    }

    add(model: T): Promise<void> {
        const transaction = this.db.transaction(this.table, "readwrite");
        const objectStore = transaction.objectStore(this.table);
        const request = objectStore.add(this.parseModel(model, true));
        return new Promise((ok, err) => {
            request.onsuccess = function () {
                model.id = this.result as number;
                ok();
            }
            request.onerror = function () {
                console.log(this.error);
                err(this.error?.message);
            }
        });
    }

    patch(model: T): Promise<void> {
        const transaction = this.db.transaction(this.table, "readwrite");
        const objectStore = transaction.objectStore(this.table);
        const request = objectStore.put(this.parseModel(model, false));
        return new Promise((ok, err) => {
            request.onsuccess = function () {
                ok();
            }
            request.onerror = function () {
                console.log(this.error);
                err(this.error?.message);
            }
        });
    }

    delete(model: T): Promise<void> {
        const transaction = this.db.transaction(this.table, "readwrite");
        const objectStore = transaction.objectStore(this.table);
        const request = objectStore.delete(model.id!);
        return new Promise((ok, err) => {
            request.onsuccess = function () {
                ok();
            }
            request.onerror = function () {
                console.log(this.error);
                err(this.error?.message);
            }
        });
    }

    protected parseModel(model: any, removerId: boolean) {
        return JSON.parse(JSON.stringify(model, (key, value) => removerId && key == 'id' ? undefined : value));
    }
}