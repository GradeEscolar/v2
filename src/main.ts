import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from "vue-axios"
import 'primeicons/primeicons.css';

const app = createApp(App);
app.use(VueAxios, axios);
app.provide('axios', app.config.globalProperties.axios);
app.mount('#app');


