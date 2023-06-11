import { AxiosStatic } from "axios";
import Auth from "@/api/Auth";
import Grade from "@/Models/Grade";
import DbRepository from "@/DataAccess/Repository/DbRepository";
import ApiRepository from "@/DataAccess/Repository/ApiRepository";
import DataAccessConfig from "@/DataAccess/DataAccessConfig";

export default interface IGradeRepository {
    config(): Promise<void> | void;
    get acessoLocal(): boolean;

    obter(): Promise<Grade[]>;
    atualizar(grade: Grade): Promise<void>;
}

export class GradeRepositoryFactory {
    static async CreateRepository(axios: AxiosStatic): Promise<IGradeRepository> {
        let repository: IGradeRepository;
        if (Auth.localAccess) {
            repository = new GradeDbRepository();
            await repository.config();
        } else {
            repository = new GradeApiRepository(axios);
            repository.config();
        }

        return repository;
    }
}

export class GradeApiRepository extends ApiRepository<Grade> implements IGradeRepository {

    constructor(axios: AxiosStatic) {
        super(axios, DataAccessConfig.gradeUrl);
    }

    obter(): Promise<Grade[]> {
        return this.get();
    }

    atualizar(grade: Grade): Promise<void> {
        return this.patch(grade);
    }

}

export class GradeDbRepository extends DbRepository<Grade> implements IGradeRepository {

    constructor() {
        super(DataAccessConfig.gradeTable);
    }

    

    obter(): Promise<Grade[]> {
        return this.get();
    }

    atualizar(grade: Grade): Promise<void> {
        return this.patch(grade);
    }

}