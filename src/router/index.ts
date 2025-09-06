import { createRouter, createWebHistory } from 'vue-router';
import Subconverter from '../views/Subconverter.vue';

const routes = [
  {
    path: '/',
    name: 'SubConverter',
    component: Subconverter,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;