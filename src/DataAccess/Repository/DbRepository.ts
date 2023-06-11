import IModel from "@/Models/IModel";
import IRepository from "./IRepository";
import DbDataContext from "../DataContext/DbDataContext";

export default abstract class DbRepository<T extends IModel> extends DbDataContext implements IRepository<T> {
    
    protected get db(): IDBDatabase {
        return this.source as IDBDatabase;
    }

    public get acessoLocal(): boolean {
        return true;
    }

    protected table: string;

    constructor(table: string) {
        super();
        this.table = table;
    }

    get(): Promise<T[]> {
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
        return this.get();
    }

    put(model: T): Promise<void> {
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