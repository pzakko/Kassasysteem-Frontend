<!-- <template>
    <div class="container">
      <h1>Productoverzicht</h1>
  
      <div v-if="producten.length === 0">Geen producten beschikbaar</div>
  
      <div class="product-grid">
        <div v-for="product in producten" :key="product.id" class="card">
          <h2>{{ product.naam }}</h2>
          <p>€{{ product.prijs.toFixed(2) }}</p>
          <p>Voorraad: {{ product.voorraad }}</p>
          <p>Categorie: {{ product.categorie }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import productApi from '../api/productApi'
  
  const producten = ref([])
  
  const laadProducten = async () => {
    try {
      const res = await productApi.getAll()
      producten.value = res.data
    } catch (err) {
      console.error("Fout bij ophalen producten:", err)
    }
  }
  
  onMounted(() => {
    laadProducten()
  })
  </script>
  
  <style scoped>
  .container {
    padding: 1rem;
  }
  .product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }
  .card {
    border: 1px solid #ccc;
    padding: 1rem;
    border-radius: 8px;
    background: white;
  }
  </style>
   -->

   <!-- <template>
    <div class="container">
      <h1>Productoverzicht</h1>
  
      <div v-if="producten.length === 0">
        Geen producten beschikbaar
      </div>
  
      <div class="product-grid" v-else>
        <div v-for="product in producten" :key="product.id" class="card">
          <h2>{{ product.naam }}</h2>
          <p>Prijs: €{{ product.prijs.toFixed(2) }}</p>
          <p>Voorraad: {{ product.voorraad }}</p>
          <p>Categorie: {{ product.categorie }}</p>
          <p>Beschrijving: {{ product.beschrijving }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import productApi from '../api/productApi'
  
  const producten = ref([])
  
  const laadProducten = async () => {
    try {
      const res = await productApi.getAll()
      console.log("Opgehaald:", res.data) // ✅ log voor debug
      producten.value = res.data
    } catch (err) {
      console.error("Fout bij ophalen producten:", err)
    }
  }
  
  onMounted(() => {
    laadProducten()
  })
  </script>
  
  <style scoped>
  .container {
    padding: 1rem;
  }
  .product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }
  .card {
    background-color: #f2f2f2;
    padding: 1rem;
    border-radius: 8px;
  }
  </style> -->
  
  <template>
    <div class="container">
      <h1>Productoverzicht</h1>
  
      <div v-if="loading">Laden...</div>
  
      <div v-else-if="!producten || producten.length === 0">
        Geen producten beschikbaar
      </div>
  
      <div class="product-grid" v-else>
        <div v-for="product in producten" :key="product.id" class="card">
          <h2>{{ product.naam }}</h2>
          <p><strong>Prijs:</strong> €{{ product.prijs.toFixed(2) }}</p>
          <p><strong>Voorraad:</strong> {{ product.voorraad }}</p>
          <p><strong>Categorie:</strong> {{ product.categorie }}</p>
          <p><strong>Beschrijving:</strong> {{ product.beschrijving }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import productApi from '../api/productApi'
  
  const producten = ref([])
  const loading = ref(true)
  
  const laadProducten = async () => {
    try {
      const res = await productApi.getAll()
      console.log("✅ API response ontvangen:", res.data)
      producten.value = res.data
    } catch (err) {
      console.error("❌ Fout bij ophalen producten:", err)
    } finally {
      loading.value = false
    }
  }
  
  onMounted(() => {
    laadProducten()
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
    background-color: #f4f4f4;
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
  }
  </style>
  