import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface User {
  id: number
  username: string
  name: string
  role: string
  avatar: string
  age: number
}

// Тестовые пользователи
const users = [
  { 
    id: 1, 
    username: 'admin', 
    password: 'admin', 
    name: 'Администратор', 
    role: 'admin',
    avatar: 'https://images.pexels.com/photos/2269872/pexels-photo-2269872.jpeg',
    age: 30
  },
  { 
    id: 2, 
    username: 'user1', 
    password: 'password', 
    name: 'Иван Петров', 
    role: 'user',
    avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg',
    age: 25
  },
  { 
    id: 3, 
    username: 'user2', 
    password: 'password', 
    name: 'Анна Сидорова', 
    role: 'user',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
    age: 28
  }
]

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<User | null>(null)
  const loginError = ref('')
  
  const isAuthenticated = computed(() => currentUser.value !== null)
  
  function checkAuth() {
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      try {
        currentUser.value = JSON.parse(savedUser)
      } catch (e) {
        localStorage.removeItem('currentUser')
      }
    }
  }
  
  function login(username: string, password: string) {
    loginError.value = ''
    
    const user = users.find(u => u.username === username && u.password === password)
    
    if (user) {
      const { password, ...userWithoutPassword } = user
      currentUser.value = userWithoutPassword as User
      localStorage.setItem('currentUser', JSON.stringify(currentUser.value))
      return true
    } else {
      loginError.value = 'Неверное имя пользователя или пароль'
      return false
    }
  }
  
  function logout() {
    currentUser.value = null
    localStorage.removeItem('currentUser')
  }
  
  return {
    currentUser,
    isAuthenticated,
    loginError,
    login,
    logout,
    checkAuth
  }
})