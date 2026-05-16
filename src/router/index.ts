import { createRouter, createWebHistory } from 'vue-router'
import { adminRouteMeta, authRouteMeta } from './meta'
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
      meta: authRouteMeta,
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('@/pages/CheckoutPage/CheckoutPage.vue'),
      meta: authRouteMeta,
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: () => import('@/pages/FavoritesPage/FavoritesPage.vue'),
      meta: authRouteMeta,
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('@/pages/OrdersPage/OrdersPage.vue'),
      meta: authRouteMeta,
    },
    {
      path: '/orders/:orderId',
      name: 'order-detail',
      component: () => import('@/pages/OrderDetailPage/OrderDetailPage.vue'),
      meta: authRouteMeta,
    },
    {
      path: '/account',
      name: 'account',
      component: () => import('@/pages/AccountPage/AccountPage.vue'),
      meta: authRouteMeta,
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
      path: '/forbidden',
      name: 'forbidden',
      component: () => import('@/pages/ForbiddenPage/ForbiddenPage.vue'),
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/pages/AdminPage/AdminPage.vue'),
      meta: adminRouteMeta,
      children: [
        {
          path: '',
          name: 'admin-dashboard',
          component: () => import('@/pages/AdminDashboardPage/AdminDashboardPage.vue'),
        },
        {
          path: 'products',
          name: 'admin-products',
          component: () => import('@/pages/AdminProductsPage/AdminProductsPage.vue'),
        },
        {
          path: 'categories',
          name: 'admin-categories',
          component: () => import('@/pages/AdminCategoriesPage/AdminCategoriesPage.vue'),
        },
        {
          path: 'images',
          name: 'admin-images',
          component: () => import('@/pages/AdminImagesPage/AdminImagesPage.vue'),
        },
        {
          path: 'rooms',
          name: 'admin-rooms',
          component: () => import('@/pages/AdminRoomsPage/AdminRoomsPage.vue'),
        },
        {
          path: 'product-sets',
          name: 'admin-product-sets',
          component: () => import('@/pages/AdminProductSetsPage/AdminProductSetsPage.vue'),
        },
        {
          path: 'promotions',
          name: 'admin-promotions',
          component: () => import('@/pages/AdminPromotionsPage/AdminPromotionsPage.vue'),
        },
        {
          path: 'orders',
          name: 'admin-orders',
          component: () => import('@/pages/AdminOrdersPage/AdminOrdersPage.vue'),
        },
        {
          path: 'carts',
          name: 'admin-carts',
          component: () => import('@/pages/AdminCartsPage/AdminCartsPage.vue'),
        },
        {
          path: 'reviews',
          name: 'admin-reviews',
          component: () => import('@/pages/AdminReviewsPage/AdminReviewsPage.vue'),
        },
        {
          path: 'users',
          name: 'admin-users',
          component: () => import('@/pages/AdminUsersPage/AdminUsersPage.vue'),
        },
        {
          path: 'search-index',
          name: 'admin-search-index',
          component: () => import('@/pages/AdminSearchIndexPage/AdminSearchIndexPage.vue'),
        },
      ],
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

  const requiresAuth = Boolean(to.meta.requiresAuth || to.meta.requiresAdmin)

  if (requiresAuth && !authStore.initialized) {
    await authStore.initialize()
  }

  if (requiresAuth && !authStore.isAuthenticated) {
    return {
      name: 'login',
      query: { redirect: to.fullPath },
    }
  }

  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    return { name: 'not-found', replace: true }
  }

  return true
})

export default router
