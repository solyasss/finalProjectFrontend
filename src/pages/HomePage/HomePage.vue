<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import CollectionOverlayCard from '@/components/molecules/CollectionOverlayCard/CollectionOverlayCard.vue'
import HomeHero from '@/components/organisms/HomeHero/HomeHero.vue'
import CarouselSection from '@/components/organisms/CarouselSection/CarouselSection.vue'
import HomeCollectionCta from '@/components/organisms/HomeCollectionCta/HomeCollectionCta.vue'
import NewArrivalGrid from '@/components/organisms/NewArrivalGrid/NewArrivalGrid.vue'
import TopPromoBar from '@/components/organisms/TopPromoBar/TopPromoBar.vue'
import DefaultTemplate from '@/components/templates/DefaultTemplate/DefaultTemplate.vue'

const { t } = useI18n()
const router = useRouter()

const DEFAULT_PLP_ROUTE = {
  name: 'plp' as const,
  params: { categorySlug: 'living-room' },
}

const heroCategoryRoutes = [
  { name: 'plp' as const, params: { categorySlug: 'sofas' } },
  { name: 'plp' as const, params: { categorySlug: 'bedroom' } },
  { name: 'plp' as const, params: { categorySlug: 'beds' } },
]

const collectionCategoryRoutes = [
  { name: 'plp' as const, params: { categorySlug: 'sofas' } },
  { name: 'plp' as const, params: { categorySlug: 'bedroom' } },
  { name: 'plp' as const, params: { categorySlug: 'beds' } },
]

const recommendationCategoryRoutes = [
  { name: 'plp' as const, params: { categorySlug: 'living-room' } },
  { name: 'plp' as const, params: { categorySlug: 'bedroom' } },
  { name: 'plp' as const, params: { categorySlug: 'lighting' } },
  { name: 'plp' as const, params: { categorySlug: 'living-room' } },
  { name: 'plp' as const, params: { categorySlug: 'living-room' } },
  { name: 'plp' as const, params: { categorySlug: 'bedroom' } },
  { name: 'plp' as const, params: { categorySlug: 'lighting' } },
  { name: 'plp' as const, params: { categorySlug: 'living-room' } },
]

const bestSetCategoryRoutes = [
  { name: 'plp' as const, params: { categorySlug: 'living-room' } },
  { name: 'plp' as const, params: { categorySlug: 'bedroom' } },
  { name: 'plp' as const, params: { categorySlug: 'lighting' } },
  { name: 'plp' as const, params: { categorySlug: 'living-room' } },
  { name: 'plp' as const, params: { categorySlug: 'living-room' } },
  { name: 'plp' as const, params: { categorySlug: 'bedroom' } },
  { name: 'plp' as const, params: { categorySlug: 'lighting' } },
  { name: 'plp' as const, params: { categorySlug: 'living-room' } },
]

const newArrivalCategoryRoutes = [
  { name: 'plp' as const, params: { categorySlug: 'bedroom' } },
  { name: 'plp' as const, params: { categorySlug: 'living-room' } },
  { name: 'plp' as const, params: { categorySlug: 'lighting' } },
  { name: 'plp' as const, params: { categorySlug: 'living-room' } },
]

function navigateToIndexedCategory(index: number, routes: typeof heroCategoryRoutes) {
  return router.push(routes[index] ?? DEFAULT_PLP_ROUTE)
}

function handleCreateAccountClick() {
  return router.push({ name: 'register' })
}

function handleCatalogueClick() {
  return router.push(DEFAULT_PLP_ROUTE)
}

const promoItems = [
  {
    imageSrc:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Soft decorative pillows on a sofa',
    title: 'ПОДУШКИ',
    subtitle: 'спальна кімната...',
    price: '12$',
    badgeText: 'TOP',
  },
  {
    imageSrc:
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Folded grey blanket on a sofa',
    title: 'КОВДРА',
    subtitle: 'спальна кімната...',
    price: '30$',
    badgeText: 'TOP',
  },
  {
    imageSrc:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Beige bed in a neutral bedroom',
    title: 'ЛІЖКО',
    subtitle: 'спальна кімната...',
    price: '414$',
    badgeText: 'TOP',
  },
]

const collectionItems = [
  {
    image: {
      url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
      alt: 'Soft decorative pillows on a sofa',
      width: 900,
      height: 900,
    },
    title: 'ПОДУШКИ',
  },
  {
    image: {
      url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80',
      alt: 'Folded grey blanket on a sofa',
      width: 900,
      height: 900,
    },
    title: 'КОВДРА',
  },
  {
    image: {
      url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80',
      alt: 'Beige bed in a neutral bedroom',
      width: 900,
      height: 900,
    },
    title: 'ЛІЖКО',
    actionPlacement: 'right' as const,
  },
]

