<template>
  <div class="container">
    <h1>Login Kassasysteem</h1>
    <form @submit.prevent="login" class="login-form">
      <label>Gebruikersnaam:</label>
      <input v-model="username" placeholder="Gebruikersnaam" required />

      <label>Wachtwoord:</label>
      <input type="password" v-model="password" placeholder="Wachtwoord" required />

      <button type="submit">🔐 Inloggen</button>
      <p v-if="error" class="melding">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import router from '@/router/index.js'

const username = ref('')
const password = ref('')
const error = ref('')

const login = async () => {
  try {
    const res = await axios.post('http://localhost:8080/api/auth/login', {
      gebruikersnaam: username.value,
      wachtwoord: password.value,
    })
    localStorage.setItem('token', res.data.token)
    router.push('/dashboard')
  } catch (err) {
    error.value = '❌ Foutieve gebruikersnaam of wachtwoord'
  }
}
</script>

<style scoped>
.container {
  padding: 1.5rem;
  max-width: 400px;
  margin: 2rem auto;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
}
.login-form {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}
input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
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
  color: red;
}
</style>