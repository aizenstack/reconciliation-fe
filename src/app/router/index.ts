import { createRouter, createWebHistory } from 'vue-router'
import ReconciliationPage from '@/features/reconciliation/pages/ReconciliationPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'reconciliation',
      component: ReconciliationPage,
    },
  ],
})

export default router
