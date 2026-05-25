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
  rawCode?: string | null
  path?: string | null
  timestamp?: string | null
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
  dateOfBirth?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  user?: MeResponse | null
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
  id: string
  email: string
  firstName: string
  lastName: string
  dateOfBirth?: string | null
  role?: string | null
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
  id: number
  name: string
  slug: string
  description?: string | null
  price?: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
  baseImageUrl: string | null
  ratingAverage?: number | null
  ratingCount?: number | null
}

export interface ProductCardVariantPrice {
  price: string
}

export interface ProductListItem extends ProductCard {
  variants?: ProductCardVariantPrice[] | null
}

export interface ProductVariant {
  id: string
  sku: string
  color?: string | null
  price: string
  stock: number
  images: string[]
  weightKg: string
  widthCm: string
  heightCm: string
  depthCm: string
  attributes: Record<string, string | number | boolean | null>
  createdAt: string
  updatedAt: string
}

export type VariantAttributePresentation = 'swatch' | 'text'

export interface ProductVariantAttributeOption {
  value: string
  label: string
  hex?: string | null
  image?: string | null
}

export interface ProductVariantAttributeGroup {
  key: string
  label: string
  presentation: VariantAttributePresentation
  options: ProductVariantAttributeOption[]
}

export type DetailsSectionKey =
  | 'DETAILS'
  | 'MEASUREMENTS'
  | 'MATERIALS_CARE'
  | 'SAFETY'
  | 'ADDITIONAL_INFORMATION'

export interface DetailsSection {
  key: DetailsSectionKey
  title: string
  content: string
}

export type ProductDocumentType = 'ASSEMBLY' | 'MANUAL' | 'SAFETY'

export interface ProductDocument {
  type: ProductDocumentType
  label: string
  url: string
}

// TODO: Fulfillment/delivery options are not supported by the backend API yet.
// To enable once backend supports it.
// These types are retained for UI components that will be wired up when backend is ready.
export type FulfillmentType = 'DELIVERY' | 'CLICK_AND_COLLECT' | 'STORE_PICKUP'

export interface FulfillmentOption {
  type: FulfillmentType
  available: boolean
  etaText?: string | null
  cost?: Money | null
  message?: string | null
}

export interface ProductDetails {
  id: number
  name: string
  slug: string
  description: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
  baseImageUrl: string | null
  variants: ProductVariant[]
  ratingAverage?: number | null
  ratingCount?: number | null
  categories: Category[]
}

export interface ProductBreadcrumbItem {
  label: string
  slug?: string | null
}

// Catalog
export interface Category {
  id: number
  name: string
  slug: string
  description: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
  imageUrl?: string | null
  sortOrder: number
  children?: Category[] | null
}

export type CategoryTreeNode = Category

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

export interface ProductSetSummary {
  id: number
  name: string
  slug: string
  description?: string | null
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
  deletedAt?: string | null
  imageUrl?: string | null
  roomId?: number
  variantIds?: string[]
}

export interface RoomSummary {
  id: number
  name: string
  slug: string
  description?: string | null
  imageUrl?: string | null
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
  deletedAt?: string | null
  sets?: ProductSetSummary[]
}

export type SetSummary = ProductSetSummary
export type Room = RoomSummary

export interface RoomDetails extends RoomSummary {
  sets: ProductSetSummary[]
}

export interface ProductSetVariant {
  id: string
  sku: string
  color?: string | null
  price: string
  stock: number
  images: string[]
  createdAt: string
  updatedAt: string
}

export interface ProductSetDetails extends ProductSetSummary {
  room: RoomSummary
  variants: ProductSetVariant[]
}

export interface CatalogImage {
  id?: string | number
  url?: string | null
  imageUrl?: string | null
  src?: string | null
  variantId?: string | null
}

export interface CatalogImagesResponse {
  data?: CatalogImage[]
  images?: CatalogImage[]
  items?: CatalogImage[]
}

// Cart
export interface CartItemProduct {
  id: number
  name: string
  slug: string
  description?: string
  isActive: boolean
  baseImageUrl: string | null
}

export interface CartItemVariant {
  id: string
  sku: string
  color?: string
  price: string
  stock: number
  images: string[]
  product: CartItemProduct
}

export interface CartItem {
  id: number
  quantity: number
  variant: CartItemVariant
  variantId: string
  dynamicPrice: number
  basePrice: number
  discountAmount: number
  appliedPromotionId: number | null
  createdAt: string
  updatedAt: string
}

