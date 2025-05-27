// import axios from 'axios'

// const api = axios.create({
//   baseURL: 'http://localhost:8080/api/producten', // GEEN trailing slash
// })

// export default {
//   getAll: () => api.get(''), // <-- LEEG, niet '/'
//   create: (product) => api.post('', product),
//   update: (id, product) => api.put(`/${id}`, product),     // ✅ nieuw
//   remove: (id) => api.delete(`/${id}`),
// }

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor om de token dynamisch toe te voegen aan elke aanvraag
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Token toegevoegd aan aanvraag:', token); // Debug: controleer of de token wordt meegezonden
    } else {
      console.warn('Geen token gevonden in localStorage'); // Debug: waarschuw als er geen token is
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default {
  create(product) {
    return api.post('producten', product);
  },
  update(id, product) {
    return api.put(`producten/${id}`, product);
  },
  getAll() {
    return api.get('producten');
  },
  getById(id) {
    return api.get(`producten/${id}`);
  },
  delete(id) {
    return api.delete(`producten/${id}`);
  },
  search(q) {
    return api.get('producten/zoeken', { params: { q } });
  },
  filter(categorie) {
    return api.get('producten/filter', { params: { categorie } });
  },
  searchAndFilter(q, categorie) {
    return api.get('producten/zoeken-en-filteren', { params: { q, categorie } });
  }
};