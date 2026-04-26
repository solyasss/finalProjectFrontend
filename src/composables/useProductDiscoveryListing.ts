import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter, type LocationQueryRaw, type LocationQueryValue } from 'vue-router'
import {
  getCategoryProducts,
  // TODO: search is not supported by the backend API yet.
  // To enable once backend supports search endpoint.
  // search,
  type FilterDefinition,
  type Pagination,
  type ProductCard,
  type ProductFilters,
  type ProductListResponse,
  // TODO: SearchResponse not supported yet.
  // type SearchResponse,
  type SortOption,
} from '@/api'
import { useCatalogStore } from '@/stores'

const DEFAULT_LIMIT = 12
const FILTER_QUERY_PREFIX = 'filters['
const FILTER_QUERY_SUFFIX = ']'
const SORT_OPTIONS: SortOption[] = ['relevance', 'price_asc', 'price_desc', 'rating', 'newest']
const FALLBACK_FILTER_TYPES: Record<string, FilterDefinition['type']> = {
  availability: 'BOOLEAN',
  price: 'RANGE',
}

export interface ProductDiscoveryRangeDraft {
  min: string
  max: string
}

export type ProductDiscoverySelectedFilterValue = string[] | string | boolean

export type ProductDiscoverySelectedFilters = Partial<
  Record<string, ProductDiscoverySelectedFilterValue>
>

export interface ProductDiscoveryFilterChip {
  key: string
  label: string
  value?: string
  displayLabel: string
}

interface ProductDiscoveryListingOptions {
  // TODO: 'search' mode not supported by backend API yet.
  // To enable once backend supports search endpoint.
  mode: 'plp' | 'search'
}

interface ListingResponseMeta {
  products: ProductCard[]
  filters: FilterDefinition[]
  pagination: Pagination | null
  title: string
}

function isSortOption(value: string): value is SortOption {
  return SORT_OPTIONS.includes(value as SortOption)
}

function parseRangeValue(value: string): string | null {
  if (!/^\d+-\d+$/.test(value)) {
    return null
  }

  const parts = value.split('-')
  const min = Number(parts[0])
  const max = Number(parts[1])

  if (!Number.isFinite(min) || !Number.isFinite(max) || min > max) {
    return null
  }

  return `${min}-${max}`
}

function parseSelectedFilters(
  query: Record<string, unknown>,
  filterDefinitions: FilterDefinition[],
): ProductDiscoverySelectedFilters {
  const selectedFilters: ProductDiscoverySelectedFilters = {}
  const knownFilters = new Map(filterDefinitions.map((filter) => [filter.key, filter]))

  for (const [queryKey, queryValue] of Object.entries(query)) {
    if (!queryKey.startsWith(FILTER_QUERY_PREFIX) || !queryKey.endsWith(FILTER_QUERY_SUFFIX)) {
      continue
    }

    const filterKey = queryKey.slice(FILTER_QUERY_PREFIX.length, -FILTER_QUERY_SUFFIX.length)
    const filter = knownFilters.get(filterKey)
    const rawValue =
      typeof queryValue === 'string'
        ? queryValue
        : Array.isArray(queryValue)
          ? (queryValue.find((entry): entry is string => typeof entry === 'string') ?? '')
          : ''

    if (!rawValue) {
      continue
    }

    switch (filter?.type ?? FALLBACK_FILTER_TYPES[filterKey] ?? 'MULTI_SELECT') {
      case 'MULTI_SELECT': {
        const values = [
          ...new Set(
            rawValue
              .split(',')
              .map((value) => value.trim())
              .filter(Boolean),
          ),
        ]

        if (values.length) {
          selectedFilters[filterKey] = values
        }

        break
      }
      case 'BOOLEAN':
        if (rawValue === 'in_stock') {
          selectedFilters[filterKey] = true
        }
        break
      case 'RANGE': {
        const parsedRange = parseRangeValue(rawValue)

        if (parsedRange) {
          selectedFilters[filterKey] = parsedRange
        }

        break
      }
    }
  }

  return selectedFilters
}

function buildApiFilters(selectedFilters: ProductDiscoverySelectedFilters): ProductFilters {
  const apiFilters: ProductFilters = {}

  for (const [key, value] of Object.entries(selectedFilters)) {
    if (Array.isArray(value)) {
      if (value.length) {
        apiFilters[key] = value.join(',')
      }
      continue
    }

    if (typeof value === 'boolean') {
      if (value) {
        apiFilters[key] = 'in_stock'
      }
      continue
    }

    if (value) {
      apiFilters[key] = value
    }
  }

  return apiFilters
}

