import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import './style.css'
import App from './App.vue'

const app = createApp(App)

// Activate Pinia (Global State / Cart)
app.use(createPinia())

// Activate Vue Router (Page Navigation)
app.use(router)

app.mount('#app')