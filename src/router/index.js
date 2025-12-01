import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Tracking from '../views/Tracking.vue';
import Profile from '../views/Profile.vue';

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/tracking',
    name: 'Tracking',
    component: Tracking
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