function buildFilterChips(
  filters: FilterDefinition[],
  selectedFilters: ProductDiscoverySelectedFilters,
): ProductDiscoveryFilterChip[] {
  return filters.flatMap((filter) => {
    const selectedValue = selectedFilters[filter.key]

    if (!selectedValue) {
      return []
    }

    switch (filter.type) {
      case 'MULTI_SELECT': {
        const values = Array.isArray(selectedValue) ? selectedValue : []

        return values.map((value) => ({
          key: filter.key,
          label: filter.label,
          value,
          displayLabel: filter.options?.find((option) => option.value === value)?.label ?? value,
        }))
      }
      case 'BOOLEAN':
        return [
          {
            key: filter.key,
            label: filter.label,
            displayLabel: filter.label,
          },
        ]
      case 'RANGE':
        if (typeof selectedValue !== 'string') {
          return []
        }

        return [
          {
            key: filter.key,
            label: filter.label,
            displayLabel: selectedValue,
          },
        ]
    }
  })
}

function extractFilterQuerySignature(query: Record<string, unknown>): string {
  const entries = Object.entries(query)
    .filter(([key]) => key.startsWith(FILTER_QUERY_PREFIX))
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${key}:${value.join(',')}`
      }

      return `${key}:${String(value ?? '')}`
    })
    .sort()

  return entries.join('|')
}

export function useProductDiscoveryListing(_options: ProductDiscoveryListingOptions) {
  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()
  const catalogStore = useCatalogStore()

  const loading = ref(false)
  const error = ref<string | null>(null)
  const products = ref<ProductCard[]>([])
  const filters = ref<FilterDefinition[]>([])
  const pagination = ref<Pagination | null>(null)
  const title = ref('')

  const sourceValue = computed(() => {
    // TODO: search mode removed — not supported by backend API yet.
    // if (options.mode === 'search') { ... }
    return String(route.params.categorySlug ?? '')
  })

  const hasSource = computed(() => Boolean(sourceValue.value))
  // TODO: showPromptState was for search mode — not supported yet.
  const showPromptState = computed(() => false)

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

    // Ensure categories are loaded so we can resolve slug → id
    await catalogStore.fetchCategories()

    const categorySlug = sourceValue.value
    const category = catalogStore.findCategoryBySlug(categorySlug)

    if (!category) {
      error.value = t('plp.error')
      products.value = []
      filters.value = []
      pagination.value = null
      title.value = categorySlug
      return null
    }

    loading.value = true
    error.value = null

    const apiFilters = buildApiFilters(parseSelectedFilters(route.query, filters.value))
    const requestParams = {
      page: 1,
      limit: DEFAULT_LIMIT,
      sort: sort.value || undefined,
      filters: apiFilters,
    }

    // TODO: search mode removed — not supported by backend API yet.
    // To enable once backend supports search endpoint.

    const result = await getCategoryProducts(category.id, requestParams)

    loading.value = false

    if (!result.ok) {
      error.value = result.error.message || t('plp.error')
      products.value = []
      filters.value = []
      pagination.value = null
      title.value = category.name
      return null
    }

    const normalized = normalizeCategoryResponse(result.data, category.name)

    title.value = normalized.title
    products.value = normalized.products
    filters.value = normalized.filters
    pagination.value = normalized.pagination
    return normalized
  }

  function normalizeCategoryResponse(
    data: ProductListResponse,
    categoryName: string,
  ): ListingResponseMeta {
    return {
      title: categoryName,
      products: data.data,
      // TODO: filters not returned by /catalog/products — not supported yet.
      filters: [],
      pagination: {
        total: data.meta.totalItems,
        page: data.meta.currentPage,
        limit: data.meta.itemsPerPage,
      },
    }
  }

  // TODO: normalizeSearchResponse removed — search not supported by backend API yet.
  // To enable once backend supports search endpoint.
  // function normalizeSearchResponse(data: SearchResponse): ListingResponseMeta { ... }

  async function updateQuery(
    nextSort: SortOption | '',
    nextSelectedFilters: ProductDiscoverySelectedFilters,
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

    await router.replace({ query: nextQuery })
  }

  async function setSort(nextSort: SortOption | '') {
    if (sort.value === nextSort) {
      return
    }

    await updateQuery(nextSort, selectedFilters.value)
  }

  async function applyFilters(nextSelectedFilters: ProductDiscoverySelectedFilters) {
    await updateQuery(sort.value, nextSelectedFilters)
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
    if (!Object.keys(selectedFilters.value).length) {
      return
    }

    await updateQuery(sort.value, {})
  }

  async function selectProduct(product: ProductCard) {
    await router.push({ name: 'pdp', params: { productId: product.id } })
  }

  async function reload() {
    await loadListing()
  }

  watch(
    [
      sourceValue,
      () => getQueryStringValue(route.query.sort),
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
    hasSource,
    showPromptState,
    setSort,
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

function getQueryStringValue(value: LocationQueryValue | LocationQueryValue[] | undefined): string {
  if (typeof value === 'string') {
    return value
  }

  if (Array.isArray(value)) {
    return value.find((entry): entry is string => typeof entry === 'string') ?? ''
  }

  return ''
}
