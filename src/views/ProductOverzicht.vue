<template>
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

        <!-- ✏️ Bewerken -->
        <button @click="bewerken(product)" class="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mr-2">
          ✏️ Bewerken
        </button>

        <!-- 🗑️ Verwijderen -->
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
</style>
