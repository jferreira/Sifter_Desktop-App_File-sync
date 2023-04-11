import { createApp } from 'vue'
import { createRouter, createMemoryHistory } from 'vue-router'
import Toast from "vue-toastification";
import routes from 'virtual:generated-pages'
import '../style.css'
import './style.css'
import "vue-toastification/dist/index.css";
import App from './App.vue'
import { createPinia } from 'pinia'

const app = createApp(App)
app.use(createRouter({
    history: createMemoryHistory(import.meta.env.BASE_URL),
    routes,
}))
app.use(createPinia())
app.use(Toast)
app.mount('#app')
