import type { Category, Pagination, ProductDetails, ProductListItem, ProductVariant } from './types'

export interface AdminListMeta {
  totalItems: number
  itemsPerPage: number
  currentPage: number
  totalPages: number
}

export interface AdminPaginatedResponse<T> {
  data: T[]
  meta: AdminListMeta
}

export interface AdminListParams {
  page?: number
  limit?: number
  filter?: string
}

export interface AdminCategory extends Category {
  parentId?: number | null
}

export type AdminProduct = ProductDetails

export interface AdminProductVariantPayload {
  sku: string
  color?: string
  price: number
  stock: number
  images?: string[]
  weightKg?: number
  widthCm?: number
  heightCm?: number
  depthCm?: number
  attributes?: Record<string, string | number | boolean | null>
}

export interface AdminProductPayload {
  name?: string
  slug?: string
  description?: string
  baseImageUrl?: string
  categoryIds?: number[]
  variants?: AdminProductVariantPayload[]
}

export interface AdminCategoryPayload {
  name?: string
  slug?: string
  description?: string
  imageUrl?: string
  sortOrder?: number
  parentId?: number | null
}

export interface AdminImage {
  id: number
  url: string | null
  variantId: string | null
  sortOrder?: number | null
  isPrimary?: boolean | null
  createdAt?: string | null
  updatedAt?: string | null
  deletedAt?: string | null
}

export interface AdminImagePayload {
  file?: File | null
  url?: string
  variantId?: string
  sortOrder?: number
  isPrimary?: boolean
}

export interface AdminRouteSummaryCard {
  id: string
  routeName: string
  description: string
}

export interface AdminEntityDeleteResult {
  message?: string
}

export interface AdminEntityListState<T> {
  items: T[]
  pagination: Pagination
}

export type AdminProductListItem = ProductListItem & {
  categories?: Category[]
}

export type AdminProductVariant = ProductVariant

// --- Rooms ---
export interface AdminRoom {
  id: number
  name: string
  slug: string
  description?: string | null
  imageUrl?: string | null
  sortOrder?: number | null
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
  deletedAt?: string | null
  sets?: unknown[]
}

export interface AdminRoomPayload {
  name?: string
  slug?: string
  description?: string
  imageUrl?: string
  sortOrder?: number
}

// --- Product Sets ---
export interface AdminProductSet {
  id: number
  name: string
  slug: string
  imageUrl?: string | null
  roomId?: number | null
  variantIds?: string[]
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
  deletedAt?: string | null
}

export interface AdminProductSetPayload {
  name?: string
  slug?: string
  file?: File | null
  imageUrl?: string
  roomId?: number
  variantIds?: string[]
}

// --- Promotions ---
export type PromotionDiscountType = 'PERCENTAGE' | 'FIXED_AMOUNT'
export type PromotionTargetType = 'GLOBAL' | 'CATEGORY' | 'VARIANT'

export interface AdminPromotion {
  id: number
  name: string
  slug: string
  description?: string | null
  discountType: PromotionDiscountType
  discountValue: number
  targetType: PromotionTargetType
  targetIds?: (string | number)[]
  startDate: string
  endDate: string
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
  deletedAt?: string | null
}

export interface AdminPromotionPayload {
  name?: string
  slug?: string
  description?: string
  discountType?: PromotionDiscountType
  discountValue?: number
  targetType?: PromotionTargetType
  targetIds?: string[]
  startDate?: string
  endDate?: string
  isActive?: boolean
}

// --- Orders ---
export type AdminOrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'

export interface AdminOrder {
  id: number
  userId: number
  status: AdminOrderStatus
  totalAmount: number | string
  shippingAddress?: string | null
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
  items?: unknown[]
}

export interface AdminOrderListParams extends AdminListParams {
  userId?: number
  status?: AdminOrderStatus
}

// --- Carts ---
export interface AdminCart {
  id: number
  userId: number
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
  items?: unknown[]
}

export interface AdminCartListParams extends AdminListParams {
  userId?: number
}

// --- Reviews ---
export type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface AdminReview {
  id: number
  rating: number
  text: string
  status: ReviewStatus
  userId: number
  productId: number
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
}

export interface AdminReviewPayload {
  rating?: number
  text?: string
  productId?: number
  status?: ReviewStatus
}

export interface AdminReviewListParams extends AdminListParams {
  productId?: number
}

// --- Users ---
export type UserRole = 'USER' | 'MANAGER' | 'ADMIN'

export interface AdminUser {
  id: number
  email: string
  firstName?: string
  lastName?: string
  role?: string
  createdAt?: string
  updatedAt?: string
  deletedAt?: string | null
}

export interface AdminUserCreatePayload {
  email: string
  password: string
  firstName: string
  lastName: string
  role?: UserRole
}

export interface AdminUserUpdatePayload {
  email?: string
  firstName?: string
  lastName?: string
  role?: UserRole
}
