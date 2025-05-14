<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useBooksStore } from '../stores/books'
import AppHeader from '../components/AppHeader.vue'
import BookCard from '../components/BookCard.vue'

const router = useRouter()
const route = useRoute()
const booksStore = useBooksStore()

// Get book ID from route params
const bookId = computed(() => Number(route.params.id))

// Get book and progress data
const book = computed(() => booksStore.getBook(bookId.value))
const progress = computed(() => booksStore.getBookProgress(bookId.value))

// Calculate progress percentage
const progressPercentage = computed(() => {
  if (!progress.value || !book.value) return 0
  return Math.floor((progress.value.currentPage / book.value.pages) * 100)
})

// Check if book exists
if (!book.value) {
  router.push('/library')
}

// Start reading
function startReading() {
  router.push(`/read/${bookId.value}`)
}

onMounted(() => {
  booksStore.initUserProgress()
})
</script>

<template>
  <div class="book-detail-page" v-if="book">
    <AppHeader />

    <main class="container">
      <div class="back-link">
        <a @click.prevent="router.push('/library')" href="#">&larr; Назад к библиотеке</a>
      </div>

      <div class="book-hero">
        <div class="book-cover">
          <img :src="book.cover" :alt="book.title" />
        </div>

        <div class="book-info">
          <h1 style="color:#fff" class="book-title">{{ book.title }}</h1>
          <p class="book-author"> {{ book.author }}</p>

          <div class="book-meta">
            <div class="meta-item">
              <span class="meta-label">Рейтинг</span>
              <span class="meta-value">{{ book.rating.toFixed(1) }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Год</span>
              <span class="meta-value">{{ book.year }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Страниц</span>
              <span class="meta-value">{{ book.pages }}</span>
            </div>
          </div>

          <div class="book-genres">
            <span v-for="genre in book.genre" :key="genre" class="book-genre">
              {{ genre }}
            </span>
          </div>

          <p class="book-description">{{ book.description }}</p>

          <div class="reading-progress" v-if="progress">
            <div class="progress-label">
              <span>Прогресс чтения: {{ progressPercentage }}%</span>
              <span>Стриница {{ progress.currentPage }} из {{ book.pages }}</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: `${progressPercentage}%` }"></div>
            </div>
          </div>

          <div class="book-actions">
            <button @click="startReading" class="btn-primary">
              {{ progress ? 'Продолжить чтение' : 'Начать чтение' }}
            </button>
          </div>
        </div>
      </div>

      <section class="recommendations-section">
        <h2>Вас также может заинтересовать</h2>
        <div class="recommendations-grid">
          <div v-for="recBook in booksStore.recommendations.slice(0, 4)" :key="recBook.id" class="recommendation-item">
            <BookCard :book="recBook" />
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.book-detail-page {
  min-height: 100vh;
  background-color: var(--color-gray-50);
}

.container {
  padding-top: var(--space-6);
  padding-bottom: var(--space-10);
}

.back-link {
  margin-bottom: var(--space-6);
}

.back-link a {
  display: inline-block;
  color: var(--color-gray-600);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.back-link a:hover {
  color: var(--color-primary);
}

.book-hero {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: var(--space-8);
  margin-bottom: var(--space-10);
}

.book-cover {
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  aspect-ratio: 2/3;
}

.book-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.book-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 var(--space-2);
  line-height: 1.2;
  color: var(--color-gray-900);
}

.book-author {
  font-size: 1.25rem;
  color: var(--color-gray-600);
  margin: 0 0 var(--space-6);
}

.book-meta {
  display: flex;
  gap: var(--space-8);
  margin-bottom: var(--space-4);
}

.meta-item {
  display: flex;
  flex-direction: column;
}

.meta-label {
  font-size: 0.875rem;
  color: var(--color-gray-500);
}

.meta-value {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-gray-900);
}

.book-genres {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}

.book-genre {
  background-color: var(--color-gray-200);
  color: var(--color-gray-700);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full, 9999px);
  font-size: 0.875rem;
}

.book-description {
  color: var(--color-gray-700);
  line-height: 1.6;
  margin-bottom: var(--space-6);
}

.reading-progress {
  margin-bottom: var(--space-6);
}

.progress-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--space-2);
  font-size: 0.875rem;
  color: var(--color-gray-700);
}

.progress-bar {
  height: 8px;
  background-color: var(--color-gray-200);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: var(--color-accent);
  border-radius: 4px;
  transition: width 0.5s ease;
}

.book-actions {
  display: flex;
  gap: var(--space-4);
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
  padding: var(--space-3) var(--space-6);
  border: none;
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.btn-primary:hover {
  background-color: var(--color-primary-dark);
}

.recommendations-section {
  margin-top: var(--space-10);
}

.recommendations-section h2 {
  font-size: 1.5rem;
  margin-bottom: var(--space-6);
  color: var(--color-gray-900);
}

.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: var(--space-6);
}

@media (max-width: 768px) {
  .book-hero {
    grid-template-columns: 1fr;
    gap: var(--space-6);
  }

  .book-cover {
    max-width: 250px;
    margin: 0 auto;
  }

  .recommendations-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: var(--space-4);
  }

  .book-title {
    font-size: 1.75rem;
  }

  .book-author {
    font-size: 1.125rem;
  }
}

@media (prefers-color-scheme: dark) {
  .book-title {
    color: var(--color-gray-100);
  }

  .meta-value {
    color: var(--color-gray-200);
  }

  .book-description {
    color: var(--color-gray-300);
  }

  .book-author, .progress-label {
    color: var(--color-gray-400);
  }

  .book-genre {
    background-color: var(--color-gray-700);
    color: var(--color-gray-300);
  }

  .progress-bar {
    background-color: var(--color-gray-700);
  }

  .recommendations-section h2 {
    color: var(--color-gray-200);
  }
}
</style>