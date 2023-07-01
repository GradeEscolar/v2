import Anotacao from "./Anotacao";
import Aula from "./Aula";
import Disciplina from "./Disciplina";
import Grade from "./Grade";
import Usuario from "./Usuario";

export default class Backup {
    usuario: Usuario | undefined;
    grade: Grade | undefined;
    disciplinas: Disciplina[] | undefined;
    aulas: Aula[] | undefined;
    anotacoes: Anotacao[] | undefined;
    dataBkp: string | undefined;
}