export interface Cart {
  id: number
  userId: number
  items: CartItem[]
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface AddCartLineRequest {
  variantId: string
  quantity: number
}

export interface UpdateCartLineRequest {
  quantity: number
}

// TODO: Fulfillment validation is not supported by the backend API yet.
// To enable once backend supports it.
// export interface ValidateFulfillmentLineRequest { ... }
// export interface ValidateFulfillmentRequest { ... }
// export interface ValidateFulfillmentIssue { ... }
// export interface ValidateFulfillmentResponse { ... }

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
  | 'PENDING'
  | 'PAID'
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
export type CategoriesResponse = CategoryTreeNode[]

export interface ProductListMeta {
  totalItems: number
  itemsPerPage: number
  currentPage: number
  totalPages: number
}

export interface ProductListResponse {
  data: ProductListItem[]
  meta: ProductListMeta
}

export interface RoomListMeta {
  totalItems: number
  itemsPerPage: number
  currentPage: number
  totalPages: number
}

export interface RoomListResponse {
  data: Room[]
  meta: RoomListMeta
}

export type RoomDetailsResponse = RoomDetails
export type ProductSetDetailsResponse = ProductSetDetails

// TODO: Product compare is not supported by the backend API yet.
// To enable once backend supports it.
// export interface ProductCompareResponse {
//   products: ProductDetails[]
//   compareAttributes: string[]
// }

// Backend returns the product object directly (not wrapped)
export type ProductDetailsResponse = ProductDetails

// TODO: Related products/accessories/breadcrumbs are not supported by the backend API yet.
// To enable once backend supports it.
// relatedProducts: ProductCard[]
// accessories: ProductCard[]
// breadcrumbs?: ProductBreadcrumbItem[] | null

// TODO: Product availability is not supported by the backend API yet.
// To enable once backend supports it.
// export interface ProductAvailabilityResponse {
//   productId: string
//   variantId?: string | null
//   options: FulfillmentOption[]
// }

// TODO: Review histogram is not supported by the backend API yet.
// To enable once backend supports it.
// Retained for ReviewSection UI component that will be wired up when backend is ready.
export interface ReviewHistogramEntry {
  stars: number
  count: number
}

export interface ProductReview {
  id: number
  rating: number
  text: string
  status: string
  userId: number
  productId: number
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  // legacy optional fields kept for UI compat
  title?: string | null
  authorName?: string
  verifiedPurchase?: boolean
}

// TODO: Product reviews summary/histogram is not supported by the backend API yet.
// To enable once backend supports it.
// export interface ProductReviewsSummaryResponse {
//   productId: string
//   summary: RatingSummary
//   histogram: ReviewHistogramEntry[]
// }

export interface ProductReviewListMeta {
  totalItems: number
  itemsPerPage: string | number
  currentPage: string | number
  totalPages: number
}

export interface ProductReviewListResponse {
  data: ProductReview[]
  meta: ProductReviewListMeta
}

// CreateReviewDto shape per OpenAPI: { rating, text, productId }
export interface CreateProductReviewRequest {
  rating: number
  text: string
  productId: number
}

export interface CreateProductReviewResponse {
  productId: string
  review: ProductReview
}

// TODO: Product Q&A is not supported by the backend API yet.
// To enable once backend supports it.
// export interface ProductQuestionsResponse { ... }

export interface SearchVariantItem {
  _type: string
  id: string // UUID of the variant
  productId: number
  name: string
  slug: string
  description: string | null
  baseImageUrl: string | null
  categoryIds: number[]
  ratingAverage: number | null
  sku: string
  price: number
  color: string | null
  inStock: boolean
  attributes: Record<string, string | number | boolean | null>
}

export interface SearchFilterOption {
  value: string
  label: string
  count: number
}

export interface SearchFilterDefinition {
  key: string
  label: string
  type: FilterType
  options?: SearchFilterOption[]
  range?: { min: number; max: number }
}

export interface SearchApiResponse {
  query: string
  totalFound: number
  filters: SearchFilterDefinition[]
  items: SearchVariantItem[]
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

export interface CartLine {
  id: number
  name: string
  image: ImageAsset | null
  quantity: number
  unitPrice: Money
  lineTotal: Money
}

export interface OrderDetailsResponse {
  order: OrderSummary
  lines: CartLine[]
  shippingAddress?: string | null
}

export interface OrderTrackingResponse {
  orderId: string
  status: string
  steps: OrderTrackingStep[]
}

export interface CardDetails {
  cardholderName: string
  cardNumber: string
  expiryMonth: string
  expiryYear: string
  cvv: string
}

export interface CheckoutRequest {
  shippingAddress: string
  card: CardDetails
}

export interface StoreDetailsResponse {
  name: string
  address: string
  hours: StoreHours[]
  services: string[]
}

// Query param types
export type SortOption = 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'newest'

export type ProductFilters = Partial<Record<string, string>>

export interface GetCategoryProductsParams {
  page?: number
  limit?: number
  sort?: SortOption
  filters?: ProductFilters
}

export interface GetCatalogImagesParams {
  page?: number
  limit?: number
  variantId?: string
}

// TODO: GetProductParams (variantId/cityId) not needed without availability support.
// Keep for potential future use.
// export interface GetProductParams { variantId?: string; cityId?: string }

// TODO: Product availability params — not supported by backend API yet.
// export interface GetProductAvailabilityParams { variantId?: string; cityId?: string }

// TODO: Product Q&A params — not supported by backend API yet.
// export interface GetProductQuestionsParams { page?: number; limit?: number }

export interface GetProductReviewsParams {
  page?: number
  limit?: number
}

// TODO: Product compare is not supported by the backend API yet.
// export interface CompareProductsParams { productIds: string[] }

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
