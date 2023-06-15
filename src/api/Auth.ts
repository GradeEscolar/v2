import Usuario from "@/Models/Usuario";

export default class Auth {

  // Remover
  public static get localAccess(): boolean {
    const access_token = localStorage.getItem('access_token');
    return access_token == 'local_access';
  }

  public static get usuario(): Usuario {
    const usuario = new Usuario();
    const id_usuario = localStorage.getItem('id_usuario');
    const nome_usuario = localStorage.getItem('nome_usuario');

    if (id_usuario != null && nome_usuario != null) {
      usuario.id = parseInt(id_usuario);
      usuario.nome = nome_usuario;
    }

    return usuario;
  }

  public static get autenticado(): boolean {
    const usuario = Auth.usuario;
    return usuario.id != undefined && usuario.nome != undefined;
  }

}