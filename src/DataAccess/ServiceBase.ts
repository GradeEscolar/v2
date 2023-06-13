import IModel from "@/Models/IModel";
import IRepositoryBase from "./IRepositoryBase";

export default abstract class ServiceBase<TIRepository extends IRepositoryBase<IModel>> {

    private _repository: TIRepository | undefined;
    protected get repository(): TIRepository {
        return this._repository!;
    }

    private _tabela: string | undefined;
    protected get tabela(): string {
        return this._tabela!;
    }

    abstract config(): Promise<boolean>;

    protected async baseConfig(createRepository: () => TIRepository): Promise<boolean> {
        try {
            this._repository = createRepository();
            await this._repository.config();
            return true;
        } catch (error) {
            return false;
        }
    }

    protected parseModel<T extends IModel>(model: T, removerId: boolean){
        return JSON.parse(JSON.stringify(model, (key, value) => removerId && key == 'id' ? undefined : value));
    }
}