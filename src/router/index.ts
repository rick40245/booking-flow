import { createRouter, createWebHistory } from 'vue-router'
import PageServiceList from '../views/PageServiceList.vue'
import PageBookingForm from '../views/PageBookingForm.vue'
import PageBookingSummary from '../views/PageBookingSummary.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'service-list',
      component: PageServiceList,
    },
    {
      path: '/booking',
      name: 'booking-form',
      component: PageBookingForm,
    },
    {
      path: '/summary',
      name: 'booking-summary',
      component: PageBookingSummary,
    },
  ],
})

// 路由守衛將在 main.ts 中統一註冊，因需與 Pinia 狀態、Dialog 整合
export default router
