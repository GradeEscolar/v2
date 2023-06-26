<template>
    <div class="background">
        <div class="backdrop" @click="msgboxResult(false)">
        </div>
        <div class="box">
            <div class="title">
                <span v-html="titulo"></span>
            </div>
            <div class="message">
                <i :class="icone"></i>
                <span v-html="mensagem"></span>
            </div>
            <div class="footer">
                <button v-if="yes" type="button" @click="msgboxResult(true)">Sim</button>
                <button v-if="no" type="button" @click="msgboxResult(false)">Não</button>
                <button v-if="ok" type="button" @click="msgboxResult(true)">Ok</button>
                <button v-if="cancel" type="button" @click="msgboxResult(false)">Cancelar</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'MsgBoxComponent',

    props: {
        titulo: String,
        mensagem: String,
        icone: String,
        yes: Boolean,
        no: Boolean,
        ok: Boolean,
        cancel: Boolean
    },

    data(): {} { return {} },

    emits: ['msgboxResult'],

    methods: {
        msgboxResult(result: boolean) {
            this.$emit('msgboxResult', result);
        },
        nothing() {

        }
    },

    mounted() { }
});
</script>

<style scoped>
.background {
    position: fixed;
    top: var(--header-height);
    height: calc(100vh - var(--header-footer-height));
    left: 0;
    width: 100vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 8vh;
    background-color: rgba(40, 50, 55, 0.4);
    backdrop-filter: blur(2px);
    z-index: 1;
}

.backdrop {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 2;
}

.box {
    background-color: white;
    border-radius: 10px;
    box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.3);
    margin: 8px;
    z-index: 3;
}

.title {
    background-color: var(--header-background-color);
    color: var(--header-text-color);
    font-size: 13pt;
    text-align: center;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    padding: 5px;
}

.footer {
    background-color: rgb(250, 250, 250);
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 10px;
}

.footer button {
    margin: 0 5px 0 5px;
}

.message {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 20px 0 20px 0;
}

.message i {
    margin: 0 15px 0 15px;
    font-size: 15pt;
}

.message span {
    padding: 5px 5px 5px 0;
}
</style>