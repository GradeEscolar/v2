import { AxiosStatic } from "axios";
import LoginRepository from "@/Repositories/LoginRepository";
import Usuario from "@/Models/Usuario";

export default class LoginService {

    private repository: LoginRepository;

    constructor(axios: AxiosStatic) {
        this.repository = new LoginRepository(axios);
        this.repository.config();
    }

    async login(usuario: Usuario): Promise<string> {
        const result = await this.repository.login(usuario);
        return result.access_token;
    }
}