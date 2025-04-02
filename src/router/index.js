import { createRouter, createWebHistory } from 'vue-router'
import ProductOverzicht from '../views/ProductOverzicht.vue'

const routes = [
  { path: '/', name: 'Producten', component: ProductOverzicht },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
