<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useBooksStore } from '../stores/books'
import AppHeader from '../components/AppHeader.vue'
import BookCard from '../components/BookCard.vue'

const authStore = useAuthStore()
const booksStore = useBooksStore()

const user = computed(() => authStore.currentUser)
const stats = computed(() => booksStore.readingStats)
</script>

<template>
  <div class="profile-page">
    <AppHeader />
    
    <main class="container">
      <div class="profile-header">
        <div class="profile-info">
          <img :src="user?.avatar" :alt="user?.name" class="profile-avatar" />
          <div class="profile-details">
            <h1>{{ user?.name }}</h1>
            <p class="profile-role">{{ user?.role === 'admin' ? 'Администратор' : 'Читатель' }}</p>
            <p class="profile-age">Возраст: {{ user?.age }} лет</p>
          </div>
        </div>
      </div>
      
      <div class="stats-grid">
        <div class="stat-card">
          <h3>Всего книг</h3>
          <p class="stat-value">{{ stats.totalBooks }}</p>
        </div>
        <div class="stat-card">
          <h3>В процессе</h3>
          <p class="stat-value">{{ stats.booksInProgress }}</p>
        </div>
        <div class="stat-card">
          <h3>Завершено</h3>
          <p class="stat-value">{{ stats.completedBooks }}</p>
        </div>
        <div class="stat-card">
          <h3>Страниц прочитано</h3>
          <p class="stat-value">{{ stats.totalPages }}</p>
        </div>
      </div>
      
      <section class="reading-section">
        <h2>Сейчас читаю</h2>
        <div class="books-grid">
          <div v-for="book in booksStore.recentBooks" :key="book.id" class="book-item">
            <BookCard :book="book" :progress="book.progress" />
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.profile-page {
  min-height: 100vh;
  background-color: var(--color-gray-50);
}

.container {
  padding-top: var(--space-6);
  padding-bottom: var(--space-10);
}

.profile-header {
  background-color: white;
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  margin-bottom: var(--space-8);
  box-shadow: var(--shadow-md);
}

.profile-info {
  display: flex;
  gap: var(--space-6);
  align-items: center;
}

.profile-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
}

.profile-details h1 {
  margin: 0 0 var(--space-2);
  font-size: 1.875rem;
  color: var(--color-gray-900);
}

.profile-role {
  color: var(--color-gray-600);
  margin: 0 0 var(--space-2);
}

.profile-age {
  color: var(--color-gray-600);
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-4);
  margin-bottom: var(--space-8);
}

.stat-card {
  background-color: white;
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  text-align: center;
  box-shadow: var(--shadow-md);
}

.stat-card h3 {
  margin: 0 0 var(--space-2);
  color: var(--color-gray-600);
  font-size: 1rem;
}

.stat-value {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-primary);
}

.reading-section {
  background-color: white;
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-md);
}

.reading-section h2 {
  margin: 0 0 var(--space-6);
  color: var(--color-gray-900);
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--space-6);
}

@media (max-width: 768px) {
  .profile-info {
    flex-direction: column;
    text-align: center;
  }
  
  .profile-avatar {
    width: 100px;
    height: 100px;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .books-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: var(--space-4);
  }
}

@media (prefers-color-scheme: dark) {
  .profile-header,
  .stat-card,
  .reading-section {
    background-color: var(--color-gray-800);
  }
  
  .profile-details h1 {
    color: var(--color-gray-100);
  }
  
  .profile-role,
  .profile-age {
    color: var(--color-gray-400);
  }
  
  .stat-card h3 {
    color: var(--color-gray-400);
  }
  
  .reading-section h2 {
    color: var(--color-gray-100);
  }
}
</style>