import { AxiosStatic } from "axios";
import BaseService from "./BaseService";
import IAnotacaoRepository, { AnotacaoRepositoryFactory } from "@/Repositories/AnotacaoRepository";
import Aula from "@/Models/Aula";
import Anotacao from "@/Models/Anotacao";
import Disciplina from "@/Models/Disciplina";

export default class AnotacaoService extends BaseService<IAnotacaoRepository> {

    async config(axios: AxiosStatic): Promise<boolean> {
        return this.baseConfig(axios, AnotacaoRepositoryFactory.CreateRepository);
    }

    async obterAnotacao(aula: Aula, data: string): Promise<Anotacao> {
        const filtro = new Anotacao();
        filtro.aula = aula.aula;
        filtro.id_disciplina = aula.id_disciplina!;
        filtro.data = data;
        filtro.modo = 'grade';
        const anotacoes = await this.repository.obter(filtro);
        const anotacao = anotacoes[0];
        if(anotacao)
            anotacao.data = data;
        return anotacao?.id ? anotacao : filtro;
    }

    async obterAnotacoes(disciplina: Disciplina, mes: string): Promise<Anotacao[]> {
        const filtro = new Anotacao();
        filtro.id_disciplina = disciplina.id!;
        filtro.data = `${mes}-01`;
        filtro.modo = 'disciplina';
        const anotacoes = await this.repository.obter(filtro);
        return anotacoes;
    }

    async salvarAnotacao(anotacao: Anotacao): Promise<Anotacao> {
        return this.repository.salvar(anotacao);
    }
}