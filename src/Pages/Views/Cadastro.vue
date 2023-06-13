<template>
    <section class="form">
        <form @submit.prevent="cadastrarUsuario">

            <p style="text-align: center;">
                Todos os dados da sua Grade Escolar serão gravados somente neste dispositivo, <br />
                sendo assim, você precisa informar apenas seu nome para ter acesso.
            </p>

            <div class="field">
                <label for="nome">Informe seu nome.</label>
                <input type="text" id="nome" v-model="usuario.nome" autofocus @keyup="limparErro()" @change="limparErro()" />
            </div>

            <div class="button">
                <button type="submit">Entrar</button>
                <mark v-if="submitResult">{{ submitResult }}</mark>
            </div>

            <p style="text-align: left;">
                <br />
                <br />
                Atenção!<br />
                Esta versão da Grade Escolar não faz uso de servidores para armazenarmento de dados.<br />
                Todos os dados são armazenados no seu navegador, por este motivo não utilize uma janela anônima.<br />
                Ao limpar os cookies e dados do site todas as informações da Grade Escolar serão eliminadas!<br />
                Você poderá criar uma cópia de segurança dos seus dados a qualquer momento, caso precise remover os cookies
                e dados do site ou mesmo trocar de dispositivo.
            </p>

        </form>


    </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Usuario from '@/Models/Usuario';
import LoginService from '@/Services/LoginService';

export default defineComponent({
    name: 'CadastroView',

    data(): {
        service: LoginService,
        usuario: Usuario,
        submitResult: string | undefined
    } {
        return {
            service: new LoginService(),
            usuario: new Usuario(),
            submitResult: undefined
        }
    },

    computed: {
        formValido() {
            return this.usuario.nome && this.usuario.nome.trim() != '';
        }
    },

    emits: ['goToPage'],

    methods: {

        goToPage(page: string) {
            this.$emit('goToPage', page);
        },

        limparErro() {
            if(this.submitResult)
                this.submitResult = undefined;
        },

        async cadastrarUsuario() {

            if (!this.usuario.nome || this.usuario.nome.trim() == '') {
                this.submitResult = 'Informe um nome de usuário.';
                return;
            }

            try {
                this.submitResult = undefined;
                await this.service.cadastrar(this.usuario.nome);
                this.usuario = new Usuario();
                this.submitResult = undefined;
                this.goToPage('Menu');
            }
            catch (error: any) {
                this.submitResult = error ?? 'Falha ao cadastrar usuário!';
            }
        }
    },

    async mounted() {
        if (!(await this.service.config())) {
            this.goToPage('Home');
        }
    },
});
</script>

<style scoped>
section.form {
    text-align: center;
}

p {
    color: var(--disabled-text-color);
    font-size: 10pt;
}

input {
    text-align: center;
}
</style>