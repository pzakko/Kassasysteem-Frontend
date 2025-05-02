import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api/producten', // GEEN trailing slash
})

export default {
  getAll: () => api.get(''), // <-- LEEG, niet '/'
  create: (product) => api.post('', product),
  update: (id, product) => api.put(`/${id}`, product),     // ✅ nieuw
  remove: (id) => api.delete(`/${id}`),
}
