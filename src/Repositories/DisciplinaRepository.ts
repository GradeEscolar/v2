import Disciplina from "@/Models/Disciplina";
import RepositoryBase from "@/DataAccess/RepositoryBase";
import AppConfig from "@/AppConfig";
import AulaRepository from "./AulaRepository";
import AnotacaoRepository from "./AnotacaoRepository";

export default class DisciplinaRepository extends RepositoryBase<Disciplina> {

    private aulaRepository: AulaRepository;
    private anotacaoRepository: AnotacaoRepository;

    constructor() {
        super(AppConfig.disciplinaTable);
        this.aulaRepository = new AulaRepository();
        this.anotacaoRepository = new AnotacaoRepository();
    }

    criar(disciplina: Disciplina): Promise<void> {
        return this.add(disciplina);
    }

    obter(id_usuario: number): Promise<Disciplina[]> {
        return this.findOnly('usuario', id_usuario);
    }

    atualizar(disciplina: Disciplina): Promise<void> {
        return this.put(disciplina);
    }

    async excluir(disciplina: Disciplina) {
        return new Promise<void>(async (ok, err) => {
            const transaction = this.db.transaction([AppConfig.disciplinaTable, AppConfig.aulaTable, AppConfig.anotacaoTable], "readwrite");
            const excluirAnotacao = this.anotacaoRepository.excluirPorDisciplina(transaction, disciplina.id!);
            const excluirAula = this.aulaRepository.excluirPorDisciplina(transaction, disciplina.id!);
            const excluirDisciplina = this.excluirPorDisciplina(transaction, disciplina.id!);
            await Promise.all([excluirAnotacao, excluirAula, excluirDisciplina]);
            transaction.oncomplete = function() {
                ok();
            }
            transaction.onerror = function () {
                console.error('DisciplinaRepository.excluir:', this.error);
                err(this.error?.message);
            }
        })
        
    }

    private excluirPorDisciplina(transaction: IDBTransaction, id_disciplina: number): Promise<void> {
        return new Promise<void>((ok, err) => {
            const objectStore = transaction.objectStore(AppConfig.disciplinaTable);
            const request = objectStore.delete(id_disciplina);
            request.onsuccess = function () {
                ok();
            }
            request.onerror = function () {
                console.error('DisciplinaRepository.excluirPorDisciplina', this.error);
                err(this.error?.message);
            }
        });
    }
}