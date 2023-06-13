<template>
    <section class="table">
        <table>
            <caption>Selecione um usuário para acessar a Grade Escolar.</caption>
            <tbody>
                <tr class="hover" v-for="usuario in usuarios" @click="selecionar(usuario)">
                    <td>{{ usuario.nome }}</td>
                </tr>
            </tbody>
        </table>
    </section>

    <p>
        se deseja criar um novo usuário...<br />
        <div @click="goToPage('Cadastro')">
            <i class="pi pi-id-card"></i>
            cadastre-se aqui.
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
        usuarios: Usuario[] | undefined
    } {
        return {
            service: new LoginService(),
            usuarios: undefined
        }
    },

    emits: ['goToPage'],

    methods: {
        goToPage(page: string) {
            this.$emit('goToPage', page);
        },

        async selecionar(usuario: Usuario) {
            try {
                this.service.selecionar(usuario);
                this.goToPage('Menu');
            }
            catch (error: any) {
                this.goToPage('Home');
            }
        },

        async obterUsuarios() {   
            try {
                this.usuarios = await this.service.obterUsuarios();
            } catch (error) {
                this.goToPage('Home');
            }
        }
    },

    async mounted() {
        if(!(await this.service.config())){
            this.goToPage('Home');
            return;
        }

        await this.obterUsuarios();
    },

})
</script>
<style scoped>

caption {
    margin: 40px 0 40px 0;
}

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