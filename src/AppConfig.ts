export default class AppConfig {
    public static db: string = process.env.VUE_APP_GE_DB;
    public static usuarioTable: string = process.env.VUE_APP_GE_USUARIO_TABLE;
    public static gradeTable: string = process.env.VUE_APP_GE_GRADE_TABLE;
    public static disciplinaTable: string = process.env.VUE_APP_GE_DISCIPLINA_TABLE;
    public static anotacaoTable: string = process.env.VUE_APP_GE_ANOTACAO_TABLE;
    public static aulaTable: string = process.env.VUE_APP_GE_AULA_TABLE;
}