const recommendationItems = [
  {
    id: 1,
    imageSrc:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Neutral sofa in a bright living room',
    title: 'СКАНДІ НАБІР',
  },
  {
    id: 2,
    imageSrc:
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Folded blanket in a cozy room',
    title: 'SOFT HOME',
  },
  {
    id: 3,
    imageSrc:
      'https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Dining collection styled in warm tones',
    title: 'DINING SET',
  },
  {
    id: 4,
    imageSrc:
      'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Living room styling set with chairs and decor',
    title: 'LIVING SET',
  },
  {
    id: 5,
    imageSrc:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Neutral sofa in a bright living room',
    title: 'СКАНДІ НАБІР',
  },
  {
    id: 6,
    imageSrc:
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Folded blanket in a cozy room',
    title: 'SOFT HOME',
  },
  {
    id: 7,
    imageSrc:
      'https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Dining collection styled in warm tones',
    title: 'DINING SET',
  },
  {
    id: 8,
    imageSrc:
      'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Living room styling set with chairs and decor',
    title: 'LIVING SET',
  },
]

const bestSetItems = [
  {
    id: 1,
    imageSrc:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Neutral sofa in a bright living room',
    title: 'СКАНДІ НАБІР',
  },
  {
    id: 2,
    imageSrc:
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Folded blanket in a cozy room',
    title: 'SOFT HOME',
  },
  {
    id: 3,
    imageSrc:
      'https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Dining collection styled in warm tones',
    title: 'DINING SET',
  },
  {
    id: 4,
    imageSrc:
      'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Living room styling set with chairs and decor',
    title: 'LIVING SET',
  },
  {
    id: 5,
    imageSrc:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Neutral sofa in a bright living room',
    title: 'СКАНДІ НАБІР',
  },
  {
    id: 6,
    imageSrc:
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Folded blanket in a cozy room',
    title: 'SOFT HOME',
  },
  {
    id: 7,
    imageSrc:
      'https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Dining collection styled in warm tones',
    title: 'DINING SET',
  },
  {
    id: 8,
    imageSrc:
      'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Living room styling set with chairs and decor',
    title: 'LIVING SET',
  },
]

const sectionResponsiveOptions = [
  {
    breakpoint: '1024px',
    numVisible: 3,
    numScroll: 1,
  },
  {
    breakpoint: '768px',
    numVisible: 2,
    numScroll: 1,
  },
  {
    breakpoint: '640px',
    numVisible: 1,
    numScroll: 1,
  },
]

const newArrivalItems = [
  {
    image: {
      url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
      alt: 'Soft beige bedroom with layered textiles',
      width: 900,
      height: 900,
    },
  },
  {
    image: {
      url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80',
      alt: 'Bright living room with a neutral sofa',
      width: 900,
      height: 900,
    },
  },
  {
    image: {
      url: 'https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?auto=format&fit=crop&w=900&q=80',
      alt: 'Dining room with warm wood furniture',
      width: 900,
      height: 900,
    },
  },
  {
    image: {
      url: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=900&q=80',
      alt: 'Minimal living area with modern chairs',
      width: 900,
      height: 900,
    },
  },
]
</script>

<template>
  <TopPromoBar />
  <DefaultTemplate>
    <main class="bg-surface-0 flex flex-col items-center gap-12 w-full mb-12">
      <HomeHero
        :items="promoItems"
        @primary-click="handleCreateAccountClick"
        @secondary-click="handleCatalogueClick"
        @select-item="(index) => navigateToIndexedCategory(index, heroCategoryRoutes)"
      />
      <div class="flex flex-col items-center w-[75%] gap-12">
        <div class="mx-auto w-full h-250">
          <HomeCollectionCta
            :title="t('homePage.collectionsTitle')"
            :items="collectionItems"
            @select-item="(index) => navigateToIndexedCategory(index, collectionCategoryRoutes)"
          />
        </div>
        <div>
          <CarouselSection
            :title="t('homePage.recommendationTitle')"
            :items="recommendationItems"
            item-key="id"
            :num-visible="6"
            :num-scroll="1"
            :show-indicators="false"
            :show-navigators="true"
            :responsive-options="sectionResponsiveOptions"
            content-class="px-3"
            @select-item="
              ({ index }) => navigateToIndexedCategory(index, recommendationCategoryRoutes)
            "
            circular
          >
            <template #default="{ item, select }">
              <CollectionOverlayCard v-bind="item" clickable @select="select" />
            </template>
          </CarouselSection>
        </div>
        <div>
          <CarouselSection
            :title="t('homePage.bestSetsTitle')"
            :items="bestSetItems"
            item-key="id"
            :num-visible="6"
            :num-scroll="1"
            :show-indicators="false"
            :show-navigators="true"
            :responsive-options="sectionResponsiveOptions"
            content-class="px-3"
            @select-item="({ index }) => navigateToIndexedCategory(index, bestSetCategoryRoutes)"
            circular
          >
            <template #default="{ item, select }">
              <CollectionOverlayCard v-bind="item" clickable @select="select" />
            </template>
          </CarouselSection>
        </div>
        <div class="mx-auto h-250">
          <NewArrivalGrid
            :title="t('homePage.newArrivalsTitle')"
            :items="newArrivalItems"
            @select-item="(index) => navigateToIndexedCategory(index, newArrivalCategoryRoutes)"
          />
        </div>
      </div>
    </main>
  </DefaultTemplate>
</template>
