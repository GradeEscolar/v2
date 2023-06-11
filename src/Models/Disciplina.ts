import IModel from "./IModel";

export default class Disciplina implements IModel {
    id: number | undefined;
    id_usuario: number | undefined;
    disciplina: string | undefined;
}