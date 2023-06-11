import IModel from "@/Models/IModel";

export default interface IRepository<T extends IModel> {
    config(): Promise<void> | void;
    get acessoLocal(): boolean;
    get(): Promise<T[]>;
    post(model: T): Promise<T[]>;
    put(model: T): Promise<void>;
    patch(model: T): Promise<void>;
    delete(model: T): Promise<void>;
}