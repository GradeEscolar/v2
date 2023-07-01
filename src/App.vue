<template>
  <header>
    <HeaderComponent @go-to-page="goToPage" :page="page" :hide-back-button="hideBackButton" />
  </header>

  <main>

    <section class="main_section">

      <div v-if="page == 'Home'">
        <HomeView @go-to-page="goToPage" />
      </div>

      <div v-if="page == 'Login'">
        <LoginView @go-to-page="goToPage" />
      </div>

      <div v-if="page == 'Cadastro'">
        <CadastroView @go-to-page="goToPage" />
      </div>

      <div v-if="page == 'Menu'">
        <MenuView @go-to-page="goToPage" />
      </div>

      <div v-if="page == 'Aula'">
        <AulaView @go-to-page="goToPage" @hide-back-button="definirHideBackButton" />
      </div>

      <div v-if="page == 'Anotacoes'">
        <AnotacoesView @go-to-page="goToPage" />
      </div>

      <div v-if="page == 'DisciplinaConfig'">
        <DisciplinaConfigView @go-to-page="goToPage" />
      </div>

      <div v-if="page == 'GradeConfig'">
        <GradeConfigView @go-to-page="goToPage" />
      </div>

      <div v-if="page == 'AulaConfig'">
        <AulaConfigView @go-to-page="goToPage" />
      </div>

      <div v-if="page == 'Backup'">
        <BackupView @go-to-page="goToPage" />
      </div>

    </section>

  </main>

  <footer>
    <p>
      <span v-if="usuario.nome">
        Olá, {{ usuario.nome }}!
      </span>
    </p>
    <p>
      Grade Escolar 2023 - v 2.0
    </p>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import HeaderComponent from './Pages/Components/Header.vue';
import HomeView from './Pages/Views/Home.vue';
import LoginView from './Pages/Views/Login.vue';
import CadastroView from './Pages/Views/Cadastro.vue';
import MenuView from './Pages/Views/Menu.vue';
import AulaView from './Pages/Views/Aula.vue';
import AnotacoesView from './Pages/Views/Anotacoes.vue';
import DisciplinaConfigView from './Pages/Views/DisciplinaConfig.vue';
import GradeConfigView from './Pages/Views/GradeConfig.vue';
import AulaConfigView from './Pages/Views/AulaConfig.vue';
import BackupView from './Pages/Views/Backup.vue';
import Usuario from './Models/Usuario';
import AuthService from './Services/AuthService';

export default defineComponent({
  name: 'App',

  components: {
    HeaderComponent,
    HomeView,
    LoginView,
    CadastroView,
    MenuView,
    AulaView,
    AnotacoesView,
    DisciplinaConfigView,
    GradeConfigView,
    AulaConfigView,
    BackupView
  },

  data(): {
    page: string | undefined,
    hideBackButton: boolean,
    usuario: Usuario,

  } {
    return {
      page: undefined,
      hideBackButton: false,
      usuario: AuthService.usuario
    }
  },

  methods: {
    goToPage(page: string) {
      this.page = page;
    },
    definirHideBackButton(hideBackButton: boolean) {
      this.hideBackButton = hideBackButton;
    },
    sair() {
      localStorage.removeItem('access_token');
      this.goToPage('Home');
    },

    handleBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = ''; // Alguns navegadores exigem que essa propriedade seja definida

      // Aqui você pode exibir uma mensagem personalizada para o usuário
      // alert('Deseja realmente sair desta página?');

      // Você também pode redirecionar o usuário para outra página neste ponto
      // window.location.href = '/outra-pagina';
    },
  },

  mounted() {

    let page = localStorage.getItem('page');
    if (page) {
      this.page = page;
    } else {
      localStorage.setItem('page', 'Home')
      this.page = 'Home'
    }

    let hideBackButton = localStorage.getItem('hide_back_button');
    if (hideBackButton) {
      this.hideBackButton = hideBackButton == 's' ? true : false;
    } else {
      localStorage.setItem('hide_back_button', 'n');
    }

    // window.addEventListener('beforeunload', this.handleBeforeUnload);

  },

  watch: {
    page(newPage: string) {
      localStorage.setItem('page', newPage);
      this.usuario = AuthService.usuario;
    },
    hideBackButton(newValue: boolean) {
      localStorage.setItem('hide_back_button', newValue ? 's' : 'n');
    }
  }

});

</script>


<style>
@import url('https://fonts.googleapis.com/css2?family=Didact+Gothic&family=Indie+Flower&family=Lobster+Two&family=Sacramento&display=swap');

:root {
  --header-height: 60px;
  --footer-height: 20px;
  --header-footer-height: 75px;
  --disciplina-form-height: 106px;
  --header-icon-box-border-color: rgb(40, 50, 55);
  --header-icon-box-text-color: rgb(40, 50, 55);
  --header-icon-box-backgroud-color: rgb(240, 250, 255);
  --header-background-color: rgb(70, 70, 70);
  --header-text-color: rgb(210, 210, 210);
  --button-background-color: rgb(60, 60, 150);
  --button-background-color-disabled: rgb(140, 140, 150);
  --button-text-color: rgb(240, 240, 240);
  --menu-border-color: rgb(40, 50, 55);
  --menu-background-color: rgb(240, 250, 255);
  --lnk-hover-color: rgb(0, 60, 155);
  --lnk-color: rgb(0, 60, 155);
  --input-invalid-background-color: rgb(255, 250, 250);
  --input-invalid-border-color: rgb(150, 0, 0);
  --input-border-color: rgb(130, 140, 145);
  --table-border-color: rgb(200, 210, 215);
  --table-hover-backgroud-color: rgb(240, 250, 255);
  --table-selected-backgroud-color: rgb(240, 250, 255);
  --info-border-color: rgb(0, 60, 155);
  --info-background-color: rgb(240, 250, 255);
  --font-family: 'Didact Gothic', sans-serif;
  --blockquote-background-color: rgb(230, 230, 255);
  --blockquote-border-color: rgb(130, 130, 255);
  --evento-background-color: rgb(255, 225, 225);
  --evento-border-color: rgb(155, 100, 100);
  --evento-color: rgb(55, 0, 0);
  --disabled-text-color: rgb(40, 50, 55);

}

