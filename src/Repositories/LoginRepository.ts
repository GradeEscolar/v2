import { AxiosStatic } from "axios";
import ApiRepository from "@/DataAccess/Repository/ApiRepository";
import Usuario from "@/Models/Usuario";
import DataAccessConfig from "@/DataAccess/DataAccessConfig";
import TokenResponse from "@/api/TokenResponse";

export default class LoginRepository extends ApiRepository<Usuario> {
    
    constructor(axios: AxiosStatic) {
        super(axios, DataAccessConfig.loginUrl);
    }

    login(usuario: Usuario): Promise<TokenResponse> {
        return new Promise<TokenResponse>(async (ok, err) => {
            try {
                const result = await this.axios.post<TokenResponse>(this.url, usuario);
                ok(result.data);
            } catch (error: any) {
                console.log(error);
                err(error?.request?.data?.message);
            }
        });
    }
}