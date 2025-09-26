import { createApp } from 'vue'
import App from './App.vue'
import '@/index.css'
import 'normalize.css'
import '@/assets/vars.css'
import router from '@/router'
import 'element-plus/dist/index.css'
import '@/router/permission'
import { baseUrl } from './common'
import { initUserInfo } from './utils/init-user-info'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const app = createApp(App)

app.config.globalProperties.$baseUrl = baseUrl

// pinia
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
// 初始化
initUserInfo(pinia)

app.use(router)
app.use(pinia)
app.mount('#app')
