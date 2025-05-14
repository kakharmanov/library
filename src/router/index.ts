import { createRouter, createWebHashHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

import Login from '../views/Login.vue';
import Library from '../views/Library.vue';
import BookDetail from '../views/BookDetail.vue';
import Reader from '../views/Reader.vue';
import Profile from '../views/Profile.vue';
import NotFound from '../views/NotFound.vue';

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false },
  },
  {
    path: '/library',
    name: 'Library',
    component: Library,
    meta: { requiresAuth: true },
  },
  {
    path: '/book/:id',
    name: 'BookDetail',
    component: BookDetail,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/read/:id',
    name: 'Reader',
    component: Reader,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login' });
  } else if (to.name === 'Login' && authStore.isAuthenticated) {
    next({ name: 'Library' });
  } else {
    next();
  }
});

export default router;
