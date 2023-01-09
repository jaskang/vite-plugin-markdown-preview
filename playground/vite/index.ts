import { createApp } from 'vue'
import App from './App.vue'
import VueCode from './VueCode.vue'
import VueCode1 from './VueCode1.vue'
import VueCode2 from './VueCode2.vue'

const app = createApp(App)

app.component('VueCode', VueCode)
app.component('VueCode1', VueCode1)
app.component('VueCode2', VueCode2)
app.mount('#app')
