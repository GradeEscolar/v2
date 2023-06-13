<template>
    <div id="header">
        <div id="back" :style="{ visibility: back ? 'visible' : 'hidden' }" @click="goToPage(backTo)">
            <i class="no-print pi pi-chevron-left"></i>
        </div>
        <div id="icon">
            <i :class="icon"></i>
        </div>
        <div id="title">
            {{ title }}
        </div>
        <div id="login" v-if="login" @click="doLogin()">
            <i class="pi pi-sign-in"></i>
            <span>Entrar</span>
        </div>
        <div id="sair" v-if="sair" @click="doSair()">
            <i class="pi pi-sign-out"></i>
            <span>Sair</span>
        </div>
    </div>
</template>

<script lang="ts">
import LoginService from '@/Services/LoginService';
import { defineComponent } from 'vue';

export default defineComponent({
    name: "HeaderComponent",

    data(): {
        loginService: LoginService, 
        back: boolean,
        backTo: string,
        icon: string,
        title: string,
        login: boolean,
        sair: boolean
    } {
        return {
            loginService: new LoginService(),
            back: false,
            backTo: '',
            icon: '',
            title: '',
            login: false,
            sair: false,
        }
    },

    props: {
        page: String,
        hideBackButton: Boolean
    },

    emits: ['goToPage'],

    methods: {
        goToPage(page: string) {
            this.$emit('goToPage', page);
        },
        async doLogin() {
            const dbOk = await this.loginService.config();
            if(!dbOk) {
                return;
            }

            const existeUsuario = await this.loginService.existeUsuario();
            const page = existeUsuario ? 'Login' : 'Cadastro';
            this.goToPage(page);
        },
        doSair() {
            localStorage.removeItem('id_usuario');
            localStorage.removeItem('nome_usuario');
            this.goToPage('Home');
        },
        definirHeader() {
            let page = localStorage.getItem('page');

            if (page == 'Home') {
                this.back = false;
                this.backTo = '';
                this.icon = 'pi pi-table';
                this.title = 'Grade Escolar';
                this.login = true;
                this.sair = false;
            } else if (page == 'Login') {
                this.back = true;
                this.backTo = 'Home';
                this.icon = 'pi pi-sign-in';
                this.title = 'Login';
                this.login = false;
                this.sair = false;
            } else if (page == 'Cadastro') {
                this.back = true;
                this.backTo = 'Home';
                this.icon = 'pi pi-id-card';
                this.title = 'Cadastro';
                this.login = false;
                this.sair = false;
            } else if (page == 'Menu') {
                this.back = false;
                this.backTo = '';
                this.icon = 'pi pi-table';
                this.title = 'Grade Escolar';
                this.login = false;
                this.sair = true;
            } else if (page == 'Aula') {
                this.back = !this.hideBackButton;
                this.backTo = 'Menu';
                this.icon = 'pi pi-file-edit';
                this.title = 'Aulas';
                this.login = false;
                this.sair = false;
            } else if (page == 'Anotacoes') {
                this.back = !this.hideBackButton;
                this.backTo = 'Menu';
                this.icon = 'pi pi-book';
                this.title = 'Anotações';
                this.login = false;
                this.sair = false;
            } else if (page == 'DisciplinaConfig') {
                this.back = true;
                this.backTo = 'Menu';
                this.icon = 'pi pi-cog';
                this.title = 'Disciplinas';
                this.login = false;
                this.sair = false;
            } else if (page == 'GradeConfig') {
                this.back = true;
                this.backTo = 'Menu';
                this.icon = 'pi pi-cog';
                this.title = 'Grade';
                this.login = false;
                this.sair = false;
            } else if (page == 'AulaConfig') {
                this.back = true;
                this.backTo = 'Menu';
                this.icon = 'pi pi-cog';
                this.title = 'Aulas';
                this.login = false;
                this.sair = false;
            }
        }
    },

    mounted() {
        this.definirHeader();
    },

    watch: {
        page() {
            this.definirHeader();
        },
        hideBackButton() {
            this.definirHeader();
        }
    }
})
</script>

<style scoped>
#header {
    display: flex;
    align-items: center;
    background-color: var(--header-background-color);
    height: 60px;
    color: var(--header-text-color);
    box-shadow: 0 0 3px 3px white;
}

#header div:not(:first-child) {
    margin-right: 10px;
}

#back,
#icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
}

#back {
    font-size: 10pt;
}

#back,
#login,
#sair {
    cursor: pointer;
}

#back:hover,
#login:hover,
#sair:hover {
    text-shadow: 0 0 1px gray;
}

#icon {
    background-color: var(--header-icon-box-backgroud-color);
    border: 1px solid var(--header-icon-box-border-color);
    border-radius: 4px;
}

#icon i {
    font-size: 15pt;
    color: var(--header-icon-box-text-color);
}

#title,
#login,
#sair {
    font-family: 'Didact Gothic', sans-serif;
}

#title {
    flex-grow: 1;
    font-size: 18pt;
    font-weight: bold;
}

#login,
#sair {
    display: flex;
    flex-direction: column;
    align-items: center;

}

#login span,
#sair span {
    font-size: 10pt;
}

@media print {
  .no-print {
    display: none;
  }
}
</style>