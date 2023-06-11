import IModel from "./IModel";

export default class Grade implements IModel {
    id: number = 0;
    id_usuario: number = 0;
    aulas: number = 0;
    dias: string = '';
}