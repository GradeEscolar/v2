import { AxiosStatic } from "axios";
import Grade from "@/Models/Grade";
import IGradeRepository, { GradeRepositoryFactory } from "@/Repositories/GradeRepository";
import BaseService from "./BaseService";
import DataAccessConfig from "@/DataAccess/DataAccessConfig";

export default class GradeService extends BaseService<IGradeRepository> {
   

    async config(axios: AxiosStatic): Promise<boolean> {
        return this.baseConfig(axios, GradeRepositoryFactory.CreateRepository);
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