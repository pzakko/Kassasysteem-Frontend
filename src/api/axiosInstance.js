// import axios from 'axios'

// const axiosInstance = axios.create({
//   baseURL: 'http://localhost:8080/api', // Pas aan als jouw backend een andere poort of pad heeft
//   headers: {
//     'Content-Type': 'application/json',
//   }
// })

// // ✅ Voeg de JWT-token automatisch toe aan elke request
// axiosInstance.interceptors.request.use(config => {
//   const token = localStorage.getItem('jwt')
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`
//   }
//   return config
// })

// export default axiosInstance

// src/api/axiosInstance.js
import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:8080/api',
})

// Voeg een interceptor toe die bij elke request de token zet
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default instance
