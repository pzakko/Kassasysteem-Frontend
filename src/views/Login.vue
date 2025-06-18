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
import { jwtDecode } from 'jwt-decode' // ✅ correcte import

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
    })

    const token = response.data.token
    localStorage.setItem('token', token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

    // ✅ Rol uitlezen uit token
    const decoded = jwtDecode(token)
    const roles = decoded.roles || []
    const isAdmin = roles.includes('ROLE_ADMIN')

    if (isAdmin) {
      router.push('/producten')
    } else {
      router.push('/producten-gebruiker')
    }

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
