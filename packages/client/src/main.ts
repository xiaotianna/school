import { createApp } from 'vue'
import App from './App.vue'
import '@/index.css'
import 'normalize.css'
import '@/assets/vars.css'
import router from '@/router'
import pinia from '@/store'
import 'element-plus/dist/index.css'
import '@/router/permission'
import { baseUrl } from './common'
import { initUserInfo } from './utils/init-user-info'

const app = createApp(App)

app.config.globalProperties.$baseUrl = baseUrl

// 初始化
initUserInfo(pinia)

app.use(router)
app.use(pinia)
app.mount('#app')
