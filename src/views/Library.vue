<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useBooksStore } from '../stores/books'
import AppHeader from '../components/AppHeader.vue'
import BookCard from '../components/BookCard.vue'

const booksStore = useBooksStore()
const activeTab = ref('all')

onMounted(() => {
  booksStore.initUserProgress()
})

function setActiveTab(tab: string) {
  activeTab.value = tab
}
</script>

<template>
  <div class="library-page">
    <AppHeader />

    <main class="container library-container">
      <section class="library-header">
        <h2 style="color:#fff">Витрина книг</h2>

        <div class="library-controls">
          <div class="search-bar">
            <input
              type="text"
              v-model="booksStore.searchQuery"
              placeholder="Поиск по названию или автору..."
            />
          </div>

          <div class="filter-controls">
            <select v-model="booksStore.selectedGenre">
              <option value="">Все жанры</option>
              <option v-for="genre in booksStore.allGenres" :key="genre" :value="genre">
                {{ genre }}
              </option>
            </select>
          </div>
        </div>
      </section>

      <section class="tabs-container">
        <div class="tabs">
          <button
            :class="['tab', { active: activeTab === 'all' }]"
            @click="setActiveTab('all')"
          >
            Все книги
          </button>
          <button
            :class="['tab', { active: activeTab === 'recent' }]"
            @click="setActiveTab('recent')"
          >
           Недавние
          </button>
          <button
            :class="['tab', { active: activeTab === 'recommended' }]"
            @click="setActiveTab('recommended')"
          >
            Рекомендации
          </button>
        </div>
      </section>

      <section v-if="activeTab === 'all'" class="books-grid">
        <div v-for="book in booksStore.filteredBooks" :key="book.id" class="book-item">
          <BookCard
            :book="book"
            :progress="booksStore.getBookProgress(book.id)?.currentPage / book.pages * 100"
          />
        </div>

        <div v-if="booksStore.filteredBooks.length === 0" class="empty-state">
          <p>По данному запросу ничего не найдено.</p>
        </div>
      </section>

      <section v-else-if="activeTab === 'recent'" class="books-grid">
        <div v-for="book in booksStore.recentBooks" :key="book.id" class="book-item">
          <BookCard :book="book" :progress="book.progress" />
        </div>

        <div v-if="booksStore.recentBooks.length === 0" class="empty-state">
          <p>You haven't read any books yet.</p>
          <button class="btn-primary" @click="setActiveTab('all')">Explore Books</button>
        </div>
      </section>

      <section v-else-if="activeTab === 'recommended'" class="books-grid">
        <div v-for="book in booksStore.recommendations" :key="book.id" class="book-item">
          <BookCard :book="book" />
        </div>

        <div v-if="booksStore.recommendations.length === 0" class="empty-state">
          <p>Start reading books to get personalized recommendations.</p>
          <button class="btn-primary" @click="setActiveTab('all')">Explore Books</button>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.library-page {
  min-height: 100vh;
  background-color: var(--color-gray-50);
}

.library-container {
  padding-top: var(--space-6);
  padding-bottom: var(--space-10);
}

.library-header {
  margin-bottom: var(--space-6);
}

.library-header h2 {
  font-size: 2rem;
  margin: 0 0 var(--space-4);
  color: var(--color-gray-900);
}

.library-controls {
  display: flex;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.search-bar {
  flex: 1;
  min-width: 200px;
}

.search-bar input {
  width: 100%;
  padding: var(--space-3);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-md);
}

.filter-controls {
  display: flex;
  gap: var(--space-2);
}

.filter-controls select {
  padding: var(--space-3);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-md);
  background-color: white;
}

.tabs-container {
  margin-bottom: var(--space-6);
}

.tabs {
  display: flex;
  border-bottom: 1px solid var(--color-gray-300);
}

.tab {
  padding: var(--space-3) var(--space-5);
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  font-weight: 500;
  color: var(--color-gray-600);
  transition: all var(--transition-fast);
}

.tab.active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.tab:hover:not(.active) {
  color: var(--color-gray-900);
  background-color: var(--color-gray-100);
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: var(--space-6);
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: var(--space-10);
  background-color: var(--color-gray-100);
  border-radius: var(--radius-lg);
}

.empty-state p {
  margin-bottom: var(--space-4);
  color: var(--color-gray-600);
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
  padding: var(--space-2) var(--space-4);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.btn-primary:hover {
  background-color: var(--color-primary-dark);
}

@media (max-width: 768px) {
  .library-controls {
    flex-direction: column;
  }

  .books-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: var(--space-4);
  }

  .tabs {
    overflow-x: auto;
    padding-bottom: var(--space-1);
    white-space: nowrap;
  }

  .tab {
    padding: var(--space-3) var(--space-4);
  }
}

@media (prefers-color-scheme: dark) {
  .library-header h2 {
    color: var(--color-gray-100);
  }

  .search-bar input,
  .filter-controls select {
    background-color: var(--color-gray-700);
    border-color: var(--color-gray-600);
    color: var(--color-gray-200);
  }

  .tabs {
    border-bottom-color: var(--color-gray-700);
  }

  .tab:hover:not(.active) {
    color: var(--color-gray-100);
    background-color: var(--color-gray-700);
  }

  .empty-state {
    background-color: var(--color-gray-800);
  }
}
</style>