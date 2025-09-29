import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import Toast, { POSITION } from "vue-toastification"
import "vue-toastification/dist/index.css"

import App from './App.vue'
import router from './router'
const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)
const app = createApp(App)
const options = {
  position: POSITION.BOTTOM_RIGHT,
  timeout: 2000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
}

app.use(pinia)
app.use(router)

app.use(Toast, options)

app.mount('#app')
