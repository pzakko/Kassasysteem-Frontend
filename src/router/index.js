import { createRouter, createWebHistory } from 'vue-router'
import { jwtDecode } from 'jwt-decode'

import Login from '@/views/Login.vue'
import ProductOverzicht from '@/views/ProductOverzicht.vue'
import ProductenGebruiker from '@/views/ProductenGebruiker.vue'

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
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/producten-gebruiker',
    name: 'ProductenGebruiker',
    component: ProductenGebruiker,
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

// ✅ JWT-auth + rolcontrole
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const isBeveiligd = to.meta.requiresAuth
  const requiresAdmin = to.meta.requiresAdmin

  if (!isBeveiligd) return next()

  if (!token) return next('/login')

  try {
    const decoded = jwtDecode(token)
    const roles = decoded.roles || []
    const isAdmin = roles.includes('ROLE_ADMIN')

    if (requiresAdmin && !isAdmin) {
      return next('/producten-gebruiker')
    }

    if (to.path === '/') {
      return next(isAdmin ? '/producten' : '/producten-gebruiker')
    }

    return next()
  } catch (err) {
    console.error('Token ongeldig of verlopen:', err)
    localStorage.removeItem('token')
    return next('/login')
  }
})

export default router

