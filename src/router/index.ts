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

// Route guards will be registered uniformly in main.ts, as they need to be integrated with Pinia state and Dialogs.
export default router
