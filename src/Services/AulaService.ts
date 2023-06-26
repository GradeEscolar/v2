import Aula from "@/Models/Aula";
import ServiceBase from "@/DataAccess/ServiceBase";
import AulaRepository from "@/Repositories/AulaRepository";
import Grade from "@/Models/Grade";

export default class AulaService extends ServiceBase<AulaRepository> {

    config(): Promise<boolean> {
        return this.baseConfig(() => new AulaRepository());
    }

    obter(grade: Grade, dia: number): Promise<Aula[]> {
        if(grade.dias.indexOf(dia.toString()) == -1){
            return Promise.resolve(new Array<Aula>());
        }
        
        const filtro = new Aula();
        filtro.id_grade = grade.id;
        filtro.dia = dia;
        return this.repository.obter(grade.id, dia, grade.aulas);
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