<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBooksStore } from '../stores/books'

const route = useRoute()
const router = useRouter()
const booksStore = useBooksStore()

// Get book ID from route params
const bookId = computed(() => Number(route.params.id))

// Get book data
const book = computed(() => booksStore.getBook(bookId.value))
const progress = computed(() => booksStore.getBookProgress(bookId.value) || null)

// Reading preferences
const fontSize = ref(18)
const theme = ref('light')
const showControls = ref(false)
const isFullscreen = ref(false)
const showNotesPanel = ref(false)

// Notes feature
const currentNote = ref('')
const currentPage = ref(1)

// Check if book exists
if (!book.value) {
  router.push('/library')
}

// Init current page from progress if available
onMounted(() => {
  if (progress.value) {
    currentPage.value = progress.value.currentPage
  } else {
    // Start from page 1 if no progress
    currentPage.value = 1
  }

  // Save initial progress if none exists
  if (!progress.value) {
    booksStore.updateProgress(bookId.value, currentPage.value)
  }

  // Add keyboard shortcuts
  document.addEventListener('keydown', handleKeyboard)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeyboard)

  // Save progress when leaving reader
  saveProgress()
})

// Automatically save progress every minute
const autoSaveInterval = setInterval(saveProgress, 60000)
onBeforeUnmount(() => {
  clearInterval(autoSaveInterval)
})

function handleKeyboard(event: KeyboardEvent) {
  if (event.key === 'ArrowLeft') {
    previousPage()
  } else if (event.key === 'ArrowRight') {
    nextPage()
  } else if (event.key === 'f' && event.ctrlKey) {
    toggleFullscreen()
    event.preventDefault()
  }
}

function saveProgress() {
  if (book.value) {
    booksStore.updateProgress(bookId.value, currentPage.value)
  }
}

function nextPage() {
  if (book.value && currentPage.value < book.value.pages) {
    currentPage.value++
    saveProgress()
  }
}

function previousPage() {
  if (currentPage.value > 1) {
    currentPage.value--
    saveProgress()
  }
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
      isFullscreen.value = false
    }
  }
}

function saveNote() {
  if (currentNote.value && book.value) {
    booksStore.addNote(bookId.value, currentPage.value, currentNote.value)
    currentNote.value = ''
  }
}

const currentNotes = computed(() => {
  if (!progress.value) return []
  return progress.value.notes.filter(note => note.page === currentPage.value)
})

// Calculate progress percentage
const progressPercentage = computed(() => {
  if (!book.value) return 0
  return Math.floor((currentPage.value / book.value.pages) * 100)
})

// Get content with proper font size
const contentStyle = computed(() => {
  return {
    fontSize: `${fontSize.value}px`
  }
})

// Theme class
const themeClass = computed(() => {
  return `reader-theme-${theme.value}`
})

watch(currentPage, () => {
  // Scroll to top when changing pages
  window.scrollTo(0, 0)
})
</script>