/* markdown */

.mk {
  font-family: var(--font-family);
  font-size: 10pt;
}

.mk h1,
.mk h2,
.mk h3,
.mk h4,
.mk h5,
.mk h6 {
  padding: 0 0 2px 5px;
  margin: 4px 0 4px 0;
  border-bottom: 1px solid var(--input-border-color);
}

.mk h1 {
  font-size: 14pt;
}

.mk h2 {
  font-size: 12pt;
}

.mk h3 {
  font-size: 13pt;
  color: var(--evento-color);
  background-color: var(--evento-background-color);
  border: 1px solid var(--evento-border-color);
  border-radius: 5px;
  text-align: center;
  padding: 5px;
  margin: 10px 5px 5px 10px;
}

.mk h4 {
  font-size: 11pt;
}

.mk h5 {
  font-size: 11pt;
}

.mk h6 {
  font-size: 11pt;
}

.mk blockquote {
  padding: 5px;
  margin: 10px 5px 5px 10px;
}

.mk blockquote p {
  margin: 0 0 0 0;
  padding: 5px;
  background-color: var(--blockquote-background-color);
  border-left: 3px solid var(--blockquote-border-color);
  border-radius: 2px;
  font-size: 11pt;
}

/* markdown */


html {
  font-family: var(--font-family);
}

body {
  margin: 0;
}

#app {
  cursor: default;
  display: flex;
}

header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1;
}

main {
  position: fixed;
  width: 100vw;
  top: var(--header-height);
  height: calc(100vh - var(--header-footer-height));
  z-index: 0;
  overflow-y: auto;
}

@media only screen and (hover: none) and (pointer: coarse) {
  section.main_section {
    margin-bottom: 70px;
  }
}

footer {
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: right;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 20px;
  z-index: 1;
  background-color: rgb(250, 250, 250);
  box-shadow: 0 0 2px 2px white;
}

footer p:first-child {
  flex-grow: 1;
  padding: 2px 0 2px 10px;
  color: rgb(40, 50, 55);
  font-size: 9pt;
  font-style: italic;
}

footer p {
  color: rgb(150, 170, 175);
  font-size: 7pt;
  padding: 2px 10px 2px 0;
  margin: 0;
}

/* Form */
section.form {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 5px 10px 5px;
}

form {
  width: 100%;
  max-width: 600px;
}

form div {
  display: flex;
  margin-bottom: 10px;
}

form div:last-child {
  margin-bottom: 0;
}

form div.field {
  flex-direction: column;
}

form div.button {
  flex-direction: row;
}

div.checkboxlist {
  flex-direction: column;
  border: 1px solid var(--input-border-color);
  border-radius: 5px;
  margin-top: 2px;
}

.form div.checkboxlist span {
  padding: 2px;
  margin-left: 10px;
}

label {
  padding-left: 5px;
  padding-bottom: 2px;
}

input,
button,
select {
  padding: 5px;
  border-radius: 5px;
  border: 1px solid var(--input-border-color);
  font-size: 10pt;
}

input:invalid {
  border-color: var(--input-invalid-border-color);
  background-color: var(--input-invalid-background-color);
}

button {
  max-width: 150px;
  min-width: 100px;
  margin-right: 10px;
  border: 1px solid var(--button-background-color);
  background-color: var(--button-background-color);
  color: var(--button-text-color);
  cursor: pointer;
}

button:disabled {
  background-color: var(--button-background-color-disabled);
  cursor: default;
}

input[type=month],
input[type=date] {
  font-size: 10pt;
  font-family: 'Didact Gothic', sans-serif;
  width: auto;
}

select {
  font-family: 'Didact Gothic', sans-serif;
  font-size: 10pt;
}

mark {
  background-color: white;
  border: 1px solid;
  border-radius: 5px;
  flex-grow: 1;
  padding: 4px;
  font-size: 10pt;
}

mark.error {
  border-color: var(--input-invalid-border-color);
}

mark.info {
  border-color: var(--info-border-color);
  background-color: var(--info-background-color);
  text-align: center;
}

div.mark {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 600px;
  padding: 10px 5px 10px 5px;

}

/* form */




/* Table */
section.table {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  padding: 0 5px 10px 5px;
}

table {
  width: 100%;
  max-width: 600px;
  border-collapse: collapse;
}

thead {
  padding-top: 10px;
}

thead tr th {
  padding: 6px 5px 5px 10px;
  font-size: 12pt;
  text-align: left;
}

thead tr th.center {
  text-align: center;
}

table tr {
  border-bottom: 1px solid var(--table-border-color);
}

tbody td {
  padding: 6px;
}

tbody tr.hover:hover {
  cursor: pointer;
  background-color: var(--table-hover-backgroud-color);
}

tbody td.center {
  text-align: center;
}

tbody tr td select {
  width: 100%;
}

.selecionada {
  font-weight: bold;
  background-color: var(--table-selected-backgroud-color);
}


/* Table */


/* Print */

@media print {
  .no-print {
    display: none;
  }
}

/* print */</style>