import IModel from "@/Models/IModel";
import IRepositoryBase from "./IRepositoryBase";

export default abstract class ServiceBase<TRepository extends IRepositoryBase<IModel>> {

    private _repository: TRepository | undefined;
    protected get repository(): TRepository {
        return this._repository!;
    }

    abstract config(): Promise<boolean>;

    protected async baseConfig(createRepository: () => TRepository): Promise<boolean> {
        try {
            this._repository = createRepository();
            await this._repository.config();
            return true;
        } catch (error) {
            return false;
        }
    }

    protected parseModel<T extends IModel>(model: T, removerId: boolean) {
        return JSON.parse(JSON.stringify(model, (key, value) => removerId && key == 'id' ? undefined : value));
    }
}