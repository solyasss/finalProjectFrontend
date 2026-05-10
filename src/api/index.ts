export { setAuthToken, setUnauthorizedHandler, setRefreshHandler } from './client'

export { register, login, verifyEmail, resendVerification, refreshToken, logout } from './auth'

export {
  getCategories,
  getCatalogImages,
  getCategoryProducts,
  getRooms,
  getRoom,
  getProductSet,
} from './catalog'
// TODO: compareProducts is not supported by the backend API yet.

export {
  getProduct,
  createProductReview,
  getProductReviews,
  // TODO: getProductAvailability — not supported by backend API yet.
  // TODO: getProductReviewsSummary — not supported by backend API yet.
  // TODO: getProductQuestions — not supported by backend API yet.
} from './products'

export { search, searchSuggest } from './search'

export { getCart, addCartLine, updateCartLine, removeCartLine } from './cart'

export { getWishlist, addWishlistItem, removeWishlistItem } from './wishlist'

export { getMe, updateProfile, changePassword, deleteAccount, updateLocation } from './account'

export { getOrders, getOrder } from './orders'
export { checkoutOrder } from './checkout'

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
  VariantAttributePresentation,
  ProductVariantAttributeOption,
  ProductVariantAttributeGroup,
  DetailsSectionKey,
  DetailsSection,
  ProductDocumentType,
  ProductDocument,
  // TODO: FulfillmentType, FulfillmentOption — backend not yet supporting fulfillment. UI components retain these types.
  FulfillmentType,
  FulfillmentOption,
  ProductDetails,
  ProductBreadcrumbItem,
  // Catalog
  Category,
  CategoryTreeNode,
  FilterOption,
  FilterRange,
  FilterType,
  FilterDefinition,
  Room,
  RoomSummary,
  RoomDetails,
  SetSummary,
  ProductSetSummary,
  ProductSetVariant,
  CatalogImage,
  CatalogImagesResponse,
  ProductSetDetails,
  // Cart
  CartItem,
  CartItemVariant,
  CartItemProduct,
  Cart,
  AddCartLineRequest,
  UpdateCartLineRequest,
  // Wishlist
  WishlistItem,
  AddWishlistItemRequest,
  // Orders
  OrderStatus,
  OrderSummary,
  CartLine,
  OrderTrackingStep,
  // Checkout
  CardDetails,
  CheckoutRequest,
  // Store
  StoreHours,
  // TODO: QuestionItem — not supported by backend API yet.
  // Response shapes
  CategoriesResponse,
  ProductListResponse,
  RoomListResponse,
  // TODO: ProductCompareResponse — not supported by backend API yet.
  ProductDetailsResponse,
  RoomDetailsResponse,
  ProductSetDetailsResponse,
  // TODO: ProductAvailabilityResponse — not supported by backend API yet.
  ProductReview,
  ProductReviewListResponse,
  // TODO: ReviewHistogramEntry — backend not yet supporting review histogram. UI component retains this type.
  ReviewHistogramEntry,
  CreateProductReviewRequest,
  CreateProductReviewResponse,
  // TODO: ProductReviewsSummaryResponse — not supported by backend API yet.
  // TODO: ProductQuestionsResponse — not supported by backend API yet.
  SearchResponse,
  SearchSuggestResponse,
  WishlistResponse,
  OrdersResponse,
  OrderDetailsResponse,
  StoreDetailsResponse,
  // Query param types
  SortOption,
  ProductFilters,
  GetCategoryProductsParams,
  GetCatalogImagesParams,
  GetProductReviewsParams,
  // TODO: GetProductParams, GetProductAvailabilityParams, GetProductQuestionsParams, CompareProductsParams — not supported yet.
  SearchParams,
  SearchSuggestParams,
  GetWishlistParams,
} from './types'
