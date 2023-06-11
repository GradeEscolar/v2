import { AxiosStatic } from "axios";
import IDataContext from "./IDataContext";

export default class ApiDataContext implements IDataContext {
    private static source: AxiosStatic | undefined = undefined;
    private _axios: AxiosStatic;

    public get source(): IDBDatabase | AxiosStatic | undefined {
        return ApiDataContext.source;
    }

    constructor(axios: AxiosStatic) {
        this._axios = axios;
    }

    public config(): void {
        if (ApiDataContext.source)
            return;

        ApiDataContext.source = this._axios;
    }
}