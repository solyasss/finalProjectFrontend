import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import {
  createProductReview,
  getCatalogImages,
  getCategoryProducts,
  getProduct,
  getProductReviews,
  type CatalogImagesResponse,
  type Pagination,
  type ProductCard,
  type ProductDetails,
  type ProductReview,
  type ProductVariant,
} from '@/api'
import { useAuthStore, useCartStore } from '@/stores'
import { extractImageEntries, extractImageUrl } from '@/utils/image'

export type VariantAttributePresentation = 'swatch' | 'text'

export interface SelectorOption {
  value: string
  label: string
  hex?: string | null
  image?: string | null
  selected: boolean
  disabled: boolean
}

export interface SelectorGroup {
  key: string
  label: string
  presentation: VariantAttributePresentation
  selectedValue?: string
  options: SelectorOption[]
}

export interface CtaMessage {
  severity: 'success' | 'error' | 'secondary'
  text: string
}

const DEFAULT_MIN_QUANTITY = 1
const DEFAULT_MAX_QUANTITY = 99
const DEFAULT_REVIEWS_LIMIT = 4
const VARIANT_GALLERY_PAGE = 1
const VARIANT_GALLERY_LIMIT = 10

export function clampQuantity(
  next: number,
  min = DEFAULT_MIN_QUANTITY,
  max = DEFAULT_MAX_QUANTITY,
) {
  if (!Number.isFinite(next)) {
    return min
  }

  return Math.min(Math.max(Math.trunc(next), min), max)
}

function mapCatalogImagesToUrls(response: CatalogImagesResponse | unknown): string[] {
  const urls = extractImageEntries(response)
    .map(extractImageUrl)
    .filter((url): url is string => Boolean(url))

  return [...new Set(urls)]
}

function matchesSelections(
  variant: ProductVariant,
  selections: Record<string, string>,
  ignoredKey?: string,
) {
  return Object.entries(selections).every(([key, value]) => {
    if (!value || key === ignoredKey) return true
    if (key === 'color') return (variant.color ?? undefined) === value
    return false
  })
}

export function resolveInitialVariant(product: ProductDetails, preferredVariantId?: string | null) {
  const variantFromQuery = preferredVariantId
    ? product.variants.find((variant) => variant.id === preferredVariantId)
    : null

  if (variantFromQuery) {
    return variantFromQuery
  }

  return product.variants[0] ?? null
}

export function resolveVariantForSelections(
  product: ProductDetails,
  selections: Record<string, string>,
  changedGroupKey?: string,
) {
  const exactMatch = product.variants.find((variant) => matchesSelections(variant, selections))

  if (exactMatch) {
    return exactMatch
  }

  if (!changedGroupKey) {
    return null
  }

  const changedValue = selections[changedGroupKey]
  const rankedCandidates = product.variants
    .filter((variant) => (variant.color ?? undefined) === changedValue)
    .sort((left, right) => {
      const leftScore = Object.entries(selections).filter(
        ([key, value]) => key === 'color' && (left.color ?? undefined) === value,
      ).length
      const rightScore = Object.entries(selections).filter(
        ([key, value]) => key === 'color' && (right.color ?? undefined) === value,
      ).length

      return rightScore - leftScore
    })

  return rankedCandidates[0] ?? null
}

export function buildSelectorGroups(
  product: ProductDetails,
  selectedVariantId?: string | null,
): SelectorGroup[] {
  const selectedVariant =
    product.variants.find((variant) => variant.id === selectedVariantId) ??
    product.variants[0] ??
    null

  if (!selectedVariant) {
    return []
  }

  // Derive color selector from variants (only attribute returned by backend currently)
  const uniqueColors = [
    ...new Set(product.variants.filter((v) => v.color).map((v) => v.color as string)),
  ]

  if (!uniqueColors.length) {
    return []
  }

  const selections: Record<string, string> = selectedVariant.color
    ? { color: selectedVariant.color }
    : {}

  return [
    {
      key: 'color',
      label: 'Color',
      presentation: 'swatch' as const,
      selectedValue: selectedVariant.color ?? undefined,
      options: uniqueColors.map((color) => ({
        value: color,
        label: color.charAt(0) + color.slice(1).toLowerCase(),
        hex: null,
        image: null,
        selected: selectedVariant.color === color,
        disabled: !product.variants.some(
          (variant) => variant.color === color && matchesSelections(variant, selections, 'color'),
        ),
      })),
    },
  ]
}

