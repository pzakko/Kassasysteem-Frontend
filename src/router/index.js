import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import ProductOverzicht from '@/views/ProductOverzicht.vue'
// Voeg hier andere componenten toe als je wilt, zoals ProductCreate, ProductUpdate, enz.

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/producten',
    name: 'ProductOverzicht',
    component: ProductOverzicht,
    meta: { requiresAuth: true }
  },
  {
    path: '/',
    redirect: '/producten'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// ✅ Routebeveiliging (JWT-tokencontrole)
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const isBeveiligd = to.meta.requiresAuth

  if (isBeveiligd && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router
