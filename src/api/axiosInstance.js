import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:8080/api',
    withCredentials: true
})

// Voeg een interceptor toe die bij elke request de token zet
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  console.log("👉 token:", token) // ✅ log om te testen
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default instance
