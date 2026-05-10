import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/HomePage/HomePage.vue'),
    },
    {
      path: '/cat/:categorySlug',
      name: 'plp',
      component: () => import('@/pages/ProductListingPage/ProductListingPage.vue'),
    },
    {
      path: '/rooms',
      name: 'rooms',
      component: () => import('@/pages/RoomsPage/RoomsPage.vue'),
    },
    {
      path: '/rooms/:roomId',
      name: 'room-detail',
      component: () => import('@/pages/RoomDetailPage/RoomDetailPage.vue'),
    },
    {
      path: '/rooms/:roomId/sets/:setId',
      name: 'product-set-detail',
      component: () => import('@/pages/ProductSetDetailPage/ProductSetDetailPage.vue'),
    },
    {
      path: '/p/:productId',
      name: 'pdp',
      component: () => import('@/pages/ProductDetailPage/ProductDetailPage.vue'),
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('@/pages/SearchPage/SearchPage.vue'),
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('@/pages/CartPage/CartPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('@/pages/CheckoutPage/CheckoutPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: () => import('@/pages/FavoritesPage/FavoritesPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('@/pages/OrdersPage/OrdersPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/orders/:orderId',
      name: 'order-detail',
      component: () => import('@/pages/OrderDetailPage/OrderDetailPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/account',
      name: 'account',
      component: () => import('@/pages/AccountPage/AccountPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/pages/RegisterPage/RegisterPage.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/LoginPage/LoginPage.vue'),
    },
    {
      path: '/terms-and-conditions',
      name: 'terms-and-conditions',
      component: () => import('@/pages/TermsAndConditionsPage/TermsAndConditionsPage.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/pages/NotFoundPage/NotFoundPage.vue'),
    },
  ],
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  if (!authStore.initialized) {
    await authStore.initialize()
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return {
      name: 'login',
      query: { redirect: to.fullPath },
    }
  }

  return true
})

export default router
