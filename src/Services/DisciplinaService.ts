import Disciplina from "@/Models/Disciplina";
import ServiceBase from "@/DataAccess/ServiceBase";
import DisciplinaRepository from "@/Repositories/DisciplinaRepository";
import AuthService from "@/Services/AuthService";

export default class DisciplinaService extends ServiceBase<DisciplinaRepository> {


    config(): Promise<boolean> {
        return this.baseConfig(() => new DisciplinaRepository());
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
        disciplina.id_usuario = AuthService.usuario.id;
        return this.repository.criar(disciplina);
    }

    obter() {
        return this.repository.obter(AuthService.usuario.id ?? 0);
    }

    atualizar(disciplina: Disciplina) {
        return this.repository.atualizar(disciplina);
    }

    excluir(disciplina: Disciplina) {
        return this.repository.excluir(disciplina);
    }
}