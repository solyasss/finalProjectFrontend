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

export type DetailsSectionKey = 'DETAILS' | 'MEASUREMENTS' | 'MATERIALS_CARE' | 'SAFETY'

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
  variantAttributes?: ProductVariantAttributeGroup[] | null
  detailsSections: DetailsSection[]
  documents: ProductDocument[]
  fulfillment: FulfillmentOption[]
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

export interface CategoryTreeNode extends Category {}

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
  categories: CategoryTreeNode[]
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
  breadcrumbs?: ProductBreadcrumbItem[] | null
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

export interface ProductReview {
  reviewId: string
  rating: number
  title?: string | null
  body: string
  authorName: string
  createdAt: string
  verifiedPurchase?: boolean
}

export interface ProductReviewsSummaryResponse {
  productId: string
  summary: RatingSummary
  histogram: ReviewHistogramEntry[]
}

export interface ProductReviewListResponse {
  productId: string
  items: ProductReview[]
  pagination: Pagination
}

export interface CreateProductReviewRequest {
  rating: number
  title?: string
  body: string
}

export interface CreateProductReviewResponse {
  productId: string
  review: ProductReview
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

export type ProductFilters = Partial<Record<string, string>>

export interface GetCategoryProductsParams {
  page?: number
  limit?: number
  sort?: SortOption
  filters?: ProductFilters
}

export interface GetProductParams {
  variantId?: string
  zipCode?: string
}

export interface GetProductAvailabilityParams {
  variantId?: string
  zipCode?: string
}

export interface GetProductQuestionsParams {
  page?: number
  limit?: number
}

export interface GetProductReviewsParams {
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
