import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter, type LocationQueryRaw } from 'vue-router'
import {
  search,
  type FilterDefinition,
  type Pagination,
  type ProductCard,
  type SortOption,
  type SearchVariantItem,
} from '@/api'
import {
  DEFAULT_LIMIT,
  FILTER_QUERY_PREFIX,
  buildApiFilters,
  buildFilterChips,
  extractFilterQuerySignature,
  getQueryStringValue,
  isSortOption,
  parseRangeValue,
  parseSelectedFilters,
  type ProductDiscoverySelectedFilters,
} from './usePlpListing'

interface ListingResponseMeta {
  products: ProductCard[]
  filters: FilterDefinition[]
  pagination: Pagination | null
  title: string
}

function normalizeSearchItem(item: SearchVariantItem): ProductCard {
  return {
    id: item.productId,
    variantId: item.id,
    name: item.name,
    slug: item.slug,
    description: item.description,
    price: String(item.price),
    isActive: item.inStock,
    createdAt: '',
    updatedAt: '',
    deletedAt: null,
    baseImageUrl: item.baseImageUrl,
    ratingAverage: item.ratingAverage,
    ratingCount: null,
  }
}

function resolveSearchProducts(data: {
  items?: SearchVariantItem[]
  products?: SearchVariantItem[]
}) {
  if (Array.isArray(data.items)) {
    return data.items
  }

  if (Array.isArray(data.products)) {
    return data.products
  }

  return []
}

