import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

export type AdminNavAvailability = 'available' | 'deferred'

export type AdminRouteName =
  | 'admin-dashboard'
  | 'admin-products'
  | 'admin-categories'
  | 'admin-images'
  | 'admin-rooms'
  | 'admin-product-sets'
  | 'admin-promotions'
  | 'admin-orders'
  | 'admin-carts'
  | 'admin-reviews'
  | 'admin-users'
  | 'admin-search-index'

export type AdminNavItemId =
  | 'dashboard'
  | 'products'
  | 'categories'
  | 'images'
  | 'rooms'
  | 'productSets'
  | 'promotions'
  | 'orders'
  | 'carts'
  | 'reviews'
  | 'users'
  | 'searchIndex'

export interface AdminNavItem {
  id: AdminNavItemId
  label: string
  description: string
  routeName: AdminRouteName
  availability: AdminNavAvailability
}

export function useAdminNavigation() {
  const { t } = useI18n()

  const items = computed<AdminNavItem[]>(() => [
    {
      id: 'dashboard',
      label: t('admin.nav.dashboard'),
      description: t('admin.dashboard.description'),
      routeName: 'admin-dashboard',
      availability: 'available',
    },
    {
      id: 'products',
      label: t('admin.nav.products'),
      description: t('admin.products.description'),
      routeName: 'admin-products',
      availability: 'available',
    },
    {
      id: 'categories',
      label: t('admin.nav.categories'),
      description: t('admin.categories.description'),
      routeName: 'admin-categories',
      availability: 'available',
    },
    {
      id: 'images',
      label: t('admin.nav.images'),
      description: t('admin.images.description'),
      routeName: 'admin-images',
      availability: 'available',
    },
    {
      id: 'rooms',
      label: t('admin.nav.rooms'),
      description: t('admin.deferred.roomsDescription'),
      routeName: 'admin-rooms',
      availability: 'available',
    },
    {
      id: 'productSets',
      label: t('admin.nav.productSets'),
      description: t('admin.deferred.productSetsDescription'),
      routeName: 'admin-product-sets',
      availability: 'available',
    },
    {
      id: 'promotions',
      label: t('admin.nav.promotions'),
      description: t('admin.deferred.promotionsDescription'),
      routeName: 'admin-promotions',
      availability: 'available',
    },
    {
      id: 'orders',
      label: t('admin.nav.orders'),
      description: t('admin.deferred.ordersDescription'),
      routeName: 'admin-orders',
      availability: 'available',
    },
    {
      id: 'carts',
      label: t('admin.nav.carts'),
      description: t('admin.deferred.cartsDescription'),
      routeName: 'admin-carts',
      availability: 'available',
    },
    {
      id: 'reviews',
      label: t('admin.nav.reviews'),
      description: t('admin.deferred.reviewsDescription'),
      routeName: 'admin-reviews',
      availability: 'available',
    },
    {
      id: 'users',
      label: t('admin.nav.users'),
      description: t('admin.deferred.usersDescription'),
      routeName: 'admin-users',
      availability: 'available',
    },
    {
      id: 'searchIndex',
      label: t('admin.nav.searchIndex'),
      description: t('admin.deferred.searchIndexDescription'),
      routeName: 'admin-search-index',
      availability: 'available',
    },
  ])

  return {
    items,
  }
}
