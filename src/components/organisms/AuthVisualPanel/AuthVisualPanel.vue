<script setup lang="ts">
interface Props {
  imageSrc?: string
  eyebrow: string
  title: string
  description: string
}

const props = defineProps<Props>()
</script>

<template>
  <div
    class="relative min-h-full overflow-hidden bg-emphasis"
    :style="{
      backgroundImage: `url(${props.imageSrc})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }"
  >
    <div
      class="flex min-h-72 flex-col justify-end gap-4 px-6 py-8 text-white sm:px-8 lg:min-h-full lg:px-10 lg:py-12"
    >
      <p class="text-sm font-bold uppercase tracking-[0.2em] text-white/80">{{ props.eyebrow }}</p>
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
</template>
