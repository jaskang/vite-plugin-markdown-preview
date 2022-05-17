import { createApp } from 'vue'
import App from './App.vue'
import VueCode from './VueCode.vue'

const app = createApp(App)

app.component('VueCode', VueCode)
app.mount('#app')
