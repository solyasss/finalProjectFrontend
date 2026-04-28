<script setup lang="ts">
import Divider from 'primevue/divider'
import Image from 'primevue/image'

export interface DetailHeroStat {
  label: string
  value: string
}

interface Props {
  imageUrl?: string | null
  imageAlt: string
  noImageLabel: string
  eyebrow: string
  title: string
  description: string
  stats: DetailHeroStat[]
  imageColumnClass?: string
  contentColumnClass?: string
}

withDefaults(defineProps<Props>(), {
  imageUrl: null,
  imageColumnClass: 'lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]',
  contentColumnClass: 'lg:py-2',
})
</script>

<template>
  <article
    class="grid gap-6 rounded-3xl border border-surface bg-surface-0 p-4 md:p-6 lg:gap-8"
    :class="imageColumnClass"
  >
    <div class="overflow-hidden rounded-2xl bg-surface-100">
      <div v-if="imageUrl" class="h-full min-h-[260px]">
        <Image
          :src="imageUrl"
          :alt="imageAlt"
          :pt="{
            root: { style: { display: 'block', width: '100%', height: '100%' } },
            image: {
              style: {
                display: 'block',
                width: '100%',
                height: '100%',
                minHeight: '16.25rem',
                objectFit: 'cover',
              },
            },
          }"
        />
      </div>
      <div
        v-else
        class="flex min-h-[260px] items-center justify-center p-6 text-sm text-muted-color"
      >
        {{ noImageLabel }}
      </div>
    </div>

    <div class="grid content-start gap-5" :class="contentColumnClass">
      <div class="space-y-3">
        <p class="text-sm font-semibold uppercase tracking-[0.16em] text-muted-color">
          {{ eyebrow }}
        </p>
        <h1 class="text-3xl font-bold text-color md:text-4xl">
          {{ title }}
        </h1>
        <p class="text-base leading-7 text-muted-color">
          {{ description }}
        </p>
      </div>

      <Divider />

      <dl class="grid gap-4 sm:grid-cols-2">
        <div v-for="stat in stats" :key="stat.label" class="grid gap-1">
          <dt class="text-sm text-muted-color">{{ stat.label }}</dt>
          <dd class="text-lg font-semibold text-color">{{ stat.value }}</dd>
        </div>
      </dl>
    </div>
  </article>
</template>
