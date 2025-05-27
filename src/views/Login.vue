<!-- <template>
  <div class="flex items-center justify-center h-screen bg-gray-100">
    <form @submit.prevent="handleLogin" class="bg-white p-8 rounded shadow-md w-full max-w-md">
      <h1 class="text-2xl font-bold mb-6 text-center">🔐 Inloggen</h1>

      <div v-if="foutmelding" class="bg-red-100 border border-red-300 text-red-700 px-4 py-2 mb-4 rounded">
        {{ foutmelding }}
      </div>

      <div class="mb-4">
        <label for="username" class="block font-medium mb-1">Gebruikersnaam</label>
        <input v-model="username" id="username" type="text" class="w-full border rounded px-3 py-2" required />
      </div>

      <div class="mb-6">
        <label for="password" class="block font-medium mb-1">Wachtwoord</label>
        <input v-model="password" id="password" type="password" class="w-full border rounded px-3 py-2" required />
      </div>

      <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded">
        Inloggen
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from '@/api/axiosInstance'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const foutmelding = ref('')
const router = useRouter()

const handleLogin = async () => {
  try {
    const response = await axios.post('http://localhost:8080/api/auth/login', {
      username: username.value,
      password: password.value
    })

    const token = response.data.token
    localStorage.setItem('token', token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

    // ✅ Naar productoverzicht na inloggen
    await router.push('/producten')
  } catch (err) {
    foutmelding.value = '❌ Ongeldige gebruikersnaam of wachtwoord'
    setTimeout(() => (foutmelding.value = ''), 4000)
  }
}
</script> -->

<template>
  <div class="login-container">
    <h1>Login</h1>
    <form @submit.prevent="handleLogin">
      <div>
        <label for="username">Gebruikersnaam:</label>
        <input v-model="username" type="text" id="username" required />
      </div>
      <div>
        <label for="password">Wachtwoord:</label>
        <input v-model="password" type="password" id="password" required />
      </div>
      <button type="submit">Inloggen</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const errorMessage = ref('');
const router = useRouter();

const handleLogin = async () => {
  try {
    const response = await axios.post('http://localhost:8080/api/auth/login', {
      username: username.value,
      password: password.value
    });

    const token = response.data.token;
    console.log('Ontvangen token:', token); // Debug: controleer of de token wordt ontvangen
    localStorage.setItem('token', token);
    console.log('Token opgeslagen:', localStorage.getItem('token')); // Debug: controleer of de token is opgeslagen

    errorMessage.value = '';
    router.push('/producten');
  } catch (error) {
    console.error('Login fout:', error); // Debug: toon de foutdetails
    errorMessage.value = 'Inloggen mislukt. Controleer je gebruikersnaam en wachtwoord.';
  }
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 80px auto;
  padding: 24px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
input {
  width: 100%;
  padding: 8px;
  margin-top: 4px;
  margin-bottom: 12px;
}
button {
  padding: 10px 20px;
}
.error {
  color: red;
  margin-top: 10px;
}
</style>
