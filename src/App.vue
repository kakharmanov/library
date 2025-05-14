<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'

const router = useRouter()
const authStore = useAuthStore()

onMounted(() => {
  // Check if user is logged in
  authStore.checkAuth()
})
</script>

<template>
  <router-view />
</template>

<style>
body {
  margin: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

html, body {
  overscroll-behavior: none; /* Отключает эффект перетягивания */
  overflow-x: hidden; /* На всякий случай скрываем горизонтальный скролл */
}
</style>