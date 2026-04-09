<script setup lang="ts">
import { computed } from 'vue'
import SearchBar from '@/components/molecules/SearchBar/SearchBar.vue'
import HomeHeroCta from '@/components/organisms/HomeHeroCta/HomeHeroCta.vue'

interface PromoItem {
  imageSrc: string
  imageAlt: string
  title: string
  subtitle?: string
  price: string
  badgeText?: string
}

interface Props {
  title?: string
  imageSrc?: string
  items?: PromoItem[]
}

const props = defineProps<Props>()

const title = computed(() => props.title ?? 'ВСЕ ДЛЯ ДОМУ')
const imageSrc = computed(() => props.imageSrc ?? '/HomeHero.jpg')
const items = computed<PromoItem[]>(() => props.items ?? [])
</script>

<template>
  <section
    class="bg-surface-0"
    :style="{
      backgroundImage: `url(${imageSrc})`,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
    }"
  >
    <div class="flex min-h-184 w-full flex-col px-4 py-6 md:px-6 lg:px-10 lg:py-10">
      <div class="mx-auto w-full max-w-230">
        <SearchBar />
      </div>

      <div class="flex flex-1 flex-col items-center justify-center pt-10 md:pt-12">
        <h1
          class="text-color text-center text-[clamp(2.75rem,8vw,5.5rem)] font-bold uppercase leading-none md:mb-10"
        >
          {{ title }}
        </h1>

        <div class="grid grid-cols-1 w-full lg:grid-cols-2 xl:grid-cols-3 md:ml-8 lg:ml-24">
            <HomeHeroCta :items="items" />
          <div />
        </div>
      </div>
    </div>
  </section>
</template>
