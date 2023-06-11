import Usuario from "@/Models/Usuario";
import UsuarioRepository from "@/Repositories/UsuarioRepository";
import { AxiosStatic } from "axios";

export default class UsuarioService {
    private repository: UsuarioRepository;

    constructor(axios: AxiosStatic) {
        this.repository = new UsuarioRepository(axios);
        this.repository.config();
    }

    cadastrar(usuario: Usuario): Promise<void> {
        return this.repository.cadastrar(usuario);
    }
} 