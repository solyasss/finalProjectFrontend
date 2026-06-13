import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  getActivePromotions,
  getCategories,
  getProductSets,
  getProducts,
  search,
  type ApiResult,
  type ProductSetSummary,
  type ProductListItem,
  type Promotion,
  type SearchApiResponse,
  type SearchVariantItem,
} from '@/api'
import { extractImageUrl } from '@/utils/image'

interface HomePromoItem {
  imageSrc: string
  imageAlt: string
  title: string
  subtitle?: string
  price: string
  badgeText?: string
}

interface HomePromoTarget {
  productId: number
  variantId?: string
}

interface HomeCollectionItem {
  image: {
    url: string
    alt: string
    width: number
    height: number
  }
  title: string
  actionPlacement?: 'bottom' | 'right' | 'none'
}

interface HomeCollectionTarget {
  slug: string
}

interface HomeRecommendationItem {
  id: number
  imageSrc: string
  imageAlt: string
  title: string
}

interface HomeRecommendationTarget {
  productId: number
}

interface HomeBestSetItem {
  id: number
  imageSrc: string
  imageAlt: string
  title: string
}

interface HomeBestSetTarget {
  roomId?: number
  setId: number
}

interface HomeNewArrivalItem {
  image: {
    url: string
    alt: string
    width: number
    height: number
  }
  title: string
}

interface HomeNewArrivalTarget {
  productId: number
}

interface HomepageCollectionCategory {
  name: string
  slug: string
  isActive?: boolean
  imageUrl?: unknown
}

const HOME_PROMO_LIMIT = 3
const HOME_COLLECTION_LIMIT = 3
const HOME_RECOMMENDATION_LIMIT = 10
const HOME_BEST_SET_LIMIT = 10
const HOME_NEW_ARRIVAL_PAGE = 2
const HOME_NEW_ARRIVAL_LIMIT = 4
const HOME_NEW_ARRIVAL_IMAGE_SIZE = 900
const PRODUCT_LOOKUP_PAGE_SIZE = 100
const PROMOTION_LOOKUP_PAGE_SIZE = 100
const HOME_PROMO_FALLBACK_IMAGE = '/HomeHero.jpg'
const HOME_COLLECTION_FALLBACK_IMAGE = '/HomeHero.jpg'
const HOME_RECOMMENDATION_FALLBACK_IMAGE = '/HomeHero.jpg'
const HOME_BEST_SET_FALLBACK_IMAGE = '/HomeHero.jpg'
const HOME_COLLECTION_IMAGE_SIZE = 900

type HomePageSectionState = 'loading' | 'ready' | 'error'

interface ResolvedPromotionCard {
  item: HomePromoItem
  target: HomePromoTarget
}

interface ResolvedCollectionCard {
  item: HomeCollectionItem
  target: HomeCollectionTarget
}

interface ResolvedRecommendationCard {
  item: HomeRecommendationItem
  target: HomeRecommendationTarget
}

interface ResolvedBestSetCard {
  item: HomeBestSetItem
  target: HomeBestSetTarget
}

