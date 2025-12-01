import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Tracking from '../views/Tracking.vue';
import Upload from '../views/Upload.vue';

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
    path: '/upload',
    name: 'Upload',
    component: Upload
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
