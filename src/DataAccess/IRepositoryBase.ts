import IModel from "@/Models/IModel";

export default interface IRepositoryBase<T extends IModel> {
    config(): Promise<void>;

    count(): Promise<number>;
    getAll(): Promise<T[]>;
    post(model: T): Promise<T[]>;
    add(model: T): Promise<void>;
    put(model: T): Promise<void>;
    delete(model: T): Promise<void>;
}