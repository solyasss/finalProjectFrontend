<script setup lang="ts">
import AppFooter from '@/components/organisms/AppFooter/AppFooter.vue'
import AppHeader from '@/components/organisms/AppHeader/AppHeader.vue'
import CollectionOverlayCard from '@/components/molecules/CollectionOverlayCard/CollectionOverlayCard.vue'
import HomeHero from '@/components/organisms/HomeHero/HomeHero.vue'
import CarouselSection from '@/components/organisms/CarouselSection/CarouselSection.vue'
import HomeCollectionCta from '@/components/organisms/HomeCollectionCta/HomeCollectionCta.vue'
import NewArrivalGrid from '@/components/organisms/NewArrivalGrid/NewArrivalGrid.vue'
import TopPromoBar from '@/components/organisms/TopPromoBar/TopPromoBar.vue'

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
    imageSrc:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Soft beige bedroom with layered textiles',
  },
  {
    imageSrc:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Bright living room with a neutral sofa',
  },
  {
    imageSrc:
      'https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Dining room with warm wood furniture',
  },
  {
    imageSrc:
      'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Minimal living area with modern chairs',
  },
]
</script>

<template>
  <div class="bg-surface-0 min-h-screen w-full">
    <TopPromoBar />
    <AppHeader />
    <main class="flex flex-col items-center gap-12 w-full mb-12">
      <HomeHero :items="promoItems" />
      <div class="flex flex-col items-center w-[75%] gap-12">
        <div class="mx-auto w-full h-250">
          <HomeCollectionCta
            title="Колекції"
            :items="promoItems"
            @select-item="(index) => console.log('Selected item index:', index)"
          />
        </div>
        <div>
          <CarouselSection
            title="Recommendation"
            :items="recommendationItems"
            :item-component="CollectionOverlayCard"
            :item-props="{ clickable: true }"
            item-key="id"
            :num-visible="6"
            :num-scroll="1"
            :show-indicators="false"
            :show-navigators="true"
            :responsive-options="sectionResponsiveOptions"
            content-class="px-3"
            @select-item="({ index }) => console.log('Recommendation item index:', index)"
            circular
          />
        </div>
        <div>
          <CarouselSection
            title="Best sets"
            :items="bestSetItems"
            :item-component="CollectionOverlayCard"
            :item-props="{ clickable: true }"
            item-key="id"
            :num-visible="6"
            :num-scroll="1"
            :show-indicators="false"
            :show-navigators="true"
            :responsive-options="sectionResponsiveOptions"
            content-class="px-3"
            @select-item="({ index }) => console.log('Best set item index:', index)"
            circular
          />
        </div>
        <div class="mx-auto h-250">
          <NewArrivalGrid
            title="New arrivals"
            :items="newArrivalItems"
            @select-item="(index) => console.log('New arrival item index:', index)"
          />
        </div>
      </div>
    </main>
    <AppFooter />
  </div>
</template>
