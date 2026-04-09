export { setAuthToken, setUnauthorizedHandler, setRefreshHandler } from './client'

export { register, login, verifyEmail, resendVerification, refreshToken } from './auth'

export { getCategories, getCategoryProducts, compareProducts } from './catalog'

export {
  getProduct,
  getProductAvailability,
  getProductReviewsSummary,
  getProductQuestions,
} from './products'

export { search, searchSuggest } from './search'

export {
  getCart,
  addCartLine,
  updateCartLine,
  removeCartLine,
  validateCartFulfillment,
} from './cart'

export { getWishlist, addWishlistItem, removeWishlistItem } from './wishlist'

export {
  getMe,
  updateProfile,
  changePassword,
  deleteAccount,
  updateLocation,
  getOrders,
  getOrder,
  getOrderTracking,
} from './account'

export { getStore } from './store'

export type {
  // Core
  ApiResult,
  ApiError,
  ErrorCode,
  // Primitives
  Money,
  ImageAsset,
  Badge,
  RatingSummary,
  Pagination,
  // Auth
  RegisterRequest,
  LoginRequest,
  LoginResponse,
  VerifyEmailRequest,
  ResendVerificationRequest,
  ChangePasswordRequest,
  MessageResponse,
  // Account
  UserAddress,
  UpdateProfileRequest,
  MeResponse,
  // Product
  VariantSwatch,
  VariantPreview,
  ProductCard,
  ProductVariant,
  DetailsSectionKey,
  DetailsSection,
  ProductDocumentType,
  ProductDocument,
  FulfillmentType,
  FulfillmentOption,
  ProductDetails,
  // Catalog
  Category,
  FilterOption,
  FilterRange,
  FilterType,
  FilterDefinition,
  // Cart
  CartLine,
  Cart,
  AddCartLineRequest,
  UpdateCartLineRequest,
  ValidateFulfillmentLineRequest,
  ValidateFulfillmentRequest,
  ValidateFulfillmentIssue,
  ValidateFulfillmentResponse,
  // Wishlist
  WishlistItem,
  AddWishlistItemRequest,
  // Orders
  OrderStatus,
  OrderSummary,
  OrderTrackingStep,
  // Store
  StoreHours,
  QuestionItem,
  // Response shapes
  CategoriesResponse,
  ProductListResponse,
  ProductCompareResponse,
  ProductDetailsResponse,
  ProductAvailabilityResponse,
  ReviewHistogramEntry,
  ProductReviewsSummaryResponse,
  ProductQuestionsResponse,
  SearchResponse,
  SearchSuggestResponse,
  WishlistResponse,
  OrdersResponse,
  OrderDetailsResponse,
  OrderTrackingResponse,
  StoreDetailsResponse,
  // Query param types
  SortOption,
  ProductFilters,
  GetCategoryProductsParams,
  GetProductParams,
  GetProductAvailabilityParams,
  GetProductQuestionsParams,
  CompareProductsParams,
  SearchParams,
  SearchSuggestParams,
  GetWishlistParams,
  GetOrdersParams,
} from './types'
