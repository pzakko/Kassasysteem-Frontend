<template>
  <div class="product-container">
    <h1 class="text-3xl font-semibold text-center text-blue-600 mb-6">🛒 Productoverzicht</h1>

    <!-- Info voor gebruiker -->
    <p v-if="userRole === 'GEBRUIKER'" class="text-gray-500 italic text-center mb-4">
      Je hebt alleen leesrechten. Bewerken of toevoegen is alleen mogelijk voor admins.
    </p>

    <!-- Zoekveld -->
    <div class="mb-6">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="🔍 Zoek producten..."
        class="form-input"
      />
    </div>

    <!-- ProductForm alleen voor ADMIN -->
    <ProductForm
      v-if="userRole === 'ADMIN'"
      :modelValue="geselecteerdProduct"
      @toegevoegd="resetForm"
      class="mb-6"
    />

    <!-- Producten grid -->
    <p v-if="filteredProducten.length === 0" class="text-gray-500 text-center">Geen producten gevonden.</p>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="product in filteredProducten"
        :key="product.id"
        class="product-card cursor-pointer"
        @click="bewerken(product)"
      >
        <div>
          <h2 class="text-lg font-bold text-gray-800 mb-1">{{ product.naam }}</h2>
          <p class="text-sm text-gray-600 mb-1">€{{ product.prijs.toFixed(2) }}</p>
          <p class="text-sm text-gray-600 mb-1">Voorraad: {{ product.voorraad }}</p>
          <p v-if="product.categorie" class="text-sm text-gray-600 mb-1">Categorie: {{ product.categorie }}</p>
          <p v-if="product.beschrijving" class="text-sm text-gray-500 mb-2">{{ product.beschrijving }}</p>
        </div>

        <!-- Knoppen alleen voor ADMIN -->
        <div v-if="userRole === 'ADMIN'" class="hidden sm:flex gap-2 mt-auto pt-4">
          <button @click.stop="bewerken(product)" class="btn-primary">✏️ Bewerken</button>
          <button
            @click.stop="initDelete(product)"
            class="btn-danger"
            data-testid="verwijder-knop"
          >
            🗑️ Verwijderen
          </button>
        </div>
      </div>
    </div>

    <!-- Toast notificaties -->
    <teleport to="body">
      <div class="toast-container">
        <div
          v-for="(message, index) in sidebarMessages"
          :key="index"
          class="toast"
          :class="{
            'toast-success': message.type === 'success',
            'toast-info': message.type === 'info',
            'toast-error': message.type === 'error'
          }"
        >
          {{ message.text }}
          <button @click="removeSidebarMessage(index)" class="ml-2 font-bold">✖</button>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { jwtDecode } from 'jwt-decode' // ✅ juiste import
import axios from '@/api/axiosInstance'
import webSocketClient from '@/api/webSocketClient'
import ProductForm from '@/components/ProductForm.vue'

const producten = ref([])
const geselecteerdProduct = ref(null)
const searchQuery = ref('')
const sidebarMessages = ref([])
const productToDelete = ref(null)

// 🔐 JWT rol uitlezen
const userRole = ref('')
const token = localStorage.getItem('token')
if (token) {
  const decoded = jwtDecode(token)
  const roles = decoded.roles || []
  userRole.value = roles.includes('ROLE_ADMIN') ? 'ADMIN' : 'GEBRUIKER'
}

const filteredProducten = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return producten.value.filter(
    (product) =>
      product.naam.toLowerCase().includes(query) ||
      (product.categorie && product.categorie.toLowerCase().includes(query))
  )
})

const laadProducten = async () => {
  try {
    const response = await axios.get('/producten')
    producten.value = response.data
  } catch {
    toonModal('error', 'Kan producten niet laden')
  }
}

const toonModal = (type, message) => {
  sidebarMessages.value.push({ type, text: message })
  setTimeout(() => {
    sidebarMessages.value.shift()
  }, 4000)
}

const removeSidebarMessage = (index) => {
  sidebarMessages.value.splice(index, 1)
}

onMounted(() => {
  laadProducten()
  webSocketClient.connect(
    (nieuwProduct) => {
      const index = producten.value.findIndex((p) => p.id === nieuwProduct.id)
      if (index === -1) {
        producten.value.push(nieuwProduct)
        toonModal('success', `Nieuw product toegevoegd: ${nieuwProduct.naam}`)
      } else {
        producten.value[index] = nieuwProduct
        toonModal('info', `Product bijgewerkt: ${nieuwProduct.naam}`)
      }
    },
    (verwijderdId) => {
      const verwijderdProduct = producten.value.find((p) => p.id === verwijderdId)
      producten.value = producten.value.filter((p) => p.id !== verwijderdId)
      toonModal('error', `Product verwijderd: ${verwijderdProduct?.naam || 'Onbekend'}`)
    }
  )
})

const bewerken = (product) => {
  geselecteerdProduct.value = { ...product }
}

const resetForm = () => {
  geselecteerdProduct.value = null
}

const initDelete = (product) => {
  productToDelete.value = product
  confirmDelete()
}

const confirmDelete = async () => {
  try {
    await axios.delete(`/producten/${productToDelete.value.id}`)
    productToDelete.value = null
  } catch {
    toonModal('error', 'Verwijderen mislukt')
  }
}
</script>

<style scoped>
.product-container {
  max-width: 1200px;
  margin: 60px auto;
  padding: 32px;
  border-radius: 16px;
  background: linear-gradient(to bottom, #ffffff, #f9fafb);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
}

.form-input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 0.95rem;
  transition: border-color 0.2s;
}

.form-input:focus {
  border-color: #3b82f6;
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.product-card {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.05);
  border: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 230px;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
  padding: 10px 14px;
  font-size: 0.9rem;
  border: none;
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  flex: 1;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-danger {
  background-color: #ef4444;
  color: white;
  padding: 10px 14px;
  font-size: 0.9rem;
  border: none;
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  flex: 1;
}

.btn-danger:hover {
  background-color: #dc2626;
}

.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.toast {
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 0.9rem;
  color: #fff;
  min-width: 240px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  animation: fadeInOut 4s ease-in-out forwards;
}

.toast-success {
  background-color: #16a34a;
}

.toast-info {
  background-color: #3b82f6;
}

.toast-error {
  background-color: #dc2626;
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  10% {
    opacity: 1;
    transform: translateY(0);
  }
  90% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateY(-10px);
  }
}

@media (max-width: 640px) {
  .product-container {
    padding: 16px;
  }

  .product-card {
    min-height: auto;
    padding: 16px;
  }

  .btn-primary,
  .btn-danger {
    font-size: 0.85rem;
    padding: 8px 12px;
  }
}
</style>

