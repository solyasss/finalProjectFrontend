<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
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
const { t } = useI18n()

// TODO: Remove
const emit = defineEmits<{
  (event: 'primary-click'): void
  (event: 'secondary-click'): void
  (event: 'select-item', index: number): void
}>()

const title = computed(() => props.title ?? t('homeHero.title'))
const imageSrc = computed(() => props.imageSrc ?? '/HomeHero.jpg')
const items = computed<PromoItem[]>(() => props.items ?? [])
</script>

<template>
  <section
    class="flex bg-surface-0"
    :style="{
      backgroundImage: `url(${imageSrc})`,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
    }"
  >
    <div class="flex min-h-184 w-full flex-col px-4 py-6 md:px-6 lg:px-10 lg:py-10">
      <div class="flex flex-1 flex-col items-center justify-center pt-10 gap-6 md:pt-12">
        <h1
          class="text-color text-center text-[clamp(2.75rem,8vw,5.5rem)] font-bold uppercase leading-none md:mb-10"
        >
          {{ title }}
        </h1>

        <div class="flex w-full justify-center lg:justify-start lg:pl-24">
          <div class="w-full lg:max-w-none lg:basis-[30%] lg:min-w-88">
            <HomeHeroCta
              :items="items"
              @primary-click="emit('primary-click')"
              @secondary-click="emit('secondary-click')"
              @select-item="emit('select-item', $event)"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
