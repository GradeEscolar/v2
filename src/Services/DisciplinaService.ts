import Disciplina from "@/Models/Disciplina";
import ServiceBase from "@/DataAccess/ServiceBase";
import DisciplinaRepository from "@/Repositories/DisciplinaRepository";
import AuthService from "@/Services/AuthService";
import AppConfig from "@/AppConfig";
import AnotacaoRepository from "@/Repositories/AnotacaoRepository";
import AulaRepository from "@/Repositories/AulaRepository";

export default class DisciplinaService extends ServiceBase<DisciplinaRepository> {

    private aulaRepository: AulaRepository;
    private anotacaoRepository: AnotacaoRepository;

    constructor() {
        super();
        this.aulaRepository = new AulaRepository();
        this.anotacaoRepository = new AnotacaoRepository();
    }

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

    async obter() {
        const disciplinas = await this.repository.obter(AuthService.usuario.id ?? 0);
        return this.sort(disciplinas);
    }

    atualizar(disciplina: Disciplina) {
        return this.repository.atualizar(disciplina);
    }

    excluir(disciplina: Disciplina) {
        return new Promise<void>(async (ok, err) => {
            const transaction = this.repository.createTransaction([AppConfig.disciplinaTable, AppConfig.aulaTable, AppConfig.anotacaoTable]);
            const excluirAnotacao = this.anotacaoRepository.deleteByIndex('disciplina', disciplina.id!, transaction);
            const excluirAula = this.aulaRepository.deleteByIndex('disciplina', disciplina.id!, transaction);
            const excluirDisciplina = this.repository.delete(disciplina, transaction);
            await Promise.all([excluirAnotacao, excluirAula, excluirDisciplina]);
            transaction.oncomplete = function() {
                ok();
            }
            transaction.onerror = function () {
                console.error('DisciplinaService.excluir:', disciplina, this.error);
                err(this.error?.message);
            }
        })
    }
}