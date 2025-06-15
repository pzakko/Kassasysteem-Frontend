<!-- <template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">📦 Productoverzicht</h1>

    <ProductForm :modelValue="geselecteerdProduct" @toegevoegd="resetForm" />

    <div v-if="melding" class="fixed top-5 right-5 bg-green-100 border border-green-300 text-green-700 px-4 py-2 rounded shadow z-50">
      {{ melding }}
    </div>

    <div v-if="producten.length === 0" class="text-gray-500">Geen producten gevonden.</div>

    <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <li v-for="product in producten" :key="product.id" class="bg-white p-4 shadow rounded">
        <h2 class="text-lg font-semibold">{{ product.naam }}</h2>
        <p>💶 {{ product.prijs }} EUR</p>
        <p>📦 Voorraad: {{ product.voorraad }}</p>
        <p v-if="product.categorie">🏷️ Categorie: {{ product.categorie }}</p>
        <p v-if="product.beschrijving">{{ product.beschrijving }}</p>

        <button @click="bewerken(product)" class="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mr-2">
          ✏️ Bewerken
        </button>

        <button @click="verwijder(product.id)" class="mt-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
          🗑️ Verwijderen
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/api/axiosInstance'
import webSocketClient from '@/api/webSocketClient'
import ProductForm from '@/components/ProductForm.vue'

const producten = ref([])
const melding = ref('')
const geselecteerdProduct = ref(null)

const laadProducten = async () => {
  try {
    const response = await axios.get('/producten')
    producten.value = response.data
  } catch (error) {
    console.error('Kan producten niet laden:', error)
    melding.value = '❌ Kan producten niet laden'
    setTimeout(() => (melding.value = ''), 4000)
  }
}

onMounted(() => {
  laadProducten()

  webSocketClient.connect(
    (nieuwProduct) => {
      const bestaand = producten.value.find(p => p.id === nieuwProduct.id)

      if (!bestaand) {
        producten.value.push(nieuwProduct)
        melding.value = `✅ Nieuw product toegevoegd: ${nieuwProduct.naam}`
      } else {
        producten.value = producten.value.map(p =>
          p.id === nieuwProduct.id ? nieuwProduct : p
        )
        melding.value = `✏️ Product bijgewerkt: ${nieuwProduct.naam}`
      }

      setTimeout(() => (melding.value = ''), 4000)
    },
    (verwijderdId) => {
      const verwijderdProduct = producten.value.find(p => p.id === verwijderdId)
      producten.value = producten.value.filter(p => p.id !== verwijderdId)
      melding.value = `🗑️ Product verwijderd: ${verwijderdProduct?.naam || 'Onbekend'}`
      setTimeout(() => (melding.value = ''), 4000)
    }
  )
})

const bewerken = (product) => {
  geselecteerdProduct.value = { ...product }
}

const resetForm = () => {
  geselecteerdProduct.value = null
}

const verwijder = async (id) => {
  try {
    await axios.delete(`/producten/${id}`)
    // De WebSocket server stuurt automatisch het ID terug naar alle clients
  } catch (error) {
    console.error('❌ Verwijderen mislukt:', error)
    melding.value = '❌ Verwijderen mislukt'
    setTimeout(() => (melding.value = ''), 4000)
  }
}
</script>

<style scoped>
button {
  transition: background-color 0.2s;
}
</style> -->


<!-- <template>
  <div class="product-container">
    <h1 class="text-3xl font-semibold text-center text-blue-600 mb-6">🛒 Productoverzicht</h1>

    <div class="mb-6">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="🔍 Zoek producten..."
        class="form-input"
      />
    </div>

    <ProductForm :modelValue="geselecteerdProduct" @toegevoegd="resetForm" class="mb-6" />

    <div v-if="sidebarMessages.length" class="mb-4 space-y-2">
      <div
        v-for="(message, index) in sidebarMessages"
        :key="index"
        class="notification"
        :class="{
          'border-green-500 text-green-700': message.type === 'success',
          'border-blue-500 text-blue-700': message.type === 'info',
          'border-red-500 text-red-700': message.type === 'error'
        }"
      >
        {{ message.text }}
        <button @click="removeSidebarMessage(index)" class="ml-2 font-bold">✖</button>
      </div>
    </div>

    <p v-if="filteredProducten.length === 0" class="text-gray-500 text-center">Geen producten gevonden.</p>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="product in filteredProducten"
        :key="product.id"
        class="product-card"
      >
        <div>
          <h2 class="text-lg font-bold text-gray-800 mb-1">{{ product.naam }}</h2>
          <p class="text-sm text-gray-600 mb-1">€{{ product.prijs.toFixed(2) }}</p>
          <p class="text-sm text-gray-600 mb-1">Voorraad: {{ product.voorraad }}</p>
          <p v-if="product.categorie" class="text-sm text-gray-600 mb-1">Categorie: {{ product.categorie }}</p>
          <p v-if="product.beschrijving" class="text-sm text-gray-500 mb-2">{{ product.beschrijving }}</p>
        </div>

        <div class="flex gap-2 mt-auto pt-4">
          <button @click="bewerken(product)" class="btn-primary">✏️ Bewerken</button>
          <button @click="initDelete(product)" class="btn-danger">🗑️ Verwijderen</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from '@/api/axiosInstance'
import webSocketClient from '@/api/webSocketClient'
import ProductForm from '@/components/ProductForm.vue'

const producten = ref([])
const geselecteerdProduct = ref(null)
const searchQuery = ref('')
const sidebarMessages = ref([])
const productToDelete = ref(null)

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
  } catch (err) {
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
  } catch (err) {
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

.notification {
  border-left: 4px solid;
  background-color: #fefefe;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 0.9rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
</style> -->

<template>
  <div class="product-container">
    <h1 class="text-3xl font-semibold text-center text-blue-600 mb-6">🛒 Productoverzicht</h1>

    <!-- Zoekveld -->
    <div class="mb-6">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="🔍 Zoek producten..."
        class="form-input"
      />
    </div>

    <!-- Formulier -->
    <ProductForm :modelValue="geselecteerdProduct" @toegevoegd="resetForm" class="mb-6" />

    <!-- Grid met producten -->
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

        <div class="hidden sm:flex gap-2 mt-auto pt-4">
          <button @click.stop="bewerken(product)" class="btn-primary">✏️ Bewerken</button>
          <button @click.stop="initDelete(product)" class="btn-danger">🗑️ Verwijderen</button>
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
import axios from '@/api/axiosInstance'
import webSocketClient from '@/api/webSocketClient'
import ProductForm from '@/components/ProductForm.vue'

const producten = ref([])
const geselecteerdProduct = ref(null)
const searchQuery = ref('')
const sidebarMessages = ref([])
const productToDelete = ref(null)

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

/* ✅ Toast styles */
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

/* ✅ Mobile responsiveness */
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



