<template>
  <div class="product-container">
    <h1 class="text-3xl font-semibold text-center text-green-700 mb-6">🛍️ Producten voor gebruikers</h1>

    <!-- Zoekveld -->
    <div class="mb-6">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="🔍 Zoek producten..."
        class="form-input"
      />
    </div>

    <!-- Productenlijst -->
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
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from '@/api/axiosInstance'
import webSocketClient from '@/api/webSocketClient' // ✅ WebSocket importeren

const producten = ref([])
const searchQuery = ref('')

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
    console.error('Kan producten niet laden')
  }
}

onMounted(() => {
  laadProducten()

  // ✅ WebSocket-verbinding om live updates te ontvangen
  webSocketClient.connect(
    (nieuwProduct) => {
      const index = producten.value.findIndex((p) => p.id === nieuwProduct.id)
      if (index === -1) {
        producten.value.push(nieuwProduct)
      } else {
        producten.value[index] = nieuwProduct
      }
    },
    (verwijderdId) => {
      producten.value = producten.value.filter((p) => p.id !== verwijderdId)
    }
  )
})
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

@media (max-width: 640px) {
  .product-container {
    padding: 16px;
  }

  .product-card {
    min-height: auto;
    padding: 16px;
  }
}
</style>
