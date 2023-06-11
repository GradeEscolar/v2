import { AxiosStatic } from "axios";
import Disciplina from "@/Models/Disciplina";
import IDisciplinaRepository, { DisciplinaRepositoryFactory } from "@/Repositories/DisciplinaRepository";
import BaseService from "./BaseService";

export default class DisciplinaService extends BaseService<IDisciplinaRepository> {

    async config(axios: AxiosStatic): Promise<boolean> {
        return this.baseConfig(axios, DisciplinaRepositoryFactory.CreateRepository);
    }

    sort(disciplinas: Disciplina[]): Disciplina[] {
        return disciplinas.sort((a, b) => {
            if (!a.disciplina && !b.disciplina) return 0;
            if (!a.disciplina) return 1;
            if (!b.disciplina) return -1;
            return a.disciplina.localeCompare(b.disciplina);
        });
    }

    clone(disciplina: Disciplina): Disciplina {
        let clone = new Disciplina();
        clone.id = disciplina.id;
        clone.id_usuario = disciplina.id_usuario;
        clone.disciplina = disciplina.disciplina;
        return clone;
    }

    criar(disciplina: Disciplina) {
        return this.repository.criar(disciplina);
    }

    obter() {
        return this.repository.obter();
    }

    atualizar(disciplina: Disciplina) {
        return this.repository.atualizar(disciplina);
    }

    excluir(disciplina: Disciplina) {
        return this.repository.excluir(disciplina);
    }
}