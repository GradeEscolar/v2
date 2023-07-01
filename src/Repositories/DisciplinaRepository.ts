import Disciplina from "@/Models/Disciplina";
import RepositoryBase from "@/DataAccess/RepositoryBase";
import AppConfig from "@/AppConfig";

export default class DisciplinaRepository extends RepositoryBase<Disciplina> {

    constructor() {
        super(AppConfig.disciplinaTable);
    }

    criar(disciplina: Disciplina): Promise<void> {
        return this.add(disciplina);
    }

    obter(id_usuario: number, transaction?:IDBTransaction): Promise<Disciplina[]> {
        return this.findOnly('usuario', id_usuario, transaction);
    }

    atualizar(disciplina: Disciplina): Promise<void> {
        return this.put(disciplina);
    }

    excluir(id_disciplina: number, transaction?: IDBTransaction): Promise<void> {
        return this.excluir(id_disciplina, transaction);
    }
}