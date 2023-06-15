import Aula from "@/Models/Aula";
import ServiceBase from "@/DataAccess/ServiceBase";
import AulaRepository from "@/Repositories/AulaRepository";

export default class AulaService extends ServiceBase<AulaRepository> {

    config(): Promise<boolean> {
        return this.baseConfig(() => new AulaRepository());
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