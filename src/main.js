import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './assets/style.css'

const app = createApp(App)

// Подключаем Pinia и Router к приложению
app.use(createPinia())
app.use(router)

app.mount('#app')
