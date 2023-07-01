import UsuarioRepository from "@/Repositories/UsuarioRepository";
import ServiceBase from "@/DataAccess/ServiceBase";
import Usuario from "@/Models/Usuario";

export default class LoginService extends ServiceBase<UsuarioRepository> {
    
    config(): Promise<boolean> {
        return this.baseConfig(() => new UsuarioRepository());
    }

    async existeUsuario(): Promise<boolean> {
        const qtd = await this.repository.count();
        return qtd > 0;
    }

    async cadastrar(nomeUsuario: string): Promise<void> {
        const existeUsuario = await this.repository.existeUsuario(nomeUsuario);
        if(existeUsuario)
            throw new Error("O nome informado já existe!");

        const usuario = await this.repository.criarUsuario(nomeUsuario);
        this.selecionar(usuario);
    }

    selecionar(usuario: Usuario) {
        localStorage.setItem('id_usuario', usuario.id!.toString());
        localStorage.setItem('nome_usuario', usuario.nome!);
    }

    async obterUsuarios(): Promise<Usuario[]> {
        return this.repository.getAll();
    }
}