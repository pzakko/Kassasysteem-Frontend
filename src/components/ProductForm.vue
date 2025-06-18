  <template>
  <form @submit.prevent="submitForm" class="form">
    <h2>{{ product.id ? '✏️ Product bewerken' : '➕ Nieuw product toevoegen' }}</h2>

    <label>Naam:</label>
    <input v-model="product.naam" required data-testid="naam" />

    <label>Prijs (€):</label>
    <input type="number" v-model="product.prijs" step="0.01" min="0" required data-testid="prijs" />

    <label>Voorraad:</label>
    <input type="number" v-model="product.voorraad" min="0" required data-testid="voorraad" />

    <label>Categorie:</label>
    <input v-model="product.categorie" data-testid="categorie" />

    <label>Beschrijving:</label>
    <textarea v-model="product.beschrijving" data-testid="beschrijving" />

    <label>Afbeelding URL (optioneel):</label>
    <input v-model="product.afbeelding" data-testid="afbeelding" />

    <button type="submit" data-testid="toevoegen-knop">{{ product.id ? 'Opslaan' : 'Toevoegen' }}</button>

    <p v-if="melding" class="melding">{{ melding }}</p>
  </form>
</template>

  
  <script setup>
  import { ref, watch } from 'vue'
  import productApi from '../api/productApi'
  
  const props = defineProps({
    modelValue: Object
  })
  
  const emit = defineEmits(['toegevoegd'])
  
  const leegProduct = {
    naam: '',
    prijs: 0,
    voorraad: 0,
    categorie: '',
    beschrijving: '',
    afbeelding: ''
  }
  
  const product = ref({ ...leegProduct })
  const melding = ref('')
  
  // Als er iets bewerkt moet worden
  watch(() => props.modelValue, (nieuw) => {
    if (nieuw && nieuw.id) {
      product.value = { ...nieuw }
    } else {
      product.value = { ...leegProduct }
    }
  })
  
const submitForm = async () => {
  try {
    console.log('Verzonden data:', product.value); // Log de data die wordt verzonden
    if (product.value.id) {
      await productApi.update(product.value.id, product.value);
      melding.value = '✏️ Product bijgewerkt!';
    } else {
      await productApi.create(product.value);
      melding.value = '✅ Product toegevoegd!';
    }

    emit('toegevoegd'); // Vertel de ouder dat er iets is toegevoegd of bewerkt
    product.value = { ...leegProduct }; // Formulier resetten
  } catch (err) {
    console.error("❌ Fout bij verzenden:", err.response ? err.response.data : err); // Log foutdetails
    melding.value = '❌ Fout bij opslaan';
  }

  // Verwijder melding na 3 seconden
  setTimeout(() => (melding.value = ''), 3000);
}
  </script>
  
  <style scoped>
  .form {
    max-width: 400px;
    margin-bottom: 2rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  button {
    padding: 0.5rem;
    font-weight: bold;
    background-color: #2f80ed;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #1366d6;
  }
  
  .melding {
    margin-top: 0.5rem;
    color: green;
  }
  </style>
  