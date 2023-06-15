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

    obter(id_usuario: number): Promise<Disciplina[]> {
        return this.findOnly('usuario', id_usuario);
    }

    atualizar(disciplina: Disciplina): Promise<void> {
        return this.put(disciplina);
    }

    excluir(disciplina: Disciplina): Promise<void> {
        return this.delete(disciplina);
    }
    
}