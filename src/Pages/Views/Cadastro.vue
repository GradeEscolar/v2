<template>
    <section class="form">
        <form @submit.prevent="cadastrarUsuario">
            <div class="field">
                <label for="nome">Nome</label>
                <input type="text" id="nome" v-model="usuario.nome" />
            </div>
            
            <div class="field">
                <label for="email">E-Mail</label>
                <input type="email" id="email" v-model="usuario.email" autocomplete="email" />
            </div>
            
            <div class="field">
                <label for="email">Senha</label>
                <input type="password" id="senha" v-model="usuario.senha" autocomplete="new-password"/>
            </div>
            
            <div class="button">
                <button type="submit" :disabled="!formValido">Cadastrar</button>
                <mark v-if="submitResult">{{ submitResult }}</mark>
            </div>
        </form>
    </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Usuario from '@/Models/Usuario';
import UsuarioService from '@/Services/UsuarioService';

export default defineComponent({
    name: 'CadastroView',

    data(): {
        service: UsuarioService,
        usuario: Usuario,
        submitResult: string | undefined,
        nomePattern: RegExp,
        emailPattern: RegExp,
        senhaPattern: RegExp
    } {
        return {
            service: new UsuarioService(this.axios),
            usuario: new Usuario(),
            submitResult: undefined,
            nomePattern: /.{4,}/,
            emailPattern: /[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$/,
            senhaPattern: /.{4,}/
        }
    },

    computed: {
        formValido() {
            if (!this.usuario.email || !this.usuario.senha || !this.usuario.nome){
                return false;
            }

            let nomeValido = this.nomePattern.test(this.usuario.nome);
            let emailValido = this.emailPattern.test(this.usuario.email);
            let senhaValida = this.senhaPattern.test(this.usuario.senha);
            return nomeValido && emailValido && senhaValida;
        }
    },
    emits: ['goToPage'],
    methods: {
        goToPage(page: string) {
            this.$emit('goToPage', page);
        },
        async cadastrarUsuario() {
            this.submitResult = undefined;
            this.usuario.id = undefined;
            try {
                await this.service.cadastrar(this.usuario);
                this.usuario = new Usuario();
                this.submitResult = "Ok!";
            }
            catch (error: any) {
                this.submitResult = error ?? 'Falha ao cadastrar usuário!';
            }
        }
    }
});
</script>