export function useProductDetailPage() {
  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()
  const authStore = useAuthStore()
  const cartStore = useCartStore()

  const loading = ref(false)
  const addingToCart = ref(false)
  const error = ref<string | null>(null)
  const product = ref<ProductDetails | null>(null)
  const relatedProducts = ref<ProductCard[]>([])
  const reviews = ref<ProductReview[]>([])
  const reviewsPagination = ref<Pagination | null>(null)
  const quantity = ref(DEFAULT_MIN_QUANTITY)
  const selectedVariantId = ref('')
  const ctaMessage = ref<CtaMessage | null>(null)
  const loadingReviews = ref(false)
  const reviewsError = ref<string | null>(null)
  const submittingReview = ref(false)
  const submitReviewError = ref<string | null>(null)
  const submitReviewSuccess = ref(false)
  const remoteGalleryImages = ref<string[]>([])
  const galleryRequestId = ref(0)

  // TODO: availability state not supported by backend API yet.
  // const loadingAvailability = ref(false)
  // const availabilityError = ref<string | null>(null)
  // const availability = ref<FulfillmentOption[]>([])

  // TODO: related products/accessories not supported by backend API yet.
  // const relatedProducts = ref<ProductCard[]>([])
  // const accessories = ref<ProductCard[]>([])

  // TODO: breadcrumbs not supported by backend API yet.
  // const breadcrumbs = ref<ProductBreadcrumbItem[]>([])

  // TODO: review summary/histogram not supported by backend API yet.
  // const reviewsSummary = ref<RatingSummary | null>(null)
  // const reviewHistogram = ref<ReviewHistogramEntry[]>([])

  const routeVariantSync = ref<string | null>(null)

  const productId = computed(() => {
    const raw = route.params.productId
    const id = typeof raw === 'string' ? parseInt(raw, 10) : NaN
    return Number.isFinite(id) ? id : null
  })

  const queryVariantId = computed(() => {
    const variant = route.query.variant
    return typeof variant === 'string' ? variant : ''
  })

  const selectedVariant = computed(() => {
    return product.value?.variants.find((variant) => variant.id === selectedVariantId.value) ?? null
  })

  const selectorGroups = computed(() => {
    if (!product.value) {
      return []
    }

    return buildSelectorGroups(product.value, selectedVariantId.value)
  })

  const galleryImages = computed(() => {
    return remoteGalleryImages.value
  })

  const canAddToCart = computed(() => {
    return Boolean(product.value && selectedVariant.value && !addingToCart.value)
  })

  const isAuthenticated = computed(() => authStore.isAuthenticated)

  const canLoadMoreReviews = computed(() => {
    if (!reviewsPagination.value) {
      return false
    }

    const { page, limit, total } = reviewsPagination.value
    return page * limit < total
  })

  function resetReviewState() {
    reviews.value = []
    reviewsPagination.value = null
    reviewsError.value = null
    submitReviewError.value = null
    submitReviewSuccess.value = false
  }

  function resetGalleryState() {
    galleryRequestId.value += 1
    remoteGalleryImages.value = []
    selectedVariantId.value = ''
  }

  async function redirectToLogin() {
    const redirect = route.fullPath
    const safeRedirect = redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : '/'

    await router.push({
      name: 'login',
      query: { redirect: safeRedirect },
    })
  }

  async function syncVariantQuery(variantId: string) {
    if (queryVariantId.value === variantId) {
      return
    }

    routeVariantSync.value = variantId
    await router.replace({
      query: {
        ...route.query,
        variant: variantId,
      },
    })
  }

  // TODO: loadAvailability not supported by backend API yet.
  // TODO: loadReviewsSummary not supported by backend API yet.

  async function loadReviews(pid: number, page = 1) {
    loadingReviews.value = true

    if (page === 1) {
      reviewsError.value = null
    }

    const result = await getProductReviews(pid, { page, limit: DEFAULT_REVIEWS_LIMIT })

    loadingReviews.value = false

    if (!result.ok) {
      reviewsError.value = result.error.message || t('pdp.reviewsError')

      if (page === 1) {
        reviews.value = []
        reviewsPagination.value = null
      }

      return false
    }

    reviews.value = page === 1 ? result.data.data : [...reviews.value, ...result.data.data]
    reviewsPagination.value = {
      page: Number(result.data.meta.currentPage),
      limit: Number(result.data.meta.itemsPerPage),
      total: result.data.meta.totalItems,
    }
    return true
  }

  async function loadVariantGalleryImages(variant: ProductVariant | null) {
    const requestId = galleryRequestId.value + 1
    galleryRequestId.value = requestId
    remoteGalleryImages.value = []

    if (!variant?.id) {
      return
    }

    const result = await getCatalogImages({
      page: VARIANT_GALLERY_PAGE,
      limit: VARIANT_GALLERY_LIMIT,
      variantId: variant.id,
    })

    if (galleryRequestId.value !== requestId || selectedVariantId.value !== variant.id) {
      return
    }

    if (!result.ok) {
      return
    }

    remoteGalleryImages.value = mapCatalogImagesToUrls(result.data)
  }

  async function loadMoreReviews() {
    if (!product.value || !reviewsPagination.value || !canLoadMoreReviews.value) {
      return false
    }

    return loadReviews(product.value.id, reviewsPagination.value.page + 1)
  }

  async function submitReview(payload: { rating: number; text: string }) {
    if (!product.value || submittingReview.value) {
      return false
    }

    submitReviewError.value = null
    submitReviewSuccess.value = false

    if (!authStore.isAuthenticated) {
      await redirectToLogin()
      return false
    }

    submittingReview.value = true
    const result = await createProductReview({ ...payload, productId: product.value.id })
    submittingReview.value = false

    if (!result.ok) {
      submitReviewError.value = result.error.message || t('pdp.reviewForm.genericError')

      if (result.error.code === 'UNAUTHORIZED') {
        await redirectToLogin()
      }

      return false
    }

    submitReviewSuccess.value = true
    await loadReviews(product.value.id, 1)
    return true
  }

  async function requestReviewAuth() {
    await redirectToLogin()
  }

  async function applySelectedVariant(nextVariant: ProductVariant, syncRoute = true) {
    // TODO: loadAvailability call removed — not supported by backend yet.
    selectedVariantId.value = nextVariant.id
    ctaMessage.value = null
    quantity.value = clampQuantity(quantity.value)
    void loadVariantGalleryImages(nextVariant)

    if (syncRoute) {
      await syncVariantQuery(nextVariant.id)
    }
  }

  async function reload() {
    if (!productId.value) {
      resetGalleryState()
      product.value = null
      resetReviewState()
      return
    }

    resetGalleryState()
    loading.value = true
    error.value = null
    ctaMessage.value = null
    quantity.value = DEFAULT_MIN_QUANTITY
    resetReviewState()

    const result = await getProduct(productId.value)

    loading.value = false

    if (!result.ok) {
      error.value = result.error.message || t('pdp.error')
      product.value = null
      resetReviewState()
      return
    }

    // Backend returns product directly (not wrapped in { product: ... })
    product.value = result.data

    // Load related products from the same category (best-effort, non-blocking)
    const firstCategoryId = result.data.categories[0]?.id
    if (firstCategoryId) {
      getCategoryProducts(firstCategoryId, { limit: 15 }).then((relResult) => {
        if (relResult.ok) {
          relatedProducts.value = relResult.data.data.filter((p) => p.id !== result.data.id)
        }
      })
    }

    // TODO: relatedProducts, accessories, breadcrumbs not supported by backend API yet.

    await loadReviews(result.data.id, 1)

    const initialVariant = resolveInitialVariant(result.data, queryVariantId.value)

    if (!initialVariant) {
      selectedVariantId.value = ''
      return
    }

    await applySelectedVariant(initialVariant, !queryVariantId.value)
  }

  async function selectOption(groupKey: string, value: string) {
    if (!product.value) {
      return
    }

    const nextSelections: Record<string, string> = {
      ...(selectedVariant.value?.color ? { color: selectedVariant.value.color } : {}),
      [groupKey]: value,
    }

    const nextVariant = resolveVariantForSelections(product.value, nextSelections, groupKey)

    if (!nextVariant || nextVariant.id === selectedVariantId.value) {
      return
    }

    await applySelectedVariant(nextVariant)
  }

  function setQuantity(next: number) {
    quantity.value = clampQuantity(next)
  }

  async function addToCart() {
    if (!product.value || !selectedVariant.value || addingToCart.value) {
      return false
    }

    ctaMessage.value = null

    if (!authStore.isAuthenticated) {
      await redirectToLogin()
      return false
    }

    addingToCart.value = true
    await cartStore.addItem({
      variantId: selectedVariant.value.id,
      quantity: quantity.value,
    })
    addingToCart.value = false

    if (cartStore.error) {
      ctaMessage.value = {
        severity: 'error',
        text: cartStore.error,
      }
      return false
    }

    ctaMessage.value = {
      severity: 'success',
      text: t('pdp.addToCartSuccess'),
    }
    return true
  }

  watch(
    productId,
    () => {
      reload()
    },
    { immediate: true },
  )

  watch(queryVariantId, (nextVariantId) => {
    if (!nextVariantId || !product.value) {
      return
    }

    if (routeVariantSync.value === nextVariantId) {
      routeVariantSync.value = null
      return
    }

    const nextVariant = resolveInitialVariant(product.value, nextVariantId)

    if (!nextVariant || nextVariant.id === selectedVariantId.value) {
      return
    }

    applySelectedVariant(nextVariant, false)
  })

  // TODO: watch(cityId) removed — availability not supported by backend yet.

  return {
    loading,
    error,
    product,
    relatedProducts,
    reviews,
    reviewsPagination,
    selectedVariantId,
    selectedVariant,
    selectorGroups,
    galleryImages,
    quantity,
    loadingReviews,
    addingToCart,
    submittingReview,
    canAddToCart,
    canLoadMoreReviews,
    isAuthenticated,
    ctaMessage,
    reviewsError,
    submitReviewError,
    submitReviewSuccess,
    selectOption,
    setQuantity,
    addToCart,
    loadReviews,
    loadMoreReviews,
    requestReviewAuth,
    submitReview,
    reload,
  }
}
