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
      path: '/explore',
      name: 'explore',
      component: () => import('../views/ExploreView.vue'),
    },
  ],
});

export default router;
