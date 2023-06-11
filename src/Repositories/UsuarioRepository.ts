import { AxiosStatic } from "axios";
import ApiRepository from "@/DataAccess/Repository/ApiRepository";
import Usuario from "@/Models/Usuario";
import DataAccessConfig from "@/DataAccess/DataAccessConfig";

export default class UsuarioRepository extends ApiRepository<Usuario> {
    
    constructor(axios: AxiosStatic) {
        super(axios, DataAccessConfig.usuarioUrl);
    }

    cadastrar(usuario: Usuario): Promise<void> {
        return this.put(usuario);
    }
}