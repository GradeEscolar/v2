<template>
    <section class="form">
        <form @submit.prevent="signIn()">
            <div class="field">
                <label for="email">E-Mail</label>
                <input type="email" id="email" v-model="usuario.email" 
                    autocomplete="email" />
            </div>

            <div class="field">
                <label for="email">Senha</label>
                <input type="password" id="senha" v-model="usuario.senha" 
                    autocomplete="current-password" />
            </div>

            <div class="button">
                <button type="submit" :disabled="!formValido">Entrar</button>
                <mark class="error" v-if="result">{{ result }}</mark>
            </div>

        </form>
    </section>

    <p>
        se ainda não possui cadastro...<br />
    <div @click="goToPage('Cadastro')">
        <i class="pi pi-id-card"></i>
        cadastre-se aqui.
    </div>

    </p>

    <p>
        se não quer se cadastrar...<br />
    <div @click="acessoLocal()">
        <i class="pi pi-arrow-circle-down"></i>
        acesso local.
    </div>
    </p>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Usuario from '@/Models/Usuario';
import LoginService from '@/Services/LoginService';

export default defineComponent({
    name: 'LoginView',

    data(): {
        service: LoginService,
        result: string | undefined,
        usuario: Usuario,
        emailPattern: RegExp,
        senhaPattern: RegExp
    } {
        return {
            service: new LoginService(this.axios),
            result: undefined,
            usuario: new Usuario(),
            emailPattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
            senhaPattern: /.{4,}/
        }
    },

    computed: {
        formValido() {
            if (!this.usuario.email || !this.usuario.senha) {
                return false;
            }

            let emailValido = this.emailPattern.test(this.usuario.email);
            let senhaValida = this.senhaPattern.test(this.usuario.senha);

            return emailValido && senhaValida;
        }
    },

    emits: ['goToPage'],

    methods: {
        goToPage(page: string) {
            this.$emit('goToPage', page);
        },

        async signIn() {
            try {
                this.result = undefined;
                let access_token = await this.service.login(this.usuario);
                this.usuario = new Usuario();
                localStorage.setItem('access_token', access_token);
                this.goToPage('Menu');
            }
            catch (error: any) {
                this.result = error ?? 'Houve uma falha no servidor.';
            }
        },

        acessoLocal() {
            localStorage.setItem('access_token', 'local_access');
            this.goToPage('Menu');
        }
    }
})
</script>
<style scoped>
p {
    margin-top: 50px;
    text-align: center;
    font-size: 10pt;
    color: gray;
}

p div {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    margin-top: 10px;
    cursor: pointer;
    color: black;
    font-size: 11pt;
}

p div:hover {
    text-shadow: 0 0 1px var(--lnk-hover-color);
}

p div i {
    font-size: 20pt;
}
</style>