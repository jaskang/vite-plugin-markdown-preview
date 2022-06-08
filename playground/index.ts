import { createApp } from 'vue'
import App from './App.vue'
import MyVueCode from './MyVueCode.vue'

const app = createApp(App)

app.component('MyVueCode', MyVueCode)
app.mount('#app')
