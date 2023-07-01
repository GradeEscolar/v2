<template>
    <section class="form">
        <form>
            <p style="text-align: left;">
                Seus dados serão exportados em um arquivo de texto no formato JSon.<br />
                Realize este backup caso precise remover os cookies
                e dados do site ou trocar de dispositivo.
            </p>
            <div class="button">
                <button type="button" @click="exportar()">Exportar</button>
                <mark v-if="exportResult">{{ exportResult }}</mark>
            </div>
            <hr />
            <p style="text-align: left;">
                Selecione um arquivo de backup e inicie a importação.<br />
                Obs.: Os dados atuais serão substituídos pelo conteúdo do arquivo!
            </p>
            <div class="field">
                <input type="file" accept=".*" @change="selectFile" />
            </div>
            <div class="button">
                <button type="button" :disabled="inputFile == undefined" @click="importar()">Importar</button>
                <mark></mark>
            </div>
        </form>
    </section>

    <MsgBoxComponent v-if="exibirImportar" titulo="Importar Backup"
        mensagem="Os dados atuais serão substituídos pelo conteúdo do arquivo!<br />Você confirma esta importação?"
        icone="pi pi-trash" yes no @msgbox-result="msgboxResult" />

    <a id="download" ref="download"></a>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AuthService from '@/Services/AuthService';
import MsgBoxComponent from '@/Pages/Components/MsgBox.vue';
import BackupService from '@/Services/BackupService';

export default defineComponent({
    name: 'BackupView',

    components: {
        MsgBoxComponent
    },

    data(): {
        service: BackupService,
        exportResult: string | undefined,
        importResult: string | undefined,
        exibirImportar: boolean,
        inputFile: File | undefined
    } {
        return {
            service: new BackupService(),
            exportResult: undefined,
            importResult: undefined,
            exibirImportar: false,
            inputFile: undefined
        }
    },

    emits: ['goToPage'],

    methods: {
        goToPage(page: string) {
            this.$emit('goToPage', page);
        },

        async exportar() {
            try {
                const file = await this.service.criar();
                const a = this.$refs.download as HTMLAnchorElement;
                a.href = URL.createObjectURL(file);
                a.download = this.service.obterNomeArquivo();
                a.click();
                a.href = '';
                a.download = '';
                this.exportResult = 'Exportação concluída!';
            } catch (error) {
                this.exportResult = (error as Error).message;
            }
        },

        async msgboxResult(result: boolean) {
            this.exibirImportar = false;

            if (!result)
                return;

            if (this.inputFile == undefined)
                return;

            try {
                await this.service.importar(this.inputFile);
                this.importResult = "Importação concluída."
            } catch (error) {
                this.importResult = "O arquivo informado não é válido!";
            }
        },

        importar() {
            this.importResult = undefined;
            this.exibirImportar = true;
        },

        selectFile(event: Event) {
            this.inputFile = undefined;
            this.importResult = undefined;
            const fileInput = event.target as HTMLInputElement;
            if (fileInput.files)
                this.inputFile = fileInput.files[0];
        }
    },

    async mounted() {
        if (!AuthService.autenticado || !(await this.service.config())) {
            this.goToPage('Home');
        }
    }
})
</script>

<style scoped>
p {
    color: var(--disabled-text-color);
    font-size: 10pt;
}

hr {
    margin: 30px 0 30px 0;
}

#download {
    visibility: hidden;
}
</style>