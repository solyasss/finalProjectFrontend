<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'
import Carousel from 'primevue/carousel'
import { useI18n } from 'vue-i18n'
import PromoProductCard from '@/components/molecules/PromoProductCard/PromoProductCard.vue'

interface PromoItem {
  imageSrc: string
  imageAlt: string
  title: string
  subtitle?: string
  price: string
  badgeText?: string
}

interface Props {
  primaryActionLabel?: string
  secondaryActionLabel?: string
  items?: PromoItem[]
  promoPrefix?: string
  promoHighlight?: string
  promoSuffix?: string
}

const props = defineProps<Props>()
const { t } = useI18n()

const emit = defineEmits<{
  (event: 'primary-click'): void
  (event: 'secondary-click'): void
  (event: 'select-item', index: number): void
}>()

const primaryActionLabel = computed(
  () => props.primaryActionLabel ?? t('homeHeroCta.primaryAction'),
)
const secondaryActionLabel = computed(
  () => props.secondaryActionLabel ?? t('homeHeroCta.secondaryAction'),
)
const items = computed<PromoItem[]>(() => props.items ?? [])
const promoPrefix = computed(() => props.promoPrefix ?? t('homeHeroCta.promoPrefix'))
const promoHighlight = computed(() => props.promoHighlight ?? t('homeHeroCta.promoHighlight'))
const promoSuffix = computed(() => props.promoSuffix ?? t('homeHeroCta.promoSuffix'))

function handleSelectItem(index: number) {
  emit('select-item', index)
}
</script>

<template>
  <!-- TODO: Improve Mobile Render -->
  <section class="grid grid-cols-1 gap-4" :aria-label="t('homeHeroCta.ariaLabel')">
    <div class="flex flex-col flex-wrap items-center gap-6 mb-2 md:flex-row">
      <div>
        <Button
          type="button"
          :label="primaryActionLabel"
          :pt="{
            root: {
              style: {
                minHeight: '3rem',
                border: 'none',
                borderRadius: '9999px',
                background: 'var(--p-text-color)',
                color: 'var(--p-surface-0)',
                padding: '0.875rem 2rem',
                fontSize: '0.95rem',
                fontWeight: '600',
                textTransform: 'uppercase',
              },
            },
            label: {
              style: {
                fontWeight: '600',
              },
            },
          }"
          @click="emit('primary-click')"
        />
      </div>

      <div class="hidden md:block">
        <Button
          type="button"
          :label="secondaryActionLabel"
          icon="pi pi-chevron-down"
          icon-pos="right"
          :pt="{
            root: {
              style: {
                minHeight: '3rem',
                border: '1px solid var(--p-text-color)',
                borderRadius: '9999px',
                background: 'transparent',
                color: 'var(--p-text-color)',
                padding: '0.875rem 2rem',
                fontSize: '0.95rem',
                fontWeight: '500',
                textTransform: 'uppercase',
              },
            },
            label: {
              style: {
                fontWeight: '500',
              },
            },
          }"
          @click="emit('secondary-click')"
        />
      </div>
    </div>

    <!-- Mobile (< md): 1-item carousel -->
    <div class="w-full md:hidden">
      <Carousel :value="items" :num-visible="1" :num-scroll="1">
        <template #item="{ data, index }">
          <div class="px-1">
            <PromoProductCard
              :image-src="data.imageSrc"
              :image-alt="data.imageAlt"
              :title="data.title"
              :subtitle="data.subtitle"
              :price="data.price"
              :badge-text="data.badgeText ?? t('homeHeroCta.promoBadgeFallback')"
              clickable
              @select="handleSelectItem(index)"
            />
          </div>
        </template>
      </Carousel>
    </div>

    <!-- md+: 3-column grid -->
    <div class="hidden md:grid md:grid-cols-3 md:gap-12">
      <PromoProductCard
        v-for="(item, index) in items"
        :key="`${item.title}-${index}`"
        :image-src="item.imageSrc"
        :image-alt="item.imageAlt"
        :title="item.title"
        :subtitle="item.subtitle"
        :price="item.price"
        :badge-text="item.badgeText ?? t('homeHeroCta.promoBadgeFallback')"
        clickable
        @select="handleSelectItem(index)"
      />
    </div>

    <p class="text-color text-sm">
      <span>{{ promoPrefix }}</span>
      <strong class="font-semibold"> {{ promoHighlight }} </strong>
      <span>{{ promoSuffix }}</span>
    </p>
  </section>
</template>