export function useSearchListing() {
  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()

  const loading = ref(false)
  const error = ref<string | null>(null)
  const products = ref<ProductCard[]>([])
  const filters = ref<FilterDefinition[]>([])
  const pagination = ref<Pagination | null>(null)
  const title = ref('')

  const sourceValue = computed(() => String(route.query.q ?? ''))
  const hasSource = computed(() => Boolean(sourceValue.value))
  const showPromptState = computed(() => !sourceValue.value)

  const currentPage = computed(() => {
    const pageValue = Number(getQueryStringValue(route.query.page))
    return Number.isFinite(pageValue) && pageValue > 0 ? pageValue : 1
  })

  const sort = computed<SortOption | ''>(() => {
    const nextSort = route.query.sort
    return typeof nextSort === 'string' && isSortOption(nextSort) ? nextSort : ''
  })

  const selectedFilters = computed(() => parseSelectedFilters(route.query, filters.value))
  const activeFilterChips = computed(() => buildFilterChips(filters.value, selectedFilters.value))
  const sortOptions = computed(() => [
    { label: t('listingControls.sortRelevance'), value: 'relevance' as const },
    { label: t('listingControls.sortPriceAsc'), value: 'price_asc' as const },
    { label: t('listingControls.sortPriceDesc'), value: 'price_desc' as const },
    { label: t('listingControls.sortRating'), value: 'rating' as const },
    { label: t('listingControls.sortNewest'), value: 'newest' as const },
  ])

  async function loadListing(): Promise<ListingResponseMeta | null> {
    if (!hasSource.value) {
      products.value = []
      filters.value = []
      pagination.value = null
      error.value = null
      title.value = ''
      return null
    }

    loading.value = true
    error.value = null

    const apiFilters = buildApiFilters(parseSelectedFilters(route.query, filters.value))
    const result = await search({
      q: sourceValue.value,
      page: currentPage.value,
      limit: DEFAULT_LIMIT,
      sort: sort.value || undefined,
      filters: apiFilters,
    })

    loading.value = false

    if (!result.ok) {
      error.value = result.error.message || t('search.error')
      products.value = []
      filters.value = []
      pagination.value = null
      title.value = sourceValue.value
      return null
    }

    const data = result.data
    const normalizedPagination: Pagination = {
      total: data.totalFound,
      page: currentPage.value,
      limit: DEFAULT_LIMIT,
    }
    const normalizedFilters: FilterDefinition[] = data.filters.map((f) => ({
      key: f.key,
      label: f.label,
      type: f.type,
      options: f.options?.map((o) => ({ value: o.value, label: o.label, count: o.count })) ?? null,
      range: f.range ? { min: f.range.min, max: f.range.max, step: 1 } : null,
    }))
    const normalizedProducts = resolveSearchProducts(data).map(normalizeSearchItem)

    title.value = data.query
    products.value = normalizedProducts
    filters.value = normalizedFilters
    pagination.value = normalizedPagination

    return {
      title: data.query,
      products: normalizedProducts,
      filters: normalizedFilters,
      pagination: normalizedPagination,
    }
  }

  async function updateQuery(
    nextSort: SortOption | '',
    nextSelectedFilters: ProductDiscoverySelectedFilters,
    nextPage = 1,
    push = false,
  ) {
    const nextQuery: LocationQueryRaw = { ...route.query }

    if (nextSort) {
      nextQuery.sort = nextSort
    } else {
      delete nextQuery.sort
    }

    for (const key of Object.keys(nextQuery)) {
      if (key.startsWith(FILTER_QUERY_PREFIX)) {
        delete nextQuery[key]
      }
    }

    const apiFilters = buildApiFilters(nextSelectedFilters)

    for (const [key, value] of Object.entries(apiFilters)) {
      nextQuery[`filters[${key}]`] = value
    }

    if (nextPage > 1) {
      nextQuery.page = String(nextPage)
    } else {
      delete nextQuery.page
    }

    await (push ? router.push({ query: nextQuery }) : router.replace({ query: nextQuery }))
  }

  async function setSort(nextSort: SortOption | '') {
    if (sort.value === nextSort) return
    await updateQuery(nextSort, selectedFilters.value)
  }

  async function applyFilters(nextSelectedFilters: ProductDiscoverySelectedFilters) {
    await updateQuery(sort.value, nextSelectedFilters, 1, true)
  }

  async function setPage(nextPage: number) {
    if (currentPage.value === nextPage || nextPage < 1) return
    await updateQuery(sort.value, selectedFilters.value, nextPage)
  }

  async function toggleFilterOption(key: string, value: string) {
    const nextSelectedFilters: ProductDiscoverySelectedFilters = { ...selectedFilters.value }
    const currentValues = Array.isArray(nextSelectedFilters[key])
      ? [...nextSelectedFilters[key]]
      : []
    const valueIndex = currentValues.indexOf(value)

    if (valueIndex >= 0) {
      currentValues.splice(valueIndex, 1)
    } else {
      currentValues.push(value)
    }

    if (currentValues.length) {
      nextSelectedFilters[key] = currentValues
    } else {
      delete nextSelectedFilters[key]
    }

    await updateQuery(sort.value, nextSelectedFilters)
  }

  async function setBooleanFilter(key: string, enabled: boolean) {
    const nextSelectedFilters: ProductDiscoverySelectedFilters = { ...selectedFilters.value }

    if (enabled) {
      nextSelectedFilters[key] = true
    } else {
      delete nextSelectedFilters[key]
    }

    await updateQuery(sort.value, nextSelectedFilters)
  }

  async function setRangeFilter(key: string, value: string | null) {
    const nextSelectedFilters: ProductDiscoverySelectedFilters = { ...selectedFilters.value }
    const parsedRange = value ? parseRangeValue(value) : null

    if (parsedRange) {
      nextSelectedFilters[key] = parsedRange
    } else {
      delete nextSelectedFilters[key]
    }

    await updateQuery(sort.value, nextSelectedFilters)
  }

  async function clearFilter(key: string) {
    const nextSelectedFilters: ProductDiscoverySelectedFilters = { ...selectedFilters.value }
    delete nextSelectedFilters[key]
    await updateQuery(sort.value, nextSelectedFilters)
  }

  async function clearAllFilters() {
    if (!Object.keys(selectedFilters.value).length) return
    await updateQuery(sort.value, {})
  }

  async function selectProduct(product: ProductCard) {
    await router.push({
      name: 'pdp',
      params: { productId: product.id },
      query: product.variantId ? { variant: product.variantId } : undefined,
    })
  }

  async function reload() {
    await loadListing()
  }

  watch(
    [
      sourceValue,
      currentPage,
      () => getQueryStringValue(route.query.sort),
      () => getQueryStringValue(route.query.page),
      () => extractFilterQuerySignature(route.query),
    ],
    () => {
      reload()
    },
    { immediate: true },
  )

  return {
    loading,
    error,
    products,
    filters,
    pagination,
    sort,
    sortOptions,
    selectedFilters,
    activeFilterChips,
    title,
    sourceValue,
    currentPage,
    hasSource,
    showPromptState,
    setSort,
    setPage,
    applyFilters,
    toggleFilterOption,
    setBooleanFilter,
    setRangeFilter,
    clearFilter,
    clearAllFilters,
    selectProduct,
    reload,
  }
}
