import { createApp } from 'vue'
// Bootstrap: só o CSS (o Vue já controla o HTML, então não usamos o JavaScript dele)
import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/global.css'
import App from './App.vue'
import router from './router'

// app.use(router) registra o Vue Router: libera <RouterLink> e <RouterView> em todo o app
createApp(App).use(router).mount('#app')
