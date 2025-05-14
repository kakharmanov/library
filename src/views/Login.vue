<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const username = ref('')
const password = ref('')
const isLoading = ref(false)
const showError = ref(false)
const errorMessage = ref('')

const router = useRouter()
const authStore = useAuthStore()

async function handleLogin() {
  if (!username.value || !password.value) {
    showError.value = true
    errorMessage.value = 'Please enter both username and password'
    return
  }

  isLoading.value = true
  showError.value = false

  try {
    const success = await authStore.login(username.value, password.value)

    if (success) {
      router.push('/library')
    } else {
      showError.value = true
      errorMessage.value = authStore.loginError || 'Login failed. Please try again.'
    }
  } catch (error) {
    showError.value = true
    errorMessage.value = 'An unexpected error occurred'
    console.error('Login error:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <h1>Букриум</h1>
        <p>Твоя карманная библиотека</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username">Логин</label>
          <input
            type="text"
            id="username"
            v-model="username"
            placeholder="Введите логни"
            :class="{ 'error-input': showError && !username }"
          />
        </div>

        <div class="form-group">
          <label for="password">Пароль</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="Введите пароль"
            :class="{ 'error-input': showError && !password }"
          />
        </div>

        <div v-if="showError" class="error-message">
          {{ errorMessage }}
        </div>

        <button
          type="submit"
          class="login-button"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Logging in...' : 'Login' }}
        </button>

        <!-- <div class="login-help">
          <p>Пример логина: <strong>ivan / 12345</strong></p>
        </div> -->
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-gray-100);
  padding: var(--space-4);
}

.login-container {
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  width: 100%;
  max-width: 400px;
  animation: slide-up 0.5s ease-out;
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-header {
  background-color: var(--color-primary);
  color: white;
  padding: var(--space-8) var(--space-6);
  text-align: center;
}

.login-header h1 {
  margin: 0 0 var(--space-2);
  font-size: 2rem;
  font-weight: 700;
}

.login-header p {
  margin: 0;
  opacity: 0.8;
}

.login-form {
  padding: var(--space-6);
}

.form-group {
  margin-bottom: var(--space-4);
}

.form-group label {
  display: block;
  margin-bottom: var(--space-2);
  font-weight: 500;
  color: var(--color-gray-700);
}

.form-group input {
  width: 100%;
  padding: var(--space-3);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-md);
  transition: border-color var(--transition-fast);
}

.form-group input:focus {
  border-color: var(--color-primary);
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.error-input {
  border-color: var(--color-error) !important;
}

.error-message {
  color: var(--color-error);
  margin-bottom: var(--space-4);
  font-size: 0.875rem;
}

.login-button {
  width: 100%;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  padding: var(--space-3);
  font-weight: 600;
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.login-button:hover:not(:disabled) {
  background-color: var(--color-primary-dark);
}

.login-button:disabled {
  background-color: var(--color-gray-400);
  cursor: not-allowed;
}

.login-help {
  margin-top: var(--space-4);
  text-align: center;
  color: var(--color-gray-500);
  font-size: 0.875rem;
}

@media (prefers-color-scheme: dark) {
  .login-page {
    background-color: var(--color-gray-900);
  }

  .login-container {
    background-color: var(--color-gray-800);
  }

  .form-group label {
    color: var(--color-gray-300);
  }

  .form-group input {
    background-color: var(--color-gray-700);
    border-color: var(--color-gray-600);
    color: var(--color-gray-200);
  }

  .login-help {
    color: var(--color-gray-400);
  }
}
</style>