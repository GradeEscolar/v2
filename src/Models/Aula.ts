import Grade from "./Grade";
import IModel from "./IModel";

export default class Aula implements IModel {
    id: number | undefined;
    id_grade: number = 0;
    id_disciplina: number | undefined;
    aula: number = 0;
    dia: number = 0;

    static clone(aula: Aula) {
        let clone = new Aula();
        clone.id = aula.id;
        clone.id_grade = aula.id_grade;
        clone.id_disciplina = aula.id_disciplina;
        clone.aula = aula.aula;
        clone.dia = aula.dia;
        return clone
    }

    static montar(grade: Grade, aulasDb: Aula[], dia: number): Aula[] {
        let novasAulas = new Array<Aula>();
        for (let aula = 1; aula <= grade.aulas; aula++) {
            let novaAula = aulasDb.find(a => a.aula == aula && a.id_grade == grade.id && a.dia == dia)
            if (!novaAula) {
                novaAula = {
                    id: undefined,
                    id_grade: grade.id!,
                    aula: aula,
                    dia: dia,
                    id_disciplina: undefined
                };
            }

            novasAulas.push(Aula.clone(novaAula));
        }

        return novasAulas;
    }

    
}