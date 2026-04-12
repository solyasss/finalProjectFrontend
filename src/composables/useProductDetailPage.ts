import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import {
  getProduct,
  getProductAvailability,
  type FulfillmentOption,
  type ProductBreadcrumbItem,
  type ProductCard,
  type ProductDetails,
  type ProductVariant,
  type VariantAttributePresentation,
} from '@/api'
import { useAuthStore, useCartStore, useLocationStore } from '@/stores'

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

export function clampQuantity(
  next: number,
  min = DEFAULT_MIN_QUANTITY,
  max = DEFAULT_MAX_QUANTITY,
) {
  // Normalizes quantity before it is shown in controls or sent to cart actions.
  if (!Number.isFinite(next)) {
    return min
  }

  return Math.min(Math.max(Math.trunc(next), min), max)
}

function matchesSelections(
  variant: ProductVariant,
  selections: Record<string, string>,
  ignoredKey?: string,
) {
  // Checks whether a variant is compatible with the current option choices when resolving a variant or disabling invalid options.
  // Example: selections { color: 'Black', size: 'Standard' } only match a variant with both attributes.
  return Object.entries(selections).every(([key, value]) => {
    if (!value || key === ignoredKey) {
      return true
    }

    return variant.attributes[key] === value
  })
}

export function resolveInitialVariant(product: ProductDetails, preferredVariantId?: string | null) {
  // Picks the first active PDP variant on initial load so price, gallery, selectors, and availability all render from the same variant.
  // Order: query param variant -> first product variant.
  const variantFromQuery = preferredVariantId
    ? product.variants.find((variant) => variant.variantId === preferredVariantId)
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
  // Resolves the next active variant from the current selections.
  // If no exact match exists, it keeps the value from the group the shopper changed most recently and picks the closest valid variant.
  // Example: if "Black / Large" does not exist after the shopper changes color, keep "Black" and choose the best matching available size.
  const exactMatch = product.variants.find((variant) => matchesSelections(variant, selections))

  if (exactMatch) {
    return exactMatch
  }

  if (!changedGroupKey) {
    return null
  }

  const changedValue = selections[changedGroupKey]
  const rankedCandidates = product.variants
    .filter((variant) => variant.attributes[changedGroupKey] === changedValue)
    .sort((left, right) => {
      const leftScore = Object.entries(selections).filter(
        ([key, value]) => left.attributes[key] === value,
      ).length
      const rightScore = Object.entries(selections).filter(
        ([key, value]) => right.attributes[key] === value,
      ).length

      return rightScore - leftScore
    })

  return rankedCandidates[0] ?? null
}

export function buildSelectorGroups(
  product: ProductDetails,
  selectedVariantId?: string | null,
): SelectorGroup[] {
  // Builds the selector UI model from backend variant metadata and the current variant.
  // It marks which options are selected and which combinations should be disabled before rendering VariantSelector components.
  const selectedVariant =
    product.variants.find((variant) => variant.variantId === selectedVariantId) ??
    product.variants[0] ??
    null

  if (!selectedVariant) {
    return []
  }

  const selections = selectedVariant.attributes
  return (product.variantAttributes ?? []).map((group) => {
    const options = group.options.map((option) => ({
      value: option.value,
      label: option.label,
      hex: option.hex,
      image: option.image,
      selected: selectedVariant.attributes[group.key] === option.value,
      disabled: !product.variants.some(
        (variant) =>
          variant.attributes[group.key] === option.value &&
          matchesSelections(variant, selections, group.key),
      ),
    }))

    return {
      key: group.key,
      label: group.label,
      presentation: group.presentation,
      selectedValue: selectedVariant.attributes[group.key],
      options,
    }
  })
}

