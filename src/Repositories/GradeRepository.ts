import Grade from "@/Models/Grade";
import RepositoryBase from "@/DataAccess/RepositoryBase";
import AppConfig from "@/AppConfig";
import Auth from "@/api/Auth";

export default class GradeRepository extends RepositoryBase<Grade> {

    constructor() {
        super(AppConfig.gradeTable);
    }

    obter(): Promise<Grade[]> {
        return this.findOnly('usuario', Auth.usuario.id ?? 0);
    }

    atualizar(grade: Grade): Promise<void> {
        return this.put(grade);
    }

}