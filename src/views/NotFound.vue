<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goToLibrary() {
  router.push('/library')
}
</script>

<template>
  <div class="not-found">
    <div class="not-found-content">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>Упс! Страница которую вы ищите не найдена.</p>
      <button @click="goToLibrary" class="btn-primary">Вернуться в Букриум</button>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: var(--color-gray-100);
  padding: var(--space-4);
}

.not-found-content {
  animation: fade-in 0.5s ease-out;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

h1 {
  font-size: 6rem;
  margin: 0;
  color: var(--color-primary);
}

h2 {
  font-size: 2rem;
  margin-bottom: var(--space-4);
  color: var(--color-gray-800);
}

p {
  font-size: 1.125rem;
  color: var(--color-gray-600);
  margin-bottom: var(--space-6);
}

.btn-primary {
  display: inline-block;
  background-color: var(--color-primary);
  color: white;
  padding: var(--space-3) var(--space-6);
  border: none;
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-primary:hover {
  background-color: var(--color-primary-dark);
  transform: translateY(-2px);
}

@media (prefers-color-scheme: dark) {
  .not-found {
    background-color: var(--color-gray-900);
  }

  h2 {
    color: var(--color-gray-100);
  }

  p {
    color: var(--color-gray-400);
  }
}
</style>