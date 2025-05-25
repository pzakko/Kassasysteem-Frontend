// import { createApp } from 'vue'
// import './style.css'
// import App from './App.vue'

// createApp(App).mount('#app')

// import { createApp } from 'vue'
// import App from './App.vue'
// import router from './router'

// createApp(App).use(router).mount('#app')

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
axios.defaults.withCredentials = true // 👈 Belangrijk!

// ✅ Standaard Axios-configuratie
axios.defaults.baseURL = 'http://localhost:8080/' // Pas aan indien nodig

// ✅ JWT-token automatisch toevoegen aan alle verzoeken
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

const app = createApp(App)

app.use(router)

app.mount('#app')

