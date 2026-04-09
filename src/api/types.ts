export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'CONFLICT'
  | 'RATE_LIMITED'
  | 'INTERNAL_ERROR'

export interface ApiError {
  code: ErrorCode
  message: string
  fields?: Record<string, string> | null
}

export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: ApiError }

export interface Money {
  amountMinor: number
  currency: 'UAH'
  formatted: string
}

export interface ImageAsset {
  url: string
  alt: string
  width: number
  height: number
}

export type Badge = 'NEW' | 'BEST_SELLER' | 'LAST_CHANCE' | 'MEMBER_PRICE'

export interface RatingSummary {
  average: number
  count: number
}

export interface Pagination {
  total: number
  page: number
  limit: number
}

// Auth
export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  dateOfBirth: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: MeResponse
}

export interface VerifyEmailRequest {
  token: string
}

export interface ResendVerificationRequest {
  email: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export interface MessageResponse {
  message: string
}

// Account
export interface UserAddress {
  street: string
  city: string
  postalCode: string
  region?: string | null
}

export interface UpdateProfileRequest {
  firstName?: string
  lastName?: string
  dateOfBirth?: string
  address?: UserAddress | null
}

export interface MeResponse {
  userId: string
  email: string
  firstName: string
  lastName: string
  dateOfBirth: string
  address?: UserAddress | null
}

// Product
export interface VariantSwatch {
  variantId: string
  hex?: string | null
  image?: string | null
}

export interface VariantPreview {
  totalVariants: number
  swatches: VariantSwatch[]
}

export interface ProductCard {
  productId: string
  slug: string
  name: string
  shortDescription?: string | null
  heroImage: ImageAsset
  price: Money
  previousPrice?: Money | null
  badges: Badge[]
  rating?: RatingSummary | null
  variantPreview?: VariantPreview | null
}

export interface ProductVariant {
  variantId: string
  sku: string
  name: string
  attributes: Record<string, string>
  images: ImageAsset[]
  price: Money
  previousPrice?: Money | null
}

export type DetailsSectionKey = 'DETAILS' | 'MEASUREMENTS' | 'MATERIALS_CARE' | 'SAFETY'

export interface DetailsSection {
  key: DetailsSectionKey
  title: string
  markdown: string
}

export type ProductDocumentType = 'ASSEMBLY' | 'MANUAL' | 'SAFETY'

export interface ProductDocument {
  type: ProductDocumentType
  label: string
  url: string
}

export type FulfillmentType = 'DELIVERY' | 'CLICK_AND_COLLECT' | 'STORE_PICKUP'

export interface FulfillmentOption {
  type: FulfillmentType
  available: boolean
  etaText?: string | null
  cost?: Money | null
  message?: string | null
}

export interface ProductDetails {
  productId: string
  slug: string
  name: string
  description: string
  series?: string | null
  badges: Badge[]
  rating?: RatingSummary | null
  variants: ProductVariant[]
  selectedVariantId: string
  detailsSections: DetailsSection[]
  documents: ProductDocument[]
  fulfillment: FulfillmentOption[]
}

// Catalog
export interface Category {
  categoryId: string
  slug: string
  name: string
  parentId?: string | null
}

export interface FilterOption {
  value: string
  label: string
  count: number
}

export interface FilterRange {
  min: number
  max: number
  step: number
}

export type FilterType = 'MULTI_SELECT' | 'RANGE' | 'BOOLEAN'

export interface FilterDefinition {
  key: string
  label: string
  type: FilterType
  options?: FilterOption[] | null
  range?: FilterRange | null
}

// Cart
export interface CartLine {
  lineId: string
  productId: string
  variantId: string
  name: string
  image: ImageAsset
  unitPrice: Money
  quantity: number
  maxQuantity: number
  lineTotal: Money
}

export interface Cart {
  cartId: string
  lines: CartLine[]
  subtotal: Money
  discountTotal: Money
  grandTotal: Money
  itemCount: number
}

export interface AddCartLineRequest {
  productId: string
  variantId: string
  quantity: number
}

export interface UpdateCartLineRequest {
  quantity: number
}

export interface ValidateFulfillmentLineRequest {
  lineId: string
  mode: FulfillmentType
}

export interface ValidateFulfillmentRequest {
  lines: ValidateFulfillmentLineRequest[]
}

export interface ValidateFulfillmentIssue {
  lineId: string
  code: string
  message: string
}

export interface ValidateFulfillmentResponse {
  valid: boolean
  issues: ValidateFulfillmentIssue[]
}

// Wishlist
export interface WishlistItem {
  wishlistItemId: string
  productId: string
  variantId?: string | null
  name: string
  image: ImageAsset
  price: Money
  inStock: boolean
}

export interface AddWishlistItemRequest {
  productId: string
  variantId?: string
}

// Orders
export type OrderStatus =
  | 'PLACED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'READY_FOR_PICKUP'
  | 'DELIVERED'
  | 'CANCELLED'

export interface OrderSummary {
  orderId: string
  createdAt: string
  status: OrderStatus
  total: Money
  itemCount: number
}

export interface OrderTrackingStep {
  key: string
  title: string
  completed: boolean
  timestamp?: string | null
}

// Store
export interface StoreHours {
  day: string
  open: string
  close: string
}

export interface QuestionItem {
  questionId: string
  question: string
  answer?: string | null
  createdAt: string
}

// Responses
export interface CategoriesResponse {
  categories: Category[]
}

export interface ProductListResponse {
  category: Category
  breadcrumbs: Category[]
  filters: FilterDefinition[]
  products: ProductCard[]
  pagination: Pagination
}

export interface ProductCompareResponse {
  products: ProductDetails[]
  compareAttributes: string[]
}

export interface ProductDetailsResponse {
  product: ProductDetails
  relatedProducts: ProductCard[]
  accessories: ProductCard[]
}

export interface ProductAvailabilityResponse {
  productId: string
  variantId?: string | null
  options: FulfillmentOption[]
}

export interface ReviewHistogramEntry {
  stars: number
  count: number
}

export interface ProductReviewsSummaryResponse {
  productId: string
  summary: RatingSummary
  histogram: ReviewHistogramEntry[]
}

export interface ProductQuestionsResponse {
  items: QuestionItem[]
  pagination: Pagination
}

export interface SearchResponse {
  query: string
  filters: FilterDefinition[]
  products: ProductCard[]
  pagination: Pagination
}

export interface SearchSuggestResponse {
  query: string
  suggestions: string[]
  categories: Category[]
  products: ProductCard[]
}

export interface WishlistResponse {
  items: WishlistItem[]
  pagination: Pagination
}

export interface OrdersResponse {
  orders: OrderSummary[]
  pagination: Pagination
}

export interface OrderDetailsResponse {
  order: OrderSummary
  lines: CartLine[]
  shippingAddress?: Record<string, string> | null
}

export interface OrderTrackingResponse {
  orderId: string
  status: string
  steps: OrderTrackingStep[]
}

export interface StoreDetailsResponse {
  name: string
  address: string
  hours: StoreHours[]
  services: string[]
}

// Query param types
export type SortOption = 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'newest'

export interface ProductFilters {
  color?: string
  price?: string
  availability?: 'in_stock'
}

export interface GetCategoryProductsParams {
  page?: number
  limit?: number
  sort?: SortOption
  filters?: ProductFilters
}

export interface GetProductParams {
  variantId?: string
}

export interface GetProductAvailabilityParams {
  variantId?: string
}

export interface GetProductQuestionsParams {
  page?: number
  limit?: number
}

export interface CompareProductsParams {
  productIds: string[]
}

export interface SearchParams {
  q: string
  page?: number
  limit?: number
  sort?: SortOption
  filters?: ProductFilters
}

export interface SearchSuggestParams {
  q: string
  limit?: number
}

export interface GetWishlistParams {
  page?: number
  limit?: number
}

export interface GetOrdersParams {
  page?: number
  limit?: number
}
