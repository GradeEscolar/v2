import Grade from "@/Models/Grade";
import ServiceBase from "@/DataAccess/ServiceBase";
import GradeRepository from "@/Repositories/GradeRepository";

export default class GradeService extends ServiceBase<GradeRepository> {
   
    config(): Promise<boolean> {
        return this.baseConfig(() => new GradeRepository());
    }

    async obter(): Promise<Grade> {
        const grades = await this.repository.obter();
        if(grades.length != 1)
            throw new Error("Falha de banco de dados");
            
        return grades[0];
    }

    async atualizar(grade: Grade): Promise<void> {
        return this.repository.atualizar(grade);
    }
}