interface ResolvedNewArrivalCard {
  item: HomeNewArrivalItem
  target: HomeNewArrivalTarget
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function formatPromoPrice(rawPrice?: string | null): string {
  const normalizedPrice = rawPrice?.trim()

  if (!normalizedPrice) {
    return '—'
  }

  return `${normalizedPrice} ₴`
}

function resolveProductListPrice(product: ProductListItem): string {
  return product.price ?? product.variants?.[0]?.price ?? ''
}

function resolvePromotionPrice(item: SearchVariantItem): string {
  return String(item.price)
}

function normalizePromoTitle(title: string): string {
  return title.trim().toUpperCase()
}

function resolvePromotionTargetVariantId(promotion: Promotion): string | null {
  const rawTargetId = promotion.targetIds?.find(
    (targetId: unknown) => typeof targetId === 'string' && targetId.trim(),
  )

  if (!rawTargetId) {
    return null
  }

  return rawTargetId.trim()
}

function buildPromotionBadgeText(promotion: Promotion): string {
  if (promotion.discountType === 'PERCENTAGE') {
    return `-${promotion.discountValue}%`
  }

  return `-${promotion.discountValue} ₴`
}

function isHomepageVariantPromotion(promotion: Promotion): boolean {
  if (promotion.isActive === false) {
    return false
  }

  if (promotion.targetType !== 'VARIANT') {
    return false
  }

  return Boolean(resolvePromotionTargetVariantId(promotion))
}

function buildPromoItem(args: {
  imageSrc?: unknown
  imageAlt: string
  title: string
  subtitle?: string | null
  price: string
  badgeText?: string
}): HomePromoItem {
  const normalizedImageSrc = extractImageUrl(args.imageSrc) ?? HOME_PROMO_FALLBACK_IMAGE

  return {
    imageSrc: normalizedImageSrc,
    imageAlt: args.imageAlt,
    title: normalizePromoTitle(args.title),
    subtitle: args.subtitle?.trim() || undefined,
    price: formatPromoPrice(args.price),
    badgeText: args.badgeText,
  }
}

function buildFallbackPromoItem(product: ProductListItem): HomePromoItem {
  return buildPromoItem({
    imageSrc: product.baseImageUrl,
    imageAlt: product.name,
    title: product.name,
    subtitle: product.description,
    price: resolveProductListPrice(product),
    badgeText: 'TOP',
  })
}

function buildPromotionPromoItem(item: SearchVariantItem, promotion: Promotion): HomePromoItem {
  return buildPromoItem({
    imageSrc: item.baseImageUrl,
    imageAlt: item.name,
    title: item.name,
    subtitle: promotion.description ?? item.description,
    price: resolvePromotionPrice(item),
    badgeText: buildPromotionBadgeText(promotion),
  })
}

function buildFallbackResolvedCard(product: ProductListItem): ResolvedPromotionCard {
  return {
    item: buildFallbackPromoItem(product),
    target: { productId: product.id },
  }
}

function normalizeCollectionTitle(name: string): string {
  return name.trim().toUpperCase()
}

function normalizeRecommendationTitle(name: string): string {
  return name.trim().toUpperCase()
}

function buildCollectionItem(
  category: HomepageCollectionCategory,
  index: number,
): HomeCollectionItem {
  const imageUrl = extractImageUrl(category.imageUrl) ?? HOME_COLLECTION_FALLBACK_IMAGE

  return {
    image: {
      url: imageUrl,
      alt: category.name,
      width: HOME_COLLECTION_IMAGE_SIZE,
      height: HOME_COLLECTION_IMAGE_SIZE,
    },
    title: normalizeCollectionTitle(category.name),
    actionPlacement: index === HOME_COLLECTION_LIMIT - 1 ? 'right' : undefined,
  }
}

function isHomepageCollectionCategory(category: HomepageCollectionCategory): boolean {
  if (category.isActive === false) {
    return false
  }

  return Boolean(category.slug.trim())
}

function parseHomepageCollectionCategory(payload: unknown): HomepageCollectionCategory | null {
  if (!isRecord(payload)) {
    return null
  }

  if (typeof payload.name !== 'string' || typeof payload.slug !== 'string') {
    return null
  }

  if ('isActive' in payload && typeof payload.isActive !== 'boolean') {
    return null
  }

  return {
    name: payload.name,
    slug: payload.slug,
    isActive: typeof payload.isActive === 'boolean' ? payload.isActive : undefined,
    imageUrl: payload.imageUrl,
  }
}

function parseHomepageCollectionCategories(payload: unknown): HomepageCollectionCategory[] {
  if (!isRecord(payload) || !Array.isArray(payload.data)) {
    return []
  }

  return payload.data.flatMap((category) => {
    const parsedCategory = parseHomepageCollectionCategory(category)
    return parsedCategory ? [parsedCategory] : []
  })
}

function buildResolvedCollectionCard(
  category: HomepageCollectionCategory,
  index: number,
): ResolvedCollectionCard {
  return {
    item: buildCollectionItem(category, index),
    target: { slug: category.slug.trim() },
  }
}

function buildRecommendationItem(product: ProductListItem): HomeRecommendationItem {
  return {
    id: product.id,
    imageSrc: extractImageUrl(product.baseImageUrl) ?? HOME_RECOMMENDATION_FALLBACK_IMAGE,
    imageAlt: product.name,
    title: normalizeRecommendationTitle(product.name),
  }
}

function buildResolvedRecommendationCard(product: ProductListItem): ResolvedRecommendationCard {
  return {
    item: buildRecommendationItem(product),
    target: { productId: product.id },
  }
}

function buildBestSetItem(productSet: ProductSetSummary): HomeBestSetItem {
  return {
    id: productSet.id,
    imageSrc: extractImageUrl(productSet.imageUrl) ?? HOME_BEST_SET_FALLBACK_IMAGE,
    imageAlt: productSet.name,
    title: normalizeRecommendationTitle(productSet.name),
  }
}

function buildResolvedBestSetCard(productSet: ProductSetSummary): ResolvedBestSetCard {
  return {
    item: buildBestSetItem(productSet),
    target: {
      roomId: productSet.room?.id ?? productSet.roomId,
      setId: productSet.id,
    },
  }
}

function buildNewArrivalItem(product: ProductListItem): HomeNewArrivalItem {
  return {
    image: {
      url: extractImageUrl(product.baseImageUrl) ?? HOME_RECOMMENDATION_FALLBACK_IMAGE,
      alt: product.name,
      width: HOME_NEW_ARRIVAL_IMAGE_SIZE,
      height: HOME_NEW_ARRIVAL_IMAGE_SIZE,
    },
    title: normalizeRecommendationTitle(product.name),
  }
}

function buildResolvedNewArrivalCard(product: ProductListItem): ResolvedNewArrivalCard {
  return {
    item: buildNewArrivalItem(product),
    target: { productId: product.id },
  }
}

function buildResolvedPromotionCard(
  promotion: Promotion,
  item: SearchVariantItem,
  variantId: string,
): ResolvedPromotionCard {
  return {
    item: buildPromotionPromoItem(item, promotion),
    target: {
      productId: item.productId,
      variantId,
    },
  }
}

async function loadPromotionSearchPage(page: number): Promise<ApiResult<SearchApiResponse>> {
  return search({
    q: '',
    page,
    limit: PROMOTION_LOOKUP_PAGE_SIZE,
  })
}

function resolveSearchResultItems(searchResponse: SearchApiResponse): SearchVariantItem[] {
  if (Array.isArray(searchResponse.items)) {
    return searchResponse.items
  }

  if (Array.isArray(searchResponse.products)) {
    return searchResponse.products
  }

  return []
}

async function resolvePromotionProducts(
  promotions: Promotion[],
): Promise<ResolvedPromotionCard[] | null> {
  const variantIdsByPromotion = promotions.map(resolvePromotionTargetVariantId)
  const pendingVariantIds = new Set(
    variantIdsByPromotion.filter((variantId): variantId is string => Boolean(variantId)),
  )

  if (!pendingVariantIds.size) {
    return []
  }

  const variantByVariantId = new Map<string, SearchVariantItem>()
  const firstSearchPageResult = await loadPromotionSearchPage(1)

  if (!firstSearchPageResult.ok) {
    return null
  }

  const totalPages = Math.max(
    Math.ceil(firstSearchPageResult.data.totalFound / PROMOTION_LOOKUP_PAGE_SIZE),
    1,
  )

  for (let page = 1; page <= totalPages; page += 1) {
    const searchPageResult =
      page === 1 ? firstSearchPageResult : await loadPromotionSearchPage(page)

    if (!searchPageResult.ok) {
      return null
    }

    const searchItems = resolveSearchResultItems(searchPageResult.data)

    for (const item of searchItems) {
      if (!pendingVariantIds.has(item.id)) {
        continue
      }

      variantByVariantId.set(item.id, item)
      pendingVariantIds.delete(item.id)
    }

    if (!pendingVariantIds.size) {
      break
    }
  }

  return promotions.flatMap((promotion, index) => {
    const variantId = variantIdsByPromotion[index]

    if (!variantId) {
      return []
    }

    const item = variantByVariantId.get(variantId)

    if (!item) {
      return []
    }

    return [buildResolvedPromotionCard(promotion, item, variantId)]
  })
}

async function loadPromoFallbackFillers(
  excludedProductIds: number[],
  neededCount: number,
): Promise<ResolvedPromotionCard[]> {
  const excludedProductIdSet = new Set(excludedProductIds)
  const fallbackCards: ResolvedPromotionCard[] = []
  let page = 1
  let totalPages = 1

  while (page <= totalPages && fallbackCards.length < neededCount) {
    const productsResult = await getProducts({ page, limit: PRODUCT_LOOKUP_PAGE_SIZE })

    if (!productsResult.ok) {
      break
    }

    totalPages = Math.max(productsResult.data.meta.totalPages, 1)

    for (const product of productsResult.data.data) {
      if (excludedProductIdSet.has(product.id)) {
        continue
      }

      fallbackCards.push(buildFallbackResolvedCard(product))
      excludedProductIdSet.add(product.id)

      if (fallbackCards.length >= neededCount) {
        break
      }
    }

    page += 1
  }

  return fallbackCards
}

export function useHomePage() {
  const router = useRouter()
  const promoItems = ref<HomePromoItem[]>([])
  const promoTargets = ref<HomePromoTarget[]>([])
  const collectionItems = ref<HomeCollectionItem[]>([])
  const collectionTargets = ref<HomeCollectionTarget[]>([])
  const recommendationItems = ref<HomeRecommendationItem[]>([])
  const recommendationTargets = ref<HomeRecommendationTarget[]>([])
  const bestSetItems = ref<HomeBestSetItem[]>([])
  const bestSetTargets = ref<HomeBestSetTarget[]>([])
  const newArrivalItems = ref<HomeNewArrivalItem[]>([])
  const newArrivalTargets = ref<HomeNewArrivalTarget[]>([])
  const promoSectionState = ref<HomePageSectionState>('loading')
  const collectionSectionState = ref<HomePageSectionState>('loading')
  const recommendationSectionState = ref<HomePageSectionState>('loading')
  const bestSetSectionState = ref<HomePageSectionState>('loading')
  const newArrivalSectionState = ref<HomePageSectionState>('loading')

  function setRecommendationCards(cards: ResolvedRecommendationCard[]) {
    recommendationItems.value = cards.map((card) => card.item)
    recommendationTargets.value = cards.map((card) => card.target)
  }

  function setBestSetCards(cards: ResolvedBestSetCard[]) {
    bestSetItems.value = cards.map((card) => card.item)
    bestSetTargets.value = cards.map((card) => card.target)
  }

  async function loadCollectionItems() {
    const categoriesResult = await getCategories()

    if (!categoriesResult.ok) {
      collectionItems.value = []
      collectionTargets.value = []
      collectionSectionState.value = 'error'
      return
    }

    const homeCollections = parseHomepageCollectionCategories(categoriesResult.data)
      .filter(isHomepageCollectionCategory)
      .slice(0, HOME_COLLECTION_LIMIT)
      .map((category, index) => buildResolvedCollectionCard(category, index))

    collectionItems.value = homeCollections.map(
      (collection: ResolvedCollectionCard) => collection.item,
    )
    collectionTargets.value = homeCollections.map(
      (collection: ResolvedCollectionCard) => collection.target,
    )
    collectionSectionState.value = 'ready'
  }

  async function loadPromoItems() {
    const promotionsResult = await getActivePromotions()
    const resolvedPromoCards: ResolvedPromotionCard[] = []

    if (!promotionsResult.ok) {
      promoItems.value = []
      promoTargets.value = []
      promoSectionState.value = 'error'
      return
    }

    const qualifyingPromotions = promotionsResult.data.filter(isHomepageVariantPromotion)

    if (qualifyingPromotions.length) {
      const resolvedPromotionProductsResult = await resolvePromotionProducts(qualifyingPromotions)

      if (!resolvedPromotionProductsResult) {
        promoItems.value = []
        promoTargets.value = []
        promoSectionState.value = 'error'
        return
      }

      resolvedPromoCards.push(...resolvedPromotionProductsResult.slice(0, HOME_PROMO_LIMIT))
    }

    const fillerCards = await loadPromoFallbackFillers(
      resolvedPromoCards.map((card) => card.target.productId),
      Math.max(HOME_PROMO_LIMIT - resolvedPromoCards.length, 0),
    )
    const homeCards = [...resolvedPromoCards, ...fillerCards].slice(0, HOME_PROMO_LIMIT)

    promoItems.value = homeCards.map((card) => card.item)
    promoTargets.value = homeCards.map((card) => card.target)
    promoSectionState.value = 'ready'
  }

  async function loadRecommendationItems() {
    const productsResult = await getProducts({ limit: HOME_RECOMMENDATION_LIMIT })

    if (!productsResult.ok) {
      setRecommendationCards([])
      recommendationSectionState.value = 'error'
      return
    }

    const resolvedRecommendationCards: ResolvedRecommendationCard[] = productsResult.data.data
      .slice(0, HOME_RECOMMENDATION_LIMIT)
      .map(buildResolvedRecommendationCard)

    setRecommendationCards(resolvedRecommendationCards)
    recommendationSectionState.value = 'ready'
  }

  async function loadBestSetItems() {
    const productSetsResult = await getProductSets({ limit: HOME_BEST_SET_LIMIT })

    if (!productSetsResult.ok) {
      setBestSetCards([])
      bestSetSectionState.value = 'error'
      return
    }

    const resolvedBestSetCards = productSetsResult.data.data
      .slice(0, HOME_BEST_SET_LIMIT)
      .map(buildResolvedBestSetCard)

    setBestSetCards(resolvedBestSetCards)
    bestSetSectionState.value = 'ready'
  }

  async function loadNewArrivalItems() {
    const productsResult = await getProducts({
      page: HOME_NEW_ARRIVAL_PAGE,
      limit: HOME_NEW_ARRIVAL_LIMIT,
    })

    if (!productsResult.ok) {
      newArrivalItems.value = []
      newArrivalTargets.value = []
      newArrivalSectionState.value = 'error'
      return
    }

    const cards = productsResult.data.data.map(buildResolvedNewArrivalCard)
    newArrivalItems.value = cards.map((card) => card.item)
    newArrivalTargets.value = cards.map((card) => card.target)
    newArrivalSectionState.value = 'ready'
  }

  async function openPromoItem(index: number) {
    const target = promoTargets.value[index]

    if (!target) {
      return
    }

    await router.push({
      name: 'pdp',
      params: { productId: target.productId },
      query: target.variantId ? { variant: target.variantId } : undefined,
    })
  }

  async function openCollectionItem(index: number) {
    const target = collectionTargets.value[index]

    if (!target) {
      return
    }

    await router.push({
      name: 'plp',
      params: { categorySlug: target.slug },
    })
  }

  async function openRecommendationItem(index: number) {
    const target = recommendationTargets.value[index]

    if (!target) {
      return
    }

    await router.push({
      name: 'pdp',
      params: { productId: target.productId },
    })
  }

  async function openBestSetItem(index: number) {
    const target = bestSetTargets.value[index]

    if (!target) {
      return
    }

    if (!target.roomId) {
      await router.push({ name: 'rooms' })
      return
    }

    await router.push({
      name: 'product-set-detail',
      params: {
        roomId: target.roomId,
        setId: target.setId,
      },
    })
  }

  async function openNewArrivalItem(index: number) {
    const target = newArrivalTargets.value[index]

    if (!target) {
      return
    }

    await router.push({
      name: 'pdp',
      params: { productId: target.productId },
    })
  }

  onMounted(() => {
    void loadCollectionItems()
    void loadPromoItems()
    void loadRecommendationItems()
    void loadBestSetItems()
    void loadNewArrivalItems()
  })

  return {
    bestSetItems,
    bestSetSectionState,
    collectionItems,
    collectionSectionState,
    newArrivalItems,
    newArrivalSectionState,
    openBestSetItem,
    openCollectionItem,
    openNewArrivalItem,
    openRecommendationItem,
    promoItems,
    promoSectionState,
    openPromoItem,
    recommendationItems,
    recommendationSectionState,
  }
}
