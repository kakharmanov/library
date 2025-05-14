<script setup lang="ts">
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'
import type { Book } from '../stores/books'

const props = defineProps<{
  book: Book,
  progress?: number
}>()

const router = useRouter()

function viewBook() {
  router.push(`/book/${props.book.id}`)
}
</script>

<template>
  <div class="book-card" @click="viewBook">
    <div class="book-cover">
      <img :src="book.cover" :alt="book.title" />
      <div class="book-rating">{{ book.rating.toFixed(1) }}</div>
      <div v-if="progress" class="book-progress">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
        </div>
        <span class="progress-text">{{Math.round(progress)  }}% прочитано</span>
      </div>
    </div>
    <div class="book-info">
      <h3 class="book-title">{{ book.title }}</h3>
      <p class="book-author">{{ book.author }}</p>
      <div class="book-genres">
        <span v-for="genre in book.genre.slice(0, 2)" :key="genre" class="book-genre">
          {{ genre }}
        </span>
        <span v-if="book.genre.length > 2" class="book-genre-more">+{{ book.genre.length - 2 }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.book-card {
  background-color: white;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.book-cover {
  position: relative;
  aspect-ratio: 2/3;
  overflow: hidden;
}

.book-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-normal);
}

.book-card:hover .book-cover img {
  transform: scale(1.05);
}

.book-rating {
  position: absolute;
  top: var(--space-2);
  right: var(--space-2);
  background-color: var(--color-primary);
  color: white;
  border-radius: var(--radius-md);
  padding: var(--space-1) var(--space-2);
  font-weight: 600;
  font-size: 0.875rem;
}

.book-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.7);
  padding: var(--space-2);
  color: white;
}

.progress-bar {
  height: 4px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: var(--space-1);
}

.progress-fill {
  height: 100%;
  background-color: var(--color-accent);
}

.progress-text {
  font-size: 0.75rem;
}

.book-info {
  padding: var(--space-4);
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.book-title {
  margin: 0 0 var(--space-1);
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-gray-900);
  line-height: 1.3;
}

.book-author {
  margin: 0 0 var(--space-2);
  color: var(--color-gray-600);
  font-size: 0.875rem;
}

.book-genres {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
  margin-top: auto;
}

.book-genre {
  background-color: var(--color-gray-100);
  color: var(--color-gray-700);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-md);
  font-size: 0.75rem;
}

.book-genre-more {
  background-color: var(--color-gray-200);
  color: var(--color-gray-700);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-md);
  font-size: 0.75rem;
}

@media (prefers-color-scheme: dark) {
  .book-card {
    background-color: var(--color-gray-800);
  }

  .book-title {
    color: var(--color-gray-100);
  }

  .book-author {
    color: var(--color-gray-400);
  }

  .book-genre {
    background-color: var(--color-gray-700);
    color: var(--color-gray-200);
  }
}
</style>