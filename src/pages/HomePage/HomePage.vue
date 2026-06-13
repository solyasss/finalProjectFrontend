<script setup lang="ts">
import Skeleton from 'primevue/skeleton'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import CollectionOverlayCard from '@/components/molecules/CollectionOverlayCard/CollectionOverlayCard.vue'
import ProductCutoutCard from '@/components/molecules/ProductCutoutCard/ProductCutoutCard.vue'
import { useHomePage } from '@/composables/useHomePage'
import HomeHero from '@/components/organisms/HomeHero/HomeHero.vue'
import CarouselSection from '@/components/organisms/CarouselSection/CarouselSection.vue'
import HomeCollectionCta from '@/components/organisms/HomeCollectionCta/HomeCollectionCta.vue'
import TopPromoBar from '@/components/organisms/TopPromoBar/TopPromoBar.vue'
import DefaultTemplate from '@/components/templates/DefaultTemplate/DefaultTemplate.vue'

const { t } = useI18n()
const router = useRouter()
const {
  bestSetItems,
  bestSetSectionState,
  collectionItems,
  collectionSectionState,
  newArrivalItems,
  newArrivalSectionState,
  openBestSetItem,
  openCollectionItem,
  openPromoItem,
  openRecommendationItem,
  openNewArrivalItem,
  promoItems,
  promoSectionState,
  recommendationItems,
  recommendationSectionState,
} = useHomePage()

const DEFAULT_PLP_ROUTE = { name: 'plp' as const, params: { categorySlug: 'living-room' } }

function handleCreateAccountClick() {
  return router.push({ name: 'register' })
}

function handleCatalogueClick() {
  return router.push(DEFAULT_PLP_ROUTE)
}

const sectionResponsiveOptions = [
  {
    breakpoint: '1024px',
    numVisible: 3,
    numScroll: 1,
  },
  {
    breakpoint: '640px',
    numVisible: 1,
    numScroll: 1,
  },
]

const carouselSkeletonCardIndexes = [0, 1, 2, 3]
const newArrivalSkeletonIndexes = [0, 1, 2, 3]

function getProductActionAriaLabel(productTitle: string) {
  return `${t('productCutoutCard.openProductAriaLabel')}: ${productTitle}`
}
</script>

<template>
  <TopPromoBar />
  <DefaultTemplate>
    <main class="bg-surface-0 flex flex-col items-center gap-12 w-full mb-12">
      <HomeHero
        :items="promoItems"
        :is-promo-loading="promoSectionState !== 'ready'"
        @primary-click="handleCreateAccountClick"
        @secondary-click="handleCatalogueClick"
        @select-item="openPromoItem"
      />
      <div class="flex flex-col items-center w-[75%] gap-12">
        <div class="mx-auto h-[28rem] w-full sm:h-250">
          <HomeCollectionCta
            v-if="collectionSectionState === 'ready'"
            :title="t('homePage.collectionsTitle')"
            :items="collectionItems"
            @select-item="openCollectionItem"
          />
          <section
            v-else
            class="grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-6"
            :aria-label="t('homePage.collectionsTitle')"
          >
            <h2 class="text-color m-0 text-3xl font-bold uppercase leading-tight md:text-4xl">
              {{ t('homePage.collectionsTitle') }}
            </h2>
            <div class="grid min-h-0 grid-rows-[minmax(0,1fr)_minmax(0,1fr)] gap-4 md:gap-6">
              <div class="grid min-h-0 grid-cols-2 gap-4 md:gap-6">
                <Skeleton width="100%" height="100%" borderRadius="1.5rem" />
                <Skeleton width="100%" height="100%" borderRadius="1.5rem" />
              </div>
              <Skeleton width="100%" height="100%" borderRadius="1.5rem" />
            </div>
          </section>
        </div>
        <div class="w-full">
          <CarouselSection
            v-if="recommendationSectionState === 'ready'"
            :title="t('homePage.recommendationTitle')"
            :items="recommendationItems"
            item-key="id"
            :num-visible="4"
            :num-scroll="1"
            :show-indicators="false"
            :show-navigators="true"
            :responsive-options="sectionResponsiveOptions"
            content-class="px-3"
            @select-item="({ index }) => openRecommendationItem(index)"
            circular
          >
            <template #default="{ item, select }">
              <CollectionOverlayCard v-bind="item" clickable smaller-text @select="select" />
            </template>
          </CarouselSection>
          <section
            v-else
            class="flex h-full min-h-0 w-full flex-col gap-6"
            :aria-label="t('homePage.recommendationTitle')"
          >
            <h2 class="text-color m-0 text-3xl font-bold uppercase leading-tight md:text-4xl">
              {{ t('homePage.recommendationTitle') }}
            </h2>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div
                v-for="cardIndex in carouselSkeletonCardIndexes"
                :key="`recommendation-skeleton-${cardIndex}`"
                class="flex flex-col gap-3"
              >
                <Skeleton width="100%" height="18rem" borderRadius="1.5rem" />
                <Skeleton width="70%" height="1rem" />
              </div>
            </div>
          </section>
        </div>
        <div class="w-full">
          <CarouselSection
            v-if="bestSetSectionState === 'ready'"
            :title="t('homePage.bestSetsTitle')"
            :items="bestSetItems"
            item-key="id"
            :num-visible="4"
            :num-scroll="1"
            :show-indicators="false"
            :show-navigators="true"
            :responsive-options="sectionResponsiveOptions"
            content-class="px-3"
            @select-item="({ index }) => openBestSetItem(index)"
            circular
          >
            <template #default="{ item, select }">
              <CollectionOverlayCard v-bind="item" clickable smaller-text @select="select" />
            </template>
          </CarouselSection>
          <section
            v-else
            class="flex h-full min-h-0 w-full flex-col gap-6"
            :aria-label="t('homePage.bestSetsTitle')"
          >
            <h2 class="text-color m-0 text-3xl font-bold uppercase leading-tight md:text-4xl">
              {{ t('homePage.bestSetsTitle') }}
            </h2>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div
                v-for="cardIndex in carouselSkeletonCardIndexes"
                :key="`best-set-skeleton-${cardIndex}`"
                class="flex flex-col gap-3"
              >
                <Skeleton width="100%" height="18rem" borderRadius="1.5rem" />
                <Skeleton width="70%" height="1rem" />
              </div>
            </div>
          </section>
        </div>
        <div class="mx-auto w-full">
          <section
            v-if="newArrivalSectionState === 'ready'"
            class="flex w-full flex-col"
            :aria-label="t('homePage.newArrivalsTitle')"
          >
            <h2
              class="text-color mb-6 flex-none text-3xl font-bold uppercase leading-tight md:text-4xl"
            >
              {{ t('homePage.newArrivalsTitle') }}
            </h2>
            <div class="grid aspect-square w-full grid-cols-2 gap-4 overflow-hidden">
              <ProductCutoutCard
                v-for="(item, index) in newArrivalItems.slice(0, 4)"
                :key="`${item.title}-${index}`"
                :image="item.image"
                :title="item.title"
                :action-aria-label="getProductActionAriaLabel(item.title)"
                action-placement="bottom"
                hide-action-button-on-mobile
                image-fit="cover"
                clickable
                fill-height
                @select="openNewArrivalItem(index)"
              />
            </div>
          </section>
          <div v-else class="flex w-full flex-col" :aria-label="t('homePage.newArrivalsTitle')">
            <h2
              class="text-color mb-6 flex-none text-3xl font-bold uppercase leading-tight md:text-4xl"
            >
              {{ t('homePage.newArrivalsTitle') }}
            </h2>
            <section class="grid aspect-square w-full grid-cols-2 gap-4 overflow-hidden">
              <Skeleton
                v-for="cardIndex in newArrivalSkeletonIndexes"
                :key="`new-arrival-skeleton-${cardIndex}`"
                width="100%"
                height="100%"
                borderRadius="1.5rem"
              />
            </section>
          </div>
        </div>
      </div>
    </main>
  </DefaultTemplate>
</template>
