import { AxiosStatic } from "axios";

export default interface IDataContext {
    get source(): IDBDatabase | AxiosStatic | undefined;
    config(): Promise<void> | void;
}