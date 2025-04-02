<template>
    <form @submit.prevent="submitForm" class="form">
      <h2>Nieuw product toevoegen</h2>
  
      <label>Naam:</label>
      <input v-model="product.naam" required />
  
      <label>Prijs (€):</label>
      <input type="number" v-model="product.prijs" min="0" step="0.01" required />
  
      <label>Voorraad:</label>
      <input type="number" v-model="product.voorraad" min="0" required />
  
      <label>Categorie:</label>
      <input v-model="product.categorie" />
  
      <label>Beschrijving:</label>
      <textarea v-model="product.beschrijving"></textarea>
  
      <label>Afbeelding URL:</label>
      <input v-model="product.afbeelding" />
  
      <button type="submit">Toevoegen</button>
      <p v-if="melding" class="success">{{ melding }}</p>
    </form>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import productApi from '../api/productApi'
  
  const product = ref({
    naam: '',
    prijs: 0.00,
    voorraad: 0,
    categorie: '',
    beschrijving: '',
    afbeelding: ''
  })
  
  const melding = ref('')
  
  const submitForm = async () => {
    try {
      await productApi.create(product.value)
      melding.value = '✅ Product succesvol toegevoegd!'
      // Reset formulier
      product.value = {
        naam: '',
        prijs: 0.00,
        voorraad: 0,
        categorie: '',
        beschrijving: '',
        afbeelding: ''
      }
    } catch (err) {
      console.error('Fout bij toevoegen:', err)
      melding.value = '❌ Fout bij toevoegen van product'
    }
  }
  </script>
  
  <style scoped>
  .form {
    max-width: 400px;
    margin: auto;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .success {
    color: green;
  }
  </style>
  