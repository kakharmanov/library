<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

function logout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <header class="app-header">
    <div class="container">
      <div class="header-content">
        <div class="logo" @click="router.push('/library')">
          <h1>Букриум</h1>
        </div>

        <nav class="nav-menu" v-if="authStore.isAuthenticated">
          <router-link to="/library" class="nav-link">Библиотека</router-link>
          <router-link to="/profile" class="nav-link">Профиль</router-link>
          <button @click="logout" class="btn-logout">Выйти</button>
        </nav>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  background-color: var(--color-primary);
  color: white;
  box-shadow: var(--shadow-md);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-4) 0;
}

.logo {
  cursor: pointer;
  transition: transform var(--transition-fast);
}

.logo:hover {
  transform: scale(1.05);
}

.logo h1 {
  font-size: 1.5rem;
  margin: 0;
  font-weight: 700;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: var(--space-6);
}

.nav-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: color var(--transition-fast);
}

.nav-link:hover {
  color: var(--color-accent-light);
}

.btn-logout {
  background-color: transparent;
  border: 1px solid white;
  color: white;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-logout:hover {
  background-color: white;
  color: var(--color-primary);
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: var(--space-4);
    padding: var(--space-4);
    align-items: flex-start;
  }

  .nav-menu {
    width: 100%;
    justify-content: space-between;
  }
}
</style>