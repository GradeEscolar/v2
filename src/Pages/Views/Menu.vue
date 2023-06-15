<template>
    
    <section>

        <div class="menu">

            <span class="lnk" @click="goToPage('Aula')">
                <i class="pi pi-file-edit"></i>
                <span>
                    <h1>Aulas</h1>
                    <p>
                        Acesse sua grade escolar.<br />
                        Anote seus conhecimentos.
                    </p>
                </span>
            </span>

            <span class="lnk" @click="goToPage('Anotacoes')">
                <i class="pi pi-book"></i>
                <span>
                    <h1>Anotações</h1>
                    <p>
                        Revise todos os seus conhecimentos.<br />
                    </p>
                </span>
            </span>

            <span class="config">
                <i class="pi pi-cog"></i>
                <span>
                    <h1>Configurações</h1>
                    <p>
                        Personalize sua grade escolar.
                    </p>
                    <div class="submenu">
                        <span @click="goToPage('DisciplinaConfig')">
                            Disciplinas
                        </span>
                        |
                        <span @click="goToPage('GradeConfig')">
                            Grade
                        </span>
                        |
                        <span @click="goToPage('AulaConfig')">
                            Aulas
                        </span>
                    </div>

                </span>
            </span>

        </div>
    </section>
</template>

<script lang="ts">
import AuthService from '@/Services/AuthService';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'MenuView',

    data(): {
    } {
        return {
        };
    },

    emits: ['goToPage'],

    methods: {
        goToPage(page: string) {
            this.$emit('goToPage', page);
        }
    },

    mounted() {
        if (!AuthService.autenticado) {
            this.goToPage('Home');
        }
    }

});
</script>

<style scoped>

section {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.menu {
    max-width: 600px;
    padding: 10px;
}

.lnk,
.config {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 10px 0 25px 0;
    padding-right: 20px;
    border: 1px solid var(--menu-border-color);
    border-radius: 5px;
    background-color: var(--menu-background-color);
}

.lnk {
    cursor: pointer;
}

i {
    font-size: 30px;
    padding: 25px;
}

.lnk i:hover {
    text-shadow: 0 0 1px var(--lnk-hover-color);
}

h1 {
    padding: 0;
    margin: 0;
}

p {
    text-align: start;
    padding: 0;
    margin: 0;
}

.submenu {
    display: flex;
    flex-direction: row;
    width: 100%;
    padding: 5px 0 0 0;
}

.submenu span {
    cursor: pointer;
    margin: 0 10px 0 10px;
    color: var(--lnk-color);
}

.submenu span:hover {
    text-shadow: 0 0 1px var(--lnk-hover-color);
    text-decoration: underline;
    text-decoration-thickness: .01px;
}

.submenu span:first-child {
    margin-left: 0;
}

.submenu span:last-child {
    margin-right: 0;
}
</style>
