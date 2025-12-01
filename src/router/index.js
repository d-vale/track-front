import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Tracking from '../views/Tracking.vue';
import Profile from '../views/Profile.vue';
import Home from '../views/Home.vue';
import ActivitiesHistory from '../views/ActivitiesHistory.vue';
import ActivityDetail from '../views/ActivityDetail.vue';

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
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/history',
    name: 'History',
    component: ActivitiesHistory
  },
  {
    path: '/activity:id',
    name: 'ActivityDetail',
    component: ActivityDetail
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
