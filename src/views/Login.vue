<template>
  <div class="login-container">
    <h1 class="text-2xl font-bold mb-4">🔐 Login</h1>
    <form @submit.prevent="handleLogin" class="space-y-4">
      <div>
        <label for="username" class="block text-sm font-medium text-gray-700">Gebruikersnaam:</label>
        <input
          v-model="username"
          type="text"
          id="username"
          required
          class="mt-1 p-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Voer gebruikersnaam in"
        />
      </div>
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">Wachtwoord:</label>
        <input
          v-model="password"
          type="password"
          id="password"
          required
          class="mt-1 p-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Voer wachtwoord in"
        />
      </div>
      <button
        type="submit"
        class="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg"
      >
        Inloggen
      </button>
    </form>
    <p v-if="errorMessage" class="mt-4 text-red-500">{{ errorMessage }}</p>
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

// Configureer Axios om geen token te sturen bij login
const handleLogin = async () => {
  console.log('Ingevoerde gegevens:', { username: username.value, password: password.value });

  try {
    // Verwijder eventueel bestaande token uit headers voor login
    const response = await axios.post('http://localhost:8080/api/auth/login', {
      username: username.value,
      password: password.value
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': undefined // Zorgt ervoor dat geen token wordt meegestuurd
      }
    });
    console.log('Response:', response.data);
    const token = response.data.token;
    console.log('Ontvangen token:', token);
    localStorage.setItem('token', token); // Sla de nieuwe token op
    console.log('Token opgeslagen:', localStorage.getItem('token'));

    // Stel de token in voor toekomstige requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    errorMessage.value = '';
    router.push('/producten');
  } catch (error) {
    console.error('Login fout:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    });
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
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.space-y-4 > * + * {
  margin-top: 1rem;
}

input:focus {
  outline: none;
}

button:hover {
  transition: background-color 0.2s;
}
</style>