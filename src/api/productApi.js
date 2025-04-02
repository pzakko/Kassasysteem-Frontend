// import axios from 'axios'

// const api = axios.create({
//   baseURL: 'http://localhost:8080/api/producten',
// })

// export default {
//   getAll: () => api.get('/'),
//   create: (product) => api.post('/', product),
// }

import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api/producten', // GEEN trailing slash
})

export default {
  getAll: () => api.get(''), // <-- LEEG, niet '/'
}
