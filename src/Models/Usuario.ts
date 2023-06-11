import IModel from "./IModel";

export default class Usuario implements IModel {
    id: number | undefined;
    nome: string | undefined;
    email: string | undefined;
    senha: string | undefined;
}