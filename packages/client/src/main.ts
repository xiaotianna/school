import { createApp } from 'vue';
import App from './App.vue';
import '@/index.css';
import 'normalize.css';
import '@/assets/vars.css'
import router from '@/router';
import pinia from '@/store';
import 'element-plus/dist/index.css'

const app = createApp(App);
app.use(router);
app.use(pinia);
app.mount('#app');
