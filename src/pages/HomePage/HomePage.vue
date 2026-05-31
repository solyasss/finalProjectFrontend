<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import CollectionOverlayCard from '@/components/molecules/CollectionOverlayCard/CollectionOverlayCard.vue'
import { useHomePage } from '@/composables/useHomePage'
import HomeHero from '@/components/organisms/HomeHero/HomeHero.vue'
import CarouselSection from '@/components/organisms/CarouselSection/CarouselSection.vue'
import HomeCollectionCta from '@/components/organisms/HomeCollectionCta/HomeCollectionCta.vue'
import NewArrivalGrid from '@/components/organisms/NewArrivalGrid/NewArrivalGrid.vue'
import TopPromoBar from '@/components/organisms/TopPromoBar/TopPromoBar.vue'
import DefaultTemplate from '@/components/templates/DefaultTemplate/DefaultTemplate.vue'

const { t } = useI18n()
const router = useRouter()
const {
  bestSetItems,
  collectionItems,
  newArrivalItems,
  openBestSetItem,
  openCollectionItem,
  openPromoItem,
  openRecommendationItem,
  openNewArrivalItem,
  promoItems,
  recommendationItems,
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
</script>

<template>
  <TopPromoBar />
  <DefaultTemplate>
    <main class="bg-surface-0 flex flex-col items-center gap-12 w-full mb-12">
      <HomeHero
        :items="promoItems"
        @primary-click="handleCreateAccountClick"
        @secondary-click="handleCatalogueClick"
        @select-item="openPromoItem"
      />
      <div class="flex flex-col items-center w-[75%] gap-12">
        <div class="mx-auto h-[28rem] w-full sm:h-250">
          <HomeCollectionCta
            :title="t('homePage.collectionsTitle')"
            :items="collectionItems"
            @select-item="openCollectionItem"
          />
        </div>
        <div class="w-full">
          <CarouselSection
            :title="t('homePage.recommendationTitle')"
            :items="recommendationItems"
            item-key="id"
            :num-visible="5"
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
        </div>
        <div class="w-full">
          <CarouselSection
            :title="t('homePage.bestSetsTitle')"
            :items="bestSetItems"
            item-key="id"
            :num-visible="5"
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
        </div>
        <div class="mx-auto h-[28rem] w-full sm:h-250">
          <NewArrivalGrid
            :title="t('homePage.newArrivalsTitle')"
            :items="newArrivalItems"
            @select-item="openNewArrivalItem"
          />
        </div>
      </div>
    </main>
  </DefaultTemplate>
</template>
