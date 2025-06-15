<!-- <template>
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
</style> -->

<!-- <template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="text-3xl font-bold mb-6 text-center text-gray-800">🔐 Welkom bij KassaSysteem</h1>
      <form @submit.prevent="handleLogin" class="space-y-6" aria-label="Login form">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700">Gebruikersnaam:</label>
          <input
            v-model="username"
            type="text"
            id="username"
            required
            :class="['mt-1 p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500', { 'border-red-500': usernameError }]"
            placeholder="Voer gebruikersnaam in"
            aria-describedby="username-error"
          />
          <p v-if="usernameError" id="username-error" class="text-red-500 text-xs mt-1">Gebruikersnaam is verplicht.</p>
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Wachtwoord:</label>
          <input
            v-model="password"
            type="password"
            id="password"
            required
            :class="['mt-1 p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500', { 'border-red-500': passwordError }]"
            placeholder="Voer wachtwoord in"
            aria-describedby="password-error"
          />
          <p v-if="passwordError" id="password-error" class="text-red-500 text-xs mt-1">Wachtwoord is verplicht.</p>
        </div>
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition duration-200 flex items-center justify-center"
        >
          <span v-if="loading" class="animate-spin mr-2">🔄</span>
          <span>Inloggen</span>
        </button>
        <div class="text-center">
          <a href="#" class="text-sm text-blue-600 hover:underline">Wachtwoord vergeten?</a>
          <span class="text-gray-500 mx-2">|</span>
          <a href="#" class="text-sm text-blue-600 hover:underline">Registreren</a>
        </div>
      </form>
      <p v-if="errorMessage" class="mt-4 text-red-500 text-center">{{ errorMessage }}</p>
      <p v-if="successMessage" class="mt-4 text-green-500 text-center">{{ successMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const loading = ref(false);
const usernameError = ref(false);
const passwordError = ref(false);
const router = useRouter();

// Valideer invoer
const validateInput = () => {
  usernameError.value = !username.value.trim();
  passwordError.value = !password.value.trim();
  return !usernameError.value && !passwordError.value;
};

// Configureer Axios om geen token te sturen bij login
const handleLogin = async () => {
  if (!validateInput()) return;

  loading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  console.log('Ingevoerde gegevens:', { username: username.value, password: password.value });

  try {
    const response = await axios.post('http://localhost:8080/api/auth/login', {
      username: username.value,
      password: password.value
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': undefined
      }
    });
    console.log('Response:', response.data);
    const token = response.data.token;
    console.log('Ontvangen token:', token);
    localStorage.setItem('token', token);
    console.log('Token opgeslagen:', localStorage.getItem('token'));

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    successMessage.value = 'Succesvol ingelogd! Je wordt doorgestuurd...';
    setTimeout(() => router.push('/producten'), 1000); // Korte vertraging voor feedback
  } catch (error) {
    console.error('Login fout:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    });
    errorMessage.value = 'Inloggen mislukt. Controleer je gegevens.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #e0eafc, #cfdef3);
}

.login-card {
  max-width: 400px;
  width: 100%;
  padding: 2rem;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.login-card:hover {
  transform: translateY(-2px);
}

.space-y-6 > * + * {
  margin-top: 1.5rem;
}

input:focus {
  outline: none;
}

button:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

button:disabled:hover {
  background-color: #9ca3af;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style> -->

<template>
  <div class="login-container">
    <h1 class="text-3xl font-semibold text-center text-blue-600 mb-6">🔐 Welkom terug</h1>
    <form @submit.prevent="handleLogin" class="space-y-6">
      <div>
        <label for="username" class="block mb-1 text-sm font-medium text-gray-800">Gebruikersnaam</label>
        <input
          v-model="username"
          type="text"
          id="username"
          required
          class="form-input"
          placeholder="Voer gebruikersnaam in"
        />
      </div>

      <div>
        <label for="password" class="block mb-1 text-sm font-medium text-gray-800">Wachtwoord</label>
        <div class="relative">
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            id="password"
            required
            class="form-input pr-10"
            placeholder="Voer wachtwoord in"
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute inset-y-0 right-2 px-2 text-gray-500 hover:text-gray-700"
            tabindex="-1"
          >
            {{ showPassword ? '🙈' : '👁️' }}
          </button>
        </div>
      </div>

      <button
        type="submit"
        class="btn-primary"
        :disabled="loading"
      >
        {{ loading ? 'Bezig met inloggen...' : 'Inloggen' }}
      </button>
    </form>

    <p v-if="errorMessage" class="mt-4 text-center text-red-600 text-sm">
      {{ errorMessage }}
    </p>
    <p class="mt-4 text-center text-sm text-gray-600">
      Nog geen account? <a href="/registreren" class="text-blue-600 hover:underline">Registreer hier</a>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const errorMessage = ref('')
const loading = ref(false)
const showPassword = ref(false)

const router = useRouter()

const handleLogin = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    const response = await axios.post('http://localhost:8080/api/auth/login', {
      username: username.value,
      password: password.value
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': undefined
      }
    })

    const token = response.data.token
    localStorage.setItem('token', token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    router.push('/producten')
  } catch (error) {
    errorMessage.value = 'Inloggen mislukt. Controleer je gebruikersnaam en wachtwoord.'
    console.error('Login fout:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  max-width: 420px;
  margin: 100px auto;
  padding: 32px;
  border-radius: 12px;
  background: linear-gradient(to bottom, #ffffff, #f9fafb);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
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

.btn-primary {
  width: 100%;
  background-color: #3b82f6;
  color: white;
  padding: 12px;
  font-size: 1rem;
  border: none;
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-primary:disabled {
  background-color: #9cc3f9;
  cursor: not-allowed;
}
</style>
