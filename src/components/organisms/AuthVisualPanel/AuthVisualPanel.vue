<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import BackButton from '@/components/atoms/BackButton/BackButton.vue'

interface Props {
  imageSrc?: string
  eyebrow: string
  title: string
  description: string
}

const props = defineProps<Props>()
const { t } = useI18n()
</script>

<template>
  <div
    class="min-h-full overflow-hidden bg-emphasis"
    :style="{
      backgroundImage: `url(${props.imageSrc})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }"
  >
    <div class="flex min-h-72 h-full flex-col px-8 py-8 text-white">
      <div>
        <BackButton :label="t('common.back')" :to="{ name: 'home' }" variant="link" inverted />
      </div>

      <div class="mt-6 flex flex-col gap-4">
        <p class="text-sm font-bold uppercase tracking-[0.2em] text-white/80">
          {{ props.eyebrow }}
        </p>
        <div class="max-w-xl space-y-4">
          <h1 class="text-[clamp(2rem,5vw,4.25rem)] font-bold leading-[0.92] text-white">
            {{ props.title }}
          </h1>
          <p class="max-w-lg text-sm leading-6 text-white/85 md:text-base">
            {{ props.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
