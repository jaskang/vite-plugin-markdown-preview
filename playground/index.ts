import { createApp } from 'vue'
import App from './App.vue'
import VueCode from './VueCode.vue'
import MyVueCode from './MyVueCode.vue'

const app = createApp(App)

app.component('VueCode', VueCode)
app.component('MyVueCode', MyVueCode)
app.mount('#app')
