import { AxiosStatic } from "axios";
import BaseService from "./BaseService";
import IAulaRepository, { AulaRepositoryFactory } from "@/Repositories/AulaRepository";
import Aula from "@/Models/Aula";

export default class AulaService extends BaseService<IAulaRepository> {
   

    async config(axios: AxiosStatic): Promise<boolean> {
        return this.baseConfig(axios, AulaRepositoryFactory.CreateRepository);
    }

    obter(id_grade: number, dia: number): Promise<Aula[]> {
        const filtro = new Aula();
        filtro.id_grade = id_grade;
        filtro.dia = dia;
        return this.repository.obter(filtro);
    }

    salvar(aulas: Aula[]): Promise<void> {
        return this.repository.salvar(aulas);
    }

    sort(aulas: Aula[]): Aula[] {
        return aulas.sort((a, b) => {
            return a.aula - b.aula;
        });
    }

}