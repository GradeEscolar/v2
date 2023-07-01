import ServiceBase from "@/DataAccess/ServiceBase";
import Backup from "@/Models/Backup";
import UsuarioRepository from "@/Repositories/UsuarioRepository";
import AuthService from "./AuthService";
import GradeRepository from "@/Repositories/GradeRepository";
import DisciplinaRepository from "@/Repositories/DisciplinaRepository";
import AulaRepository from "@/Repositories/AulaRepository";
import AnotacaoRepository from "@/Repositories/AnotacaoRepository";
import AppConfig from "@/AppConfig";
import Aula from "@/Models/Aula";
import Anotacao from "@/Models/Anotacao";

export default class BackupService extends ServiceBase<UsuarioRepository> {

    private gradeRepository: GradeRepository;
    private disciplinaRepository: DisciplinaRepository;
    private aulaRepository: AulaRepository;
    private anotacaoRepository: AnotacaoRepository;

    constructor() {
        super();
        this.gradeRepository = new GradeRepository();
        this.disciplinaRepository = new DisciplinaRepository();
        this.aulaRepository = new AulaRepository();
        this.anotacaoRepository = new AnotacaoRepository();
    }

    config(): Promise<boolean> {
        return this.baseConfig(() => new UsuarioRepository());
    }

    async criar(): Promise<Blob> {
        const id_usuario = AuthService.usuario.id!;
        try {
            const obterUsuario = this.repository.getById(id_usuario);
            const obterGrades = this.gradeRepository.getAll();
            const obterDisciplinas = this.disciplinaRepository.getAll();
            const obterAulas = this.aulaRepository.getAll();
            const obterAnotacoes = this.anotacaoRepository.getAll();

            const [usuario, grades, disciplinas, aulas, anotacoes] = await Promise.all([obterUsuario, obterGrades, obterDisciplinas, obterAulas, obterAnotacoes]);

            const backup = new Backup();
            backup.usuario = usuario;
            backup.grade = grades.find(g => g.id_usuario == id_usuario);
            backup.disciplinas = disciplinas.filter(d => d.id_usuario == id_usuario);
            backup.aulas = aulas.filter(a => a.id_grade == backup.grade!.id);
            backup.anotacoes = anotacoes.filter(a => backup.disciplinas!.some(d => d.id == a.id_disciplina));

            const fileContent = btoa(JSON.stringify(backup));
            const file = new Blob([fileContent], { type: "text/plain" });

            return file;
        } catch (error) {
            console.error('BackupService.criar', error);
            throw new Error("Houve uma falha na criação do backup.");
        }
    }

    async importar(file: File): Promise<void> {
        return new Promise<void>(async (ok, err) => {
            const backup = await this.obterBackup(file);
            const transaction = this.repository.createTransaction([AppConfig.disciplinaTable, AppConfig.gradeTable, AppConfig.aulaTable, AppConfig.anotacaoTable]);
            await this.importarDados(backup, transaction);
            transaction.oncomplete = function() {
                ok();
            };
            transaction.onerror = function() {
                console.error('BackupService.importar', this.error);
                throw new Error("Houve uma falha na importação do backup.");
            }
        });
    }

    private async importarDados(backup: Backup, transaction: IDBTransaction): Promise<void> {

        backup.usuario = AuthService.usuario;
        if (!backup.grade) return;

        backup.grade = await this.gradeRepository.importarGrade(backup.grade, transaction);

        await this.excluirDadosAtuais(transaction);

        if (!backup.disciplinas) return;

        backup.disciplinas.forEach(async disciplina => {
            const aulas = backup.aulas?.filter(a => a.id_disciplina == disciplina.id);
            const anotacoes = backup.anotacoes?.filter(a => a.id_disciplina == disciplina.id);

            disciplina.id_usuario = backup.usuario!.id;
            await this.disciplinaRepository.add(disciplina, transaction);

            const importarAulas = this.importarAulas(transaction, backup.grade!.id, disciplina.id!, aulas);
            const importarAnotacoes = this.importarAnotacoes(transaction, disciplina.id!, anotacoes);

            await Promise.all([importarAulas, importarAnotacoes]);
        });
    }

    private async importarAnotacoes(transaction: IDBTransaction, id_disciplina: number, anotacoes?: Anotacao[]): Promise<void> {
        if (!anotacoes) return;
        anotacoes.forEach(async anotacao => {
            anotacao.id_disciplina = id_disciplina;
            await this.anotacaoRepository.add(anotacao, transaction);
        });
    }

    private async importarAulas(transaction: IDBTransaction, id_grade: number, id_disciplina: number, aulas?: Aula[]): Promise<void> {
        if (!aulas) return;
        aulas.forEach(async aula => {
            aula.id_grade = id_grade;
            aula.id_disciplina = id_disciplina;
            await this.aulaRepository.add(aula, transaction);
        });
    }

    private async excluirDadosAtuais(transaction: IDBTransaction) {
        const disciplinas = await this.disciplinaRepository.obter(AuthService.usuario.id!, transaction);
        disciplinas.forEach(async d => {
            const excluirAnotacao = this.anotacaoRepository.excluirPorDisciplina(d.id!, transaction);
            const excluirAula = this.aulaRepository.excluirPorDisciplina(d.id!, transaction);
            const excluirDisciplina = this.disciplinaRepository.excluir(d.id!, transaction);
            await Promise.all([excluirAnotacao, excluirAula, excluirDisciplina]);
        });
    }

    private obterBackup(file: File): Promise<Backup> {
        return new Promise<Backup>((ok, err) => {
            try {
                const reader = new FileReader();
                reader.readAsText(file);
                reader.onload = function () {
                    const fileContent = this.result as string;
                    const backup = JSON.parse(atob(fileContent)) as Backup;
                    ok(backup);
                };
            } catch (error) {
                console.log('BackupService.obterBackup', error);
                err(error);
            }
        });
    }

    private zeroFill(num: number, length: number): string {
        return num.toString().padStart(length, '0');
    }

    private getDataAtualFormatada(): string {
        const data = new Date();
        const ano = this.zeroFill(data.getFullYear(), 4);
        const mes = this.zeroFill(data.getMonth() + 1, 2);
        const dia = this.zeroFill(data.getDate(), 2);
        const horas = this.zeroFill(data.getHours(), 2);
        const minutos = this.zeroFill(data.getMinutes(), 2);
        const segundos = this.zeroFill(data.getSeconds(), 2);

        return `${ano}${mes}${dia}_${horas}${minutos}${segundos}`;
    }

    obterNomeArquivo() {
        const userName = AuthService.usuario.nome!.replace(' ', '').toLowerCase();
        const data = this.getDataAtualFormatada();
        return `grade_escolar_${userName}_${data}.ge_bkp`;
    }
}