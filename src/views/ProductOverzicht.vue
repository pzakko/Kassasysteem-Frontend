<template>
  <div class="container">
    <h1>Productoverzicht</h1>

    <!-- ✅ Formulier -->
    <ProductForm
      :modelValue="geselecteerd"
      @toegevoegd="handleToegevoegd"
    />

    <!-- 🔄 Laadstatus -->
    <div v-if="loading">Laden...</div>

    <!-- 🚫 Geen producten -->
    <div v-else-if="!producten || producten.length === 0">
      Geen producten beschikbaar
    </div>

    <!-- ✅ Overzicht -->
    <div class="product-grid" v-else>
      <div v-for="product in producten" :key="product.id" class="card">
        <h2>{{ product.naam }}</h2>
        <p><strong>Prijs:</strong> €{{ product.prijs.toFixed(2) }}</p>
        <p><strong>Voorraad:</strong> {{ product.voorraad }}</p>
        <p><strong>Categorie:</strong> {{ product.categorie }}</p>
        <p><strong>Beschrijving:</strong> {{ product.beschrijving }}</p>

        <!-- 🛠️ Actieknoppen -->
        <div class="knoppen">
          <button @click="vulFormulier(product)">✏️ Bewerken</button>
          <button @click="verwijderProduct(product.id)">🗑️ Verwijderen</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import productApi from '../api/productApi'
import ProductForm from '../components/ProductForm.vue'
import webSocketClient from '../api/webSocketClient' // ✅ Voeg WebSocket client toe

const producten = ref([])
const geselecteerd = ref(null)
const loading = ref(true)

const laadProducten = async () => {
  try {
    const res = await productApi.getAll()
    producten.value = res.data
  } catch (err) {
    console.error('❌ Fout bij ophalen producten:', err)
  } finally {
    loading.value = false
  }
}

const handleToegevoegd = () => {
  geselecteerd.value = null
  laadProducten()
}

const verwijderProduct = async (id) => {
  if (confirm('Weet je zeker dat je dit product wilt verwijderen?')) {
    try {
      await productApi.remove(id)
      laadProducten()
    } catch (err) {
      console.error("❌ Fout bij verwijderen:", err)
    }
  }
}

const vulFormulier = (product) => {
  geselecteerd.value = { ...product }
}

onMounted(() => {
  laadProducten()

  // ✅ Start WebSocket connectie bij laden
  webSocketClient.connect((nieuwProduct) => {
    console.log('📡 Realtime product ontvangen via WebSocket:', nieuwProduct)

    // Controleer of het product al bestaat (voorkom dubbel)
    const bestaatAl = producten.value.some(p => p.id === nieuwProduct.id)
    if (!bestaatAl) {
      producten.value.push(nieuwProduct)
    } else {
      // Of update het product als het al bestaat
      producten.value = producten.value.map(p => (p.id === nieuwProduct.id ? nieuwProduct : p))
    }
  })
})
</script>

<style scoped>
.container {
  padding: 1.5rem;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.card {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
}

.knoppen {
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
}

button {
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #ddd;
}
</style>
