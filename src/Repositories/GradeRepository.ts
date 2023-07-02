import Grade from "@/Models/Grade";
import RepositoryBase from "@/DataAccess/RepositoryBase";
import AppConfig from "@/AppConfig";
import AuthService from "@/Services/AuthService";

export default class GradeRepository extends RepositoryBase<Grade> {

    constructor() {
        super(AppConfig.gradeTable);
    }

    obter(): Promise<Grade[]> {
        return this.findOnly('usuario', AuthService.usuario.id ?? 0);
    }

    atualizar(grade: Grade): Promise<void> {
        return this.put(grade);
    }

    async importarGrade(grade: Grade, transaction: IDBTransaction): Promise<Grade> {
        const gradesDb = await this.findOnly('usuario', AuthService.usuario.id ?? 0, transaction);
        const gradeDb = gradesDb[0];
        gradeDb.aulas = grade.aulas;
        gradeDb.dias = grade.dias;
        await this.put(gradeDb, transaction);
        return gradeDb;
    }
}