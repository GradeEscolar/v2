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

    excluir(transaction: IDBTransaction, id_disciplina: number): Promise<void> {
        return new Promise<void>((ok, err) => {
            const objectStore = transaction.objectStore(AppConfig.disciplinaTable);
            const request = objectStore.delete(id_disciplina);
            request.onsuccess = function () {
                ok();
            }
            request.onerror = function () {
                console.error(`DisciplinaRepository.excluir: ${id_disciplina}`, this.error);
                err(this.error?.message);
            }
        });
    }
}