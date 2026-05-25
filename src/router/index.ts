import { createRouter, createWebHistory } from 'vue-router'
import { adminRouteMeta, authRouteMeta } from './meta'
import { useAuthStore } from '@/stores'
import { i18n } from '@/i18n'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/HomePage/HomePage.vue'),
      meta: { titleKey: 'pages.home' },
    },
    {
      path: '/cat/:categorySlug',
      name: 'plp',
      component: () => import('@/pages/ProductListingPage/ProductListingPage.vue'),
      meta: { titleKey: 'pages.products' },
    },
    {
      path: '/rooms',
      name: 'rooms',
      component: () => import('@/pages/RoomsPage/RoomsPage.vue'),
      meta: { titleKey: 'pages.rooms' },
    },
    {
      path: '/rooms/:roomId',
      name: 'room-detail',
      component: () => import('@/pages/RoomDetailPage/RoomDetailPage.vue'),
      meta: { titleKey: 'pages.roomDetail' },
    },
    {
      path: '/rooms/:roomId/sets/:setId',
      name: 'product-set-detail',
      component: () => import('@/pages/ProductSetDetailPage/ProductSetDetailPage.vue'),
      meta: { titleKey: 'pages.productSetDetail' },
    },
    {
      path: '/p/:productId',
      name: 'pdp',
      component: () => import('@/pages/ProductDetailPage/ProductDetailPage.vue'),
      meta: { titleKey: 'pages.productDetail' },
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('@/pages/SearchPage/SearchPage.vue'),
      meta: { titleKey: 'pages.search' },
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('@/pages/CartPage/CartPage.vue'),
      meta: { ...authRouteMeta, titleKey: 'pages.cart' },
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('@/pages/CheckoutPage/CheckoutPage.vue'),
      meta: { ...authRouteMeta, titleKey: 'pages.checkout' },
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: () => import('@/pages/FavoritesPage/FavoritesPage.vue'),
      meta: { ...authRouteMeta, titleKey: 'pages.favorites' },
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('@/pages/OrdersPage/OrdersPage.vue'),
      meta: { ...authRouteMeta, titleKey: 'pages.orders' },
    },
    {
      path: '/orders/:orderId',
      name: 'order-detail',
      component: () => import('@/pages/OrderDetailPage/OrderDetailPage.vue'),
      meta: { ...authRouteMeta, titleKey: 'pages.orderDetail' },
    },
    {
      path: '/account',
      name: 'account',
      component: () => import('@/pages/AccountPage/AccountPage.vue'),
      meta: { ...authRouteMeta, titleKey: 'pages.account' },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/pages/RegisterPage/RegisterPage.vue'),
      meta: { titleKey: 'pages.register' },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/LoginPage/LoginPage.vue'),
      meta: { titleKey: 'pages.login' },
    },
    {
      path: '/forbidden',
      name: 'forbidden',
      component: () => import('@/pages/ForbiddenPage/ForbiddenPage.vue'),
      meta: { titleKey: 'pages.forbidden' },
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/pages/AdminPage/AdminPage.vue'),
      meta: { ...adminRouteMeta, titleKey: 'pages.admin' },
      children: [
        {
          path: '',
          name: 'admin-dashboard',
          component: () => import('@/pages/AdminDashboardPage/AdminDashboardPage.vue'),
          meta: { titleKey: 'pages.adminDashboard' },
        },
        {
          path: 'products',
          name: 'admin-products',
          component: () => import('@/pages/AdminProductsPage/AdminProductsPage.vue'),
          meta: { titleKey: 'pages.adminProducts' },
        },
        {
          path: 'categories',
          name: 'admin-categories',
          component: () => import('@/pages/AdminCategoriesPage/AdminCategoriesPage.vue'),
          meta: { titleKey: 'pages.adminCategories' },
        },
        {
          path: 'images',
          name: 'admin-images',
          component: () => import('@/pages/AdminImagesPage/AdminImagesPage.vue'),
          meta: { titleKey: 'pages.adminImages' },
        },
        {
          path: 'rooms',
          name: 'admin-rooms',
          component: () => import('@/pages/AdminRoomsPage/AdminRoomsPage.vue'),
          meta: { titleKey: 'pages.adminRooms' },
        },
        {
          path: 'product-sets',
          name: 'admin-product-sets',
          component: () => import('@/pages/AdminProductSetsPage/AdminProductSetsPage.vue'),
          meta: { titleKey: 'pages.adminProductSets' },
        },
        {
          path: 'promotions',
          name: 'admin-promotions',
          component: () => import('@/pages/AdminPromotionsPage/AdminPromotionsPage.vue'),
          meta: { titleKey: 'pages.adminPromotions' },
        },
        {
          path: 'orders',
          name: 'admin-orders',
          component: () => import('@/pages/AdminOrdersPage/AdminOrdersPage.vue'),
          meta: { titleKey: 'pages.adminOrders' },
        },
        {
          path: 'carts',
          name: 'admin-carts',
          component: () => import('@/pages/AdminCartsPage/AdminCartsPage.vue'),
          meta: { titleKey: 'pages.adminCarts' },
        },
        {
          path: 'reviews',
          name: 'admin-reviews',
          component: () => import('@/pages/AdminReviewsPage/AdminReviewsPage.vue'),
          meta: { titleKey: 'pages.adminReviews' },
        },
        {
          path: 'users',
          name: 'admin-users',
          component: () => import('@/pages/AdminUsersPage/AdminUsersPage.vue'),
          meta: { titleKey: 'pages.adminUsers' },
        },
        {
          path: 'search-index',
          name: 'admin-search-index',
          component: () => import('@/pages/AdminSearchIndexPage/AdminSearchIndexPage.vue'),
          meta: { titleKey: 'pages.adminSearchIndex' },
        },
      ],
    },
    {
      path: '/terms-and-conditions',
      name: 'terms-and-conditions',
      component: () => import('@/pages/TermsAndConditionsPage/TermsAndConditionsPage.vue'),
      meta: { titleKey: 'pages.termsAndConditions' },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/pages/NotFoundPage/NotFoundPage.vue'),
      meta: { titleKey: 'pages.notFound' },
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

router.afterEach((to) => {
  const titleKey = to.meta.titleKey
  document.title = titleKey ? `${i18n.global.t(titleKey)} | BN` : 'BN'
})

export default router
