<template>
    <div>
        <i class="pi pi-table"></i>
        <p>
            Olá!
        </p>
        <p>
            Aqui você pode montar sua grade escolar personalizada e também incluir anotações nas aulas.
        </p>
        <p>
            Entre para começar
        </p>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'HomeView',
    components: {
    },
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

});
</script>
<style scoped>
div {
    text-align: center;
    width: 100%;
}
i {
    font-size: 22pt;
    margin: 20px;
}
</style>