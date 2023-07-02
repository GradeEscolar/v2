import AppConfig from "@/AppConfig";
import RepositoryBase from "@/DataAccess/RepositoryBase";
import Grade from "@/Models/Grade";
import Usuario from "@/Models/Usuario";

export default class UsuarioRepository extends RepositoryBase<Usuario> {
    
    constructor() {
        super(AppConfig.usuarioTable);
    }

    async existeUsuario(nome: string): Promise<boolean> {
        const usuarios = await this.findOnly('nome', nome);
        return usuarios.length == 1;
    }

    async criarUsuario(nome: string): Promise<Usuario> {
        return new Promise<Usuario>((ok, err) => {
            const transaction = this.db.transaction([AppConfig.usuarioTable, AppConfig.gradeTable], "readwrite");
            const osUsuario = transaction.objectStore(AppConfig.usuarioTable);
            const osGrade = transaction.objectStore(AppConfig.gradeTable);

            const usuario = new Usuario();
            usuario.nome = nome;

            const requestUsuario = osUsuario.add(this.parseModel(usuario, true));
            requestUsuario.onsuccess = (ev) => {
                usuario.id = (ev.target as IDBRequest<IDBValidKey>).result as number;
                const grade = new Grade();
                grade.id_usuario = usuario.id;
                grade.dias = '2;3;4;5;6';
                grade.aulas = 5;
                const requestGrade = osGrade.add(this.parseModel(grade, true));
                requestGrade.onsuccess = function() {
                    ok(usuario);
                }
                requestGrade.onerror = function() {
                    console.log(this.error);
                    err(this.error?.message);
                }
            }
            requestUsuario.onerror = function() {
                console.log(this.error);
                err(this.error?.message);
            }
        });
    }
}