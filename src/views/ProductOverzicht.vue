<template>
  <div class="container">
    <h1>Productoverzicht</h1>

    <!-- ✅ Melding -->
<div v-if="melding" class="toast">{{ melding }}</div>

    <!-- ✅ Formulier -->
    <ProductForm
      :modelValue="geselecteerd"
      @toegevoegd="handleToegevoegd"
    />

    <!-- 🔄 Laadstatus -->
    <div v-if="loading">⌛ Laden...</div>

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
import webSocketClient from '../api/webSocketClient'

const producten = ref([])
const geselecteerd = ref(null)
const loading = ref(true)
const melding = ref('')

const toonMelding = (tekst) => {
  if (melding.value === tekst) return

  melding.value = tekst

  setTimeout(() => {
    if (melding.value === tekst) {
      melding.value = ''
    }
  }, 5000)
}

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
}

const verwijderProduct = async (id) => {
  if (confirm('Weet je zeker dat je dit product wilt verwijderen?')) {
    try {
      webSocketClient.verwijderViaSocket(id)
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

  webSocketClient.connect(
    (nieuwProduct) => {
      const bestaand = producten.value.find(p => p.id === nieuwProduct.id)

      if (!bestaand) {
        producten.value.push(nieuwProduct)
        toonMelding(`✅ Nieuw product toegevoegd: ${nieuwProduct.naam}`)
      } else {
        producten.value = producten.value.map(p =>
          p.id === nieuwProduct.id ? nieuwProduct : p
        )
        toonMelding(`✏️ Product bijgewerkt: ${nieuwProduct.naam}`)
      }
    },
    (verwijderdId) => {
      const verwijderdProduct = producten.value.find(p => p.id === verwijderdId)
      producten.value = producten.value.filter(p => p.id !== verwijderdId)
      toonMelding(`🗑️ Product verwijderd: ${verwijderdProduct?.naam || 'Onbekend'}`)
    }
  )
})

</script>

<style scoped>
.container {
  padding: 1.5rem;
}

.melding {
  background-color: #d4edda;
  color: #155724;
  padding: 0.5rem;
  border: 1px solid #c3e6cb;
  border-radius: 4px;
  margin-bottom: 1rem;
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

.toast {
  position: fixed;
  top: 1rem;
  right: 1rem;
  background-color: #323232;
  color: white;
  padding: 0.75rem 1.2rem;
  border-radius: 6px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  animation: fadein 0.5s, fadeout 0.5s 2.5s;
}

@keyframes fadein {
  from { opacity: 0; transform: translateY(-10px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes fadeout {
  from { opacity: 1; transform: translateY(0); }
  to   { opacity: 0; transform: translateY(-10px); }
}

</style>
