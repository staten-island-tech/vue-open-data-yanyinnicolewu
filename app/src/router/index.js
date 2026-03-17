import { createRouter, createWebHistory } from 'vue-router'
import BabyName from '@/views/BabyName.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'babyname',
      component: BabyName,
    },
  ],
})

export default router
