import { createRouter, createWebHistory } from 'vue-router';
import PokedexView from '../views/PokedexView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/pokedex',
    },
    {
      path: '/pokedex',
      name: 'pokedex',
      component: PokedexView,
    },
    {
      path: '/travel',
      name: 'travel',
      component: () => import('../views/TravelView.vue'),
    },
  ],
});

export default router;
