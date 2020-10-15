import { createApp } from 'vue'
import App from './App.vue'
import Button from './components/Button'
import 'vite-plugin-vuedoc/style.css'
const app = createApp(App)

app.component('elButton', Button)

app.mount('#app')
