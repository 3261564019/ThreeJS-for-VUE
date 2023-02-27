import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

window.ggg=666;

const app=createApp(App);
app.use(router)
app.mount('#app')
