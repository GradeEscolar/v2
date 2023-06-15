<template>
    <section class="form">
        <form @submit.prevent="submit()" @reset.prevent="reset()">

            <div class="field">
                <label for="disciplina">Disciplina</label>
                <input type="text" id="disciplina" v-model="disciplina.disciplina" autofocus ref="disciplinaInput" @keypress="clearResult()" @change="clearResult()" />
            </div>

            <div class="button">
                <span v-if="!disciplinaSelecionada">
                    <button type="submit" id="add">Incluir</button>
                </span>
                <span v-else>
                    <button type="submit" id="upd">Salvar</button>
                    <button type="button" id="del" @click="del()">Excluir</button>
                    <button type="reset" id="abt">Cancelar</button>
                </span>
                <mark class="error" v-if="result">{{ result }}</mark>
            </div>
        </form>
    </section>

    <section class="table">
        <table>
            <tbody>
                <tr class="hover" v-for="disciplina in disciplinas" @click="selecionar(disciplina)">
                    <td :class="{ selecionada: disciplinaAtiva(disciplina) }">{{ disciplina.disciplina }}</td>
                </tr>
            </tbody>
        </table>
    </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Disciplina from '@/Models/Disciplina'
import DefaultResponse from '@/api/DefaultResponse';
import Auth from '@/api/Auth';
import DisciplinaService from '@/Services/DisciplinaService';

export default defineComponent({
    name: 'DisciplinaConfigView',

    data(): {
        service: DisciplinaService,
        result: string | undefined,
        disciplina: Disciplina,
        disciplinaSelecionada: Disciplina | undefined,
        disciplinas: Disciplina[] | undefined
    } {
        return {
            service: new DisciplinaService(),
            result: undefined,
            disciplina: new Disciplina(),
            disciplinaSelecionada: undefined,
            disciplinas: undefined
        }
    },

    emits: ['goToPage'],

    methods: {
        goToPage(page: string) {
            this.$emit('goToPage', page);
        },
        async obter() {
            try {
                this.disciplinas = await this.service.obter();
            } catch (error: any) {
                this.result = "Houve uma falha ao obter as disciplinas.";
                this.disciplinas = new Array<Disciplina>();
            }

            this.disciplina = new Disciplina();
            this.disciplinaSelecionada = undefined;
            this.result = undefined;
            this.focus();
        },
        focus() {
            let input = this.$refs.disciplinaInput as HTMLInputElement;
            input.focus();
        },
        async submit() {

            if(!this.disciplina.disciplina || this.disciplina.disciplina.trim() == '') {
                this.result = 'Informe o nome da disciplina.';
                return;
            }

            if (this.disciplinas?.find(d => d.disciplina?.toLowerCase() == this.disciplina.disciplina?.toLowerCase()) != undefined) {
                this.result = 'A disciplina informada já existe.';
                return;
            }

            try {
                if (!this.disciplinaSelecionada)
                    await this.service.criar(this.disciplina);
                else
                    await this.service.atualizar(this.disciplina);

                await this.obter();
            } catch (error: any) {
                this.result = 'Ocorreu um erro ao salvar a disciplina.'
                console.log(error);
            }
        },
        reset() {
            this.disciplina = new Disciplina();
            this.disciplinaSelecionada = undefined;
            this.focus();
        },
        async del() {
            try {
                await this.service.excluir(this.disciplina);
                await this.obter();
            } catch (error: any) {
                let response = error.response.data as DefaultResponse;
                this.result = response.message;
            }
        },
        selecionar(disciplina: Disciplina) {
            this.disciplinaSelecionada = this.service.clone(disciplina)
            this.disciplina = this.disciplinaSelecionada
            this.focus();
        },
        disciplinaAtiva(disciplina: Disciplina): boolean {
            return this.disciplinaSelecionada?.id == disciplina.id;
        },
        clearResult() {
            if(this.result)
                this.result = undefined;
        }
    },

    async mounted() {
        if (!Auth.autenticado || !(await this.service.config())){
            this.goToPage('Home');
            return;
        }
        
        await this.obter();
    }
})
</script>

<style scoped>
section.form {
    position: sticky;
    top: 0;
    background-color: white;
    border-bottom: 1px solid var(--menu-border-color);
    box-shadow: 0 0 2px 2px white;
}
</style>