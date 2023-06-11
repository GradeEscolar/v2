import { AxiosStatic } from "axios";
import Auth from "@/api/Auth";
import DbRepository from "@/DataAccess/Repository/DbRepository";
import ApiRepository from "@/DataAccess/Repository/ApiRepository";
import Disciplina from "@/Models/Disciplina";
import DataAccessConfig from "@/DataAccess/DataAccessConfig";

export default interface IDisciplinaRepository  {
    config(): Promise<void> | void;
    get acessoLocal(): boolean;

    criar(disciplina: Disciplina): Promise<void>;
    obter(): Promise<Disciplina[]>;
    atualizar(disciplina: Disciplina): Promise<void>;
    excluir(disciplina: Disciplina): Promise<void>;
}

export class DisciplinaRepositoryFactory {
    static async CreateRepository(axios: AxiosStatic): Promise<IDisciplinaRepository> {
        let repository: IDisciplinaRepository;
        if(Auth.localAccess) {
            repository = new DisciplinaDbRepository();
            await repository.config();
        } else {
            repository = new DisciplinaApiRepository(axios);
            repository.config();
        }

        return repository;
    }
}

export class DisciplinaApiRepository extends ApiRepository<Disciplina> implements IDisciplinaRepository {
    
    constructor(axios: AxiosStatic) {
        super(axios, DataAccessConfig.disciplinaUrl);
    }

    criar(disciplina: Disciplina): Promise<void> {
        return this.put(disciplina);
    }

    obter(): Promise<Disciplina[]> {
        return this.get();
    }

    atualizar(disciplina: Disciplina): Promise<void> {
        return this.patch(disciplina);
    }

    excluir(disciplina: Disciplina): Promise<void> {
        return this.delete(disciplina);
    }
}

export class DisciplinaDbRepository extends DbRepository<Disciplina> implements IDisciplinaRepository {

    constructor() {
        super(DataAccessConfig.disciplinaTable);
    }
    
    criar(disciplina: Disciplina): Promise<void> {
        return this.put(disciplina);
    }

    obter(): Promise<Disciplina[]> {
        return this.get();
    }

    atualizar(disciplina: Disciplina): Promise<void> {
        return this.patch(disciplina);
    }

    excluir(disciplina: Disciplina): Promise<void> {
        return this.delete(disciplina);
    }
    
}