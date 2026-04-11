import { createRouter, createWebHistory } from 'vue-router'

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
      path: '/p/:productSlug',
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
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: () => import('@/pages/FavoritesPage/FavoritesPage.vue'),
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('@/pages/OrdersPage/OrdersPage.vue'),
    },
    {
      path: '/orders/:orderId',
      name: 'order-detail',
      component: () => import('@/pages/OrderDetailPage/OrderDetailPage.vue'),
    },
    {
      path: '/account',
      name: 'account',
      component: () => import('@/pages/AccountPage/AccountPage.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/pages/RegisterPage/RegisterPage.vue'),
    },
    {
      path: '/terms-and-conditions',
      name: 'terms-and-conditions',
      component: () => import('@/pages/TermsAndConditionsPage/TermsAndConditionsPage.vue'),
    },
  ],
})

export default router