<template>
  <div :class="['reader-container', themeClass]" v-if="book">
    <!-- Reader Header -->
    <header class="reader-header" :class="{ 'show-controls': showControls }">
      <div class="header-left">
        <button class="icon-button" @click="router.push(`/book/${bookId}`)">
          &larr; Назад
        </button>
      </div>

      <div class="header-title">
        {{ book.title }}
      </div>

      <div class="header-right">
        <button class="icon-button" @click="showControls = !showControls">
          ⚙️
        </button>
      </div>
    </header>

    <!-- Reader Controls -->
    <div class="reader-controls" v-if="showControls">
      <div class="control-group">
        <label>Размер текста</label>
        <div class="font-size-controls">
          <button @click="fontSize = Math.max(12, fontSize - 2)">A-</button>
          <span>{{ fontSize }}px</span>
          <button @click="fontSize = Math.min(30, fontSize + 2)">A+</button>
        </div>
      </div>

      <div class="control-group">
        <label>Тема</label>
        <div class="theme-controls">
          <button
            :class="{ active: theme === 'light' }"
            @click="theme = 'light'"
          >
            Светлая
          </button>
          <button
            :class="{ active: theme === 'sepia' }"
            @click="theme = 'sepia'"
          >
            Сепия
          </button>
          <button
            :class="{ active: theme === 'dark' }"
            @click="theme = 'dark'"
          >
            Темная
          </button>
        </div>
      </div>

      <div class="control-group">
        <button class="full-btn" @click="toggleFullscreen">
          {{ isFullscreen ? 'Выйти из полноэкранного режима' : 'На весь экран' }}
        </button>

        <button class="full-btn" @click="showNotesPanel = !showNotesPanel">
          {{ showNotesPanel ? 'Скрыть заметки' : 'Показать заметки' }}
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="reader-content">
      <!-- Book content -->
      <div class="book-text" :style="contentStyle">
        <p>{{ book.content }}</p>
        <p v-for="p in 10" :key="p">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        </p>
      </div>
    </div>

    <!-- Notes panel (sidebar) -->
    <div class="notes-panel" v-if="showNotesPanel">
      <h3>Заметки для страницы {{ currentPage }}</h3>

      <div class="notes-list">
        <div v-if="currentNotes.length === 0" class="empty-notes">
          <p>Нет заметок для этой страницы</p>
        </div>

        <div v-for="(note, index) in currentNotes" :key="index" class="note-item">
          <p>{{ note.text }}</p>
        </div>
      </div>

      <div class="add-note-form">
        <textarea
          v-model="currentNote"
          placeholder="Add a note for this page..."
          rows="3"
        ></textarea>
        <button @click="saveNote" class="save-note-btn">Сохранить заметку</button>
      </div>
    </div>

    <!-- Navigation controls -->
    <div class="page-navigation">
      <button
        @click="previousPage"
        :disabled="currentPage <= 1"
        class="nav-button prev-button"
      >
        &larr;
      </button>

      <div class="page-info">
        <span class="current-page">Страница {{ currentPage }} из {{ book.pages }}</span>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${progressPercentage}%` }"></div>
        </div>
      </div>

      <button
        @click="nextPage"
        :disabled="currentPage >= book.pages"
        class="nav-button next-button"
      >
        &rarr;
      </button>
    </div>
  </div>
</template>

<style scoped>
.reader-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

/* Themes */
.reader-theme-light {
  --reader-bg: #ffffff;
  --reader-text: #333333;
  --reader-ui-bg: #f9f9f9;
  --reader-ui-border: #e0e0e0;
  --reader-ui-text: #444444;
}

.reader-theme-sepia {
  --reader-bg: #f8f3e8;
  --reader-text: #5b4636;
  --reader-ui-bg: #efe6d5;
  --reader-ui-border: #d8cfbf;
  --reader-ui-text: #5b4636;
}

.reader-theme-dark {
  --reader-bg: #1a1a1a;
  --reader-text: #e0e0e0;
  --reader-ui-bg: #2a2a2a;
  --reader-ui-border: #444444;
  --reader-ui-text: #e0e0e0;
}

/* Header */
.reader-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3) var(--space-4);
  background-color: var(--reader-ui-bg);
  border-bottom: 1px solid var(--reader-ui-border);
  color: var(--reader-ui-text);
  z-index: 10;
}

.header-title {
  font-weight: 500;
  max-width: 60%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.icon-button {
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--reader-ui-text);
  font-size: 1rem;
}

/* Controls */
.reader-controls {
  background-color: var(--reader-ui-bg);
  border-bottom: 1px solid var(--reader-ui-border);
  padding: var(--space-4);
  display: flex;
  gap: var(--space-6);
  flex-wrap: wrap;
  align-items: center;
  animation: slide-down 0.3s ease-out;
}

@keyframes slide-down {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.control-group label {
  font-size: 0.875rem;
  color: var(--reader-ui-text);
  opacity: 0.8;
}

.font-size-controls, .theme-controls {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.font-size-controls button, .theme-controls button {
  border: 1px solid var(--reader-ui-border);
  background-color: var(--reader-bg);
  color: var(--reader-text);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-md);
  cursor: pointer;
}

.theme-controls button.active {
  background-color: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.full-btn {
  padding: var(--space-2) var(--space-4);
  background-color: var(--reader-bg);
  border: 1px solid var(--reader-ui-border);
  border-radius: var(--radius-md);
  color: var(--reader-text);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.full-btn:hover {
  background-color: var(--reader-ui-border);
}

/* Content */
.reader-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-6) var(--space-4);
  background-color: var(--reader-bg);
  color: var(--reader-text);
  display: flex;
  justify-content: center;
}

.book-text {
  max-width: 800px;
  width: 100%;
  font-family: var(--font-serif);
  line-height: 1.8;
}

/* Notes Panel */
.notes-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  height: 100vh;
  background-color: var(--reader-ui-bg);
  border-left: 1px solid var(--reader-ui-border);
  padding: var(--space-6) var(--space-4);
  overflow-y: auto;
  z-index: 100;
  box-shadow: -4px 0 10px rgba(0, 0, 0, 0.1);
  animation: slide-in 0.3s ease-out;
}

@keyframes slide-in {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.notes-panel h3 {
  margin-top: 0;
  margin-bottom: var(--space-4);
  font-size: 1.125rem;
  color: var(--reader-ui-text);
}

.notes-list {
  margin-bottom: var(--space-6);
}

.note-item {
  background-color: var(--reader-bg);
  border: 1px solid var(--reader-ui-border);
  border-radius: var(--radius-md);
  padding: var(--space-3);
  margin-bottom: var(--space-3);
}

.empty-notes {
  color: var(--reader-ui-text);
  opacity: 0.6;
  text-align: center;
  padding: var(--space-4);
}

.add-note-form textarea {
  width: 100%;
  padding: var(--space-2);
  border: 1px solid var(--reader-ui-border);
  border-radius: var(--radius-md);
  background-color: var(--reader-bg);
  color: var(--reader-text);
  resize: vertical;
  margin-bottom: var(--space-2);
}

.save-note-btn {
  width: 100%;
  padding: var(--space-2);
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.save-note-btn:hover {
  background-color: var(--color-primary-dark);
}

/* Navigation */
.page-navigation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3) var(--space-6);
  background-color: var(--reader-ui-bg);
  border-top: 1px solid var(--reader-ui-border);
}

.nav-button {
  background-color: var(--reader-bg);
  border: 1px solid var(--reader-ui-border);
  color: var(--reader-text);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.25rem;
  transition: background-color var(--transition-fast);
}

.nav-button:hover:not(:disabled) {
  background-color: var(--reader-ui-border);
}

.nav-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  flex: 1;
  margin: 0 var(--space-4);
}

.current-page {
  font-size: 0.875rem;
  color: var(--reader-ui-text);
}

.progress-bar {
  width: 100%;
  max-width: 300px;
  height: 4px;
  background-color: var(--reader-ui-border);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: var(--color-primary);
  border-radius: 2px;
  transition: width 0.3s ease;
}

@media (max-width: 768px) {
  .reader-controls {
    flex-direction: column;
    align-items: stretch;
    gap: var(--space-4);
  }

  .notes-panel {
    width: 100%;
  }

  .book-text {
    padding: 0 var(--space-3);
  }

  .page-navigation {
    padding: var(--space-3) var(--space-3);
  }

  .current-page {
    font-size: 0.75rem;
  }
}
</style>