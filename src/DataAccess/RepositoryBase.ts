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

    count(transaction?: IDBTransaction): Promise<number> {
        transaction = transaction ?? this.db.transaction(this.table, "readonly");
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

    protected findOnly(indexName: string, indexValue: any, transaction?: IDBTransaction): Promise<T[]> {
        transaction = transaction ?? this.db.transaction(this.table, "readonly");
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

    getById(id: number, transaction?: IDBTransaction): Promise<T> {
        const table = this.table;
        transaction = transaction ?? this.db.transaction(this.table, "readonly");
        const objectStore = transaction.objectStore(this.table);
        const request = objectStore.get(id);
        return new Promise((ok, err) => {
            request.onsuccess = function () {
                ok(this.result);
            }
            request.onerror = function () {
                console.error(`DisciplinaRepository.getById(${id})`, table, this.error);
                err(this.error?.message);
            }
        });
    }

    getAll(transaction?: IDBTransaction): Promise<T[]> {
        transaction = transaction ?? this.db.transaction(this.table, "readonly");
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

    post(model: T, transaction?: IDBTransaction): Promise<T[]> {
        return this.getAll(transaction);
    }

    add(model: T, transaction?: IDBTransaction): Promise<void> {
        const table = this.table;
        transaction = transaction ?? this.db.transaction(table, "readwrite");
        const objectStore = transaction.objectStore(table);
        const request = objectStore.add(this.parseModel(model, true));
        return new Promise((ok, err) => {
            request.onsuccess = function () {
                model.id = this.result as number;
                ok();
            };
            request.onerror = function () {
                console.error('RepositoryBase.add', table, model, this.error);
                err(this.error?.message);
            };
        });
    }

    put(model: T, transaction?: IDBTransaction): Promise<void> {
        const table = this.table;
        transaction = transaction ?? this.db.transaction(table, "readwrite");
        const objectStore = transaction.objectStore(table);
        const request = objectStore.put(this.parseModel(model, false));

        return new Promise((ok, err) => {
            request.onsuccess = function () {
                ok();
            };
            request.onerror = function () {
                console.error('RepositoryBase.put', table, model, this.error);
                err(this.error?.message);
            };
        });
    }

    delete(model: T, transaction?: IDBTransaction): Promise<void> {
        transaction = transaction ?? this.db.transaction(this.table, "readwrite");
        const objectStore = transaction.objectStore(this.table);
        const request = objectStore.delete(model.id!);
        return new Promise((ok, err) => {
            request.onsuccess = function () {
                ok();
            };
            request.onerror = function () {
                console.error('DisciplinaRepository.delete', model, this.error);
                err(this.error?.message);
            };
        });
    }

    deleteByIndex(indexName: string, value: any, transaction?: IDBTransaction): Promise<void> {
        return new Promise<void>((ok, err) => {
            const table = this.table;
            transaction = transaction ?? this.db.transaction(this.table, "readwrite");
            const objectStore = transaction.objectStore(table);
            const index = objectStore.index(indexName);
            const request = index.openCursor(IDBKeyRange.only(value));
            request.onsuccess = function () {
                const cursor = this.result;
                if (cursor) {
                    const requestDelete = cursor.delete();
                    requestDelete.onsuccess = function () {
                        cursor.continue();
                    };
                    requestDelete.onerror = function () {
                        console.error(`deleteByIndex.request: ${table}.${indexName}`, this.error);
                        err(this.error?.message);
                    };
                } else {
                    ok();
                }
            }
            request.onerror = function () {
                console.error(`deleteByIndex: ${table}.${indexName}`, this.error);
                err(this.error?.message);
            }
        });
    }

    clear(transaction?: IDBTransaction): Promise<void> {
        return new Promise<void>((ok, err) => {
            const table = this.table;
            transaction = transaction ?? this.db.transaction(this.table, "readwrite");
            const objectStore = transaction.objectStore(table);
            const request = objectStore.clear();
            request.onsuccess = function () {
                ok();
            };
            request.onerror = function () {
                console.error(`clear: ${table}`, this.error);
                err(this.error?.message);
            }
        });
    }

    protected parseModel(model: any, removerId: boolean) {
        return JSON.parse(JSON.stringify(model, (key, value) => removerId && key == 'id' ? undefined : value));
    }

    createTransaction(storeNames: string | Iterable<string>): IDBTransaction {
        return this.db.transaction(storeNames, "readwrite");
    }
}