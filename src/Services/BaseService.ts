import { AxiosStatic } from "axios";
import IModel from "@/Models/IModel";

export default abstract class BaseService<TIRepository> {

    private _repository: TIRepository | undefined;
    protected get repository(): TIRepository {
        return this._repository!;
    }

    private _tabela: string | undefined;
    protected get tabela(): string {
        return this._tabela!;
    }

    protected async baseConfig(axios: AxiosStatic, createRepository: (axios: AxiosStatic) => Promise<TIRepository>): Promise<boolean> {
        try {
            this._repository = await createRepository(axios);
            return true;
        } catch (error) {
            return false;
        }
    }

    protected parseModel<T extends IModel>(model: T, removerId: boolean){
        return JSON.parse(JSON.stringify(model, (key, value) => removerId && key == 'id' ? undefined : value));
    }
}