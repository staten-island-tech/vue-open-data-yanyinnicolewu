import { createRouter, createWebHistory } from 'vue-router'
import BabyName from '@/views/BabyName.vue'
import BabyNameData from '@/views/BabyNameData.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'babyname',
      component: BabyName,
    },
    {
      path: '/babyPath/:nm',
      name: 'babynamedata',
      component: BabyNameData,
    },
  ],
})

export default router