export function useProductDetailPage() {
  // Owns PDP route state, variant selection, availability refresh, and add-to-cart behavior.
  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()
  const authStore = useAuthStore()
  const cartStore = useCartStore()
  const locationStore = useLocationStore()

  const loading = ref(false)
  const loadingAvailability = ref(false)
  const addingToCart = ref(false)
  const error = ref<string | null>(null)
  const availabilityError = ref<string | null>(null)
  const product = ref<ProductDetails | null>(null)
  const relatedProducts = ref<ProductCard[]>([])
  const accessories = ref<ProductCard[]>([])
  const breadcrumbs = ref<ProductBreadcrumbItem[]>([])
  const availability = ref<FulfillmentOption[]>([])
  const quantity = ref(DEFAULT_MIN_QUANTITY)
  const selectedVariantId = ref('')
  const ctaMessage = ref<CtaMessage | null>(null)

  const routeVariantSync = ref<string | null>(null)

  const productSlug = computed(() => String(route.params.productSlug ?? ''))
  const queryVariantId = computed(() => {
    const variant = route.query.variant
    return typeof variant === 'string' ? variant : ''
  })
  const zipCode = computed(() => locationStore.getContext().zipCode)

  const selectedVariant = computed(() => {
    return (
      product.value?.variants.find((variant) => variant.variantId === selectedVariantId.value) ??
      null
    )
  })

  const selectorGroups = computed(() => {
    if (!product.value) {
      return []
    }

    return buildSelectorGroups(product.value, selectedVariantId.value)
  })

  const galleryImages = computed(() => selectedVariant.value?.images ?? [])

  const canAddToCart = computed(() => {
    return Boolean(product.value && selectedVariant.value && !addingToCart.value)
  })

  async function syncVariantQuery(variantId: string) {
    // Updates the route query after variant changes so the selected configuration is shareable.
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

  async function loadAvailability(productId: string, variantId: string) {
    // Loads fulfillment data after initial PDP load and whenever variant or ZIP changes.
    loadingAvailability.value = true
    availabilityError.value = null

    const result = await getProductAvailability(productId, {
      variantId,
      zipCode: zipCode.value,
    })

    loadingAvailability.value = false

    if (!result.ok) {
      availabilityError.value = result.error.message || t('pdp.availabilityError')
      return
    }

    availability.value = result.data.options
  }

  async function applySelectedVariant(nextVariant: ProductVariant, syncRoute = true) {
    // Applies a resolved variant, then refreshes URL and availability for that selection.
    selectedVariantId.value = nextVariant.variantId
    ctaMessage.value = null
    quantity.value = clampQuantity(quantity.value)

    if (syncRoute) {
      await syncVariantQuery(nextVariant.variantId)
    }

    if (product.value) {
      await loadAvailability(product.value.productId, nextVariant.variantId)
    }
  }

  async function reload() {
    // Fetches PDP data when the page opens or when the product slug changes.
    // TODO: If no productSlug consider redirecting to a 404 page
    if (!productSlug.value) {
      product.value = null
      relatedProducts.value = []
      accessories.value = []
      availability.value = []
      breadcrumbs.value = []
      return
    }

    loading.value = true
    error.value = null
    availabilityError.value = null
    ctaMessage.value = null
    quantity.value = DEFAULT_MIN_QUANTITY

    const result = await getProduct(productSlug.value)

    console.log('getProduct result', result) // TODO: Debug log to inspect the API response

    loading.value = false

    if (!result.ok) {
      error.value = result.error.message || t('pdp.error')
      product.value = null
      relatedProducts.value = []
      accessories.value = []
      availability.value = []
      breadcrumbs.value = []
      return
    }

    product.value = result.data.product
    relatedProducts.value = result.data.relatedProducts
    accessories.value = result.data.accessories
    breadcrumbs.value = result.data.breadcrumbs ?? []
    availability.value = result.data.product.fulfillment

    const initialVariant = resolveInitialVariant(result.data.product, queryVariantId.value)

    if (!initialVariant) {
      selectedVariantId.value = ''
      return
    }

    await applySelectedVariant(initialVariant, !queryVariantId.value)
  }

  async function selectOption(groupKey: string, value: string) {
    // Recomputes the active variant after a shopper picks a new option value.
    if (!product.value) {
      return
    }

    const nextSelections = {
      ...selectedVariant.value?.attributes,
      [groupKey]: value,
    }

    const nextVariant = resolveVariantForSelections(product.value, nextSelections, groupKey)

    if (!nextVariant || nextVariant.variantId === selectedVariantId.value) {
      return
    }

    await applySelectedVariant(nextVariant)
  }

  function setQuantity(next: number) {
    // Updates quantity from the purchase panel controls before add-to-cart.
    quantity.value = clampQuantity(next)
  }

  async function addToCart() {
    // Handles the purchase CTA by redirecting guests or adding the selected variant to cart.
    if (!product.value || !selectedVariant.value || addingToCart.value) {
      return false
    }

    ctaMessage.value = null

    if (!authStore.isAuthenticated) {
      const redirect = route.fullPath
      const safeRedirect = redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : '/'
      await router.push({
        name: 'login',
        query: { redirect: safeRedirect },
      })
      return false
    }

    addingToCart.value = true
    await cartStore.addItem({
      productId: product.value.productId,
      variantId: selectedVariant.value.variantId,
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
    productSlug,
    () => {
      // Reload the PDP whenever navigation changes the product slug.
      reload()
    },
    { immediate: true },
  )

  watch(queryVariantId, (nextVariantId) => {
    // Apply externally changed variant query params, such as browser navigation or shared PDP links.
    if (!nextVariantId || !product.value) {
      return
    }

    if (routeVariantSync.value === nextVariantId) {
      routeVariantSync.value = null
      return
    }

    const nextVariant = resolveInitialVariant(product.value, nextVariantId)

    if (!nextVariant || nextVariant.variantId === selectedVariantId.value) {
      return
    }

    applySelectedVariant(nextVariant, false)
  })

  watch(zipCode, () => {
    // Refresh fulfillment messaging when the shopper changes delivery location.
    if (!product.value || !selectedVariant.value) {
      return
    }

    loadAvailability(product.value.productId, selectedVariant.value.variantId)
  })

  return {
    loading,
    error,
    availabilityError,
    product,
    relatedProducts,
    accessories,
    breadcrumbs,
    selectedVariantId,
    selectedVariant,
    selectorGroups,
    galleryImages,
    availability,
    quantity,
    loadingAvailability,
    addingToCart,
    canAddToCart,
    ctaMessage,
    selectOption,
    setQuantity,
    addToCart,
    reload,
  }
}
