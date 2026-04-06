<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

interface Props {
  label: string
  href?: string
}

const props = defineProps<Props>()

const href = computed(() => props.href ?? '#')
const rootRef = ref<HTMLElement | null>(null)
const sampleRef = ref<HTMLElement | null>(null)
const groupRef = ref<HTMLElement | null>(null)
const animationDuration = ref(8)
const groupWidth = ref(0)
const repeatCount = ref(2)

const PIXELS_PER_SECOND = 80

let resizeObserver: ResizeObserver | null = null

function updateAnimationMetrics() {
  const rootWidth = rootRef.value?.clientWidth ?? 0
  const sampleWidth = sampleRef.value?.clientWidth ?? 0

  if (!rootWidth || !sampleWidth) return

  repeatCount.value = Math.max(2, Math.ceil(rootWidth / sampleWidth) + 1)

  requestAnimationFrame(() => {
    const nextGroupWidth = groupRef.value?.clientWidth ?? 0

    if (!nextGroupWidth) return

    groupWidth.value = nextGroupWidth
    animationDuration.value = nextGroupWidth / PIXELS_PER_SECOND
  })
}

onMounted(() => {
  updateAnimationMetrics()

  resizeObserver = new ResizeObserver(() => {
    updateAnimationMetrics()
  })

  if (rootRef.value) resizeObserver.observe(rootRef.value)
  if (sampleRef.value) resizeObserver.observe(sampleRef.value)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
})
</script>

<template>
  <!-- TODO: Replace href with promo page -->
  <a
    ref="rootRef"
    :href="href"
    class="promo-strip-item text-primary-contrast block w-full whitespace-nowrap text-sm font-medium no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-contrast"
  >
    <span
      class="promo-strip-item__marquee"
      :style="{
        '--promo-duration': `${animationDuration}s`,
        '--promo-group-width': `${groupWidth}px`,
      }"
    >
      <span ref="groupRef" class="promo-strip-item__group">
        <span
          v-for="index in repeatCount"
          :key="`primary-${index}`"
          class="promo-strip-item__label"
        >
          {{ label }}
        </span>
      </span>
      <span class="promo-strip-item__group" aria-hidden="true">
        <span
          v-for="index in repeatCount"
          :key="`duplicate-${index}`"
          class="promo-strip-item__label"
        >
          {{ label }}
        </span>
      </span>
    </span>
    <span ref="sampleRef" class="promo-strip-item__sample" aria-hidden="true">{{ label }}</span>
  </a>
</template>

<style scoped>
.promo-strip-item {
  position: relative;
  overflow: hidden;
  line-height: 1.25;
  min-height: 1.25em;
}

.promo-strip-item__marquee {
  display: flex;
  width: max-content;
  animation: promo-strip-slide var(--promo-duration, 8s) linear infinite;
}

.promo-strip-item__group {
  display: flex;
  flex: none;
}

.promo-strip-item__label {
  display: inline-flex;
  flex: none;
  padding-right: 1.5rem;
}

.promo-strip-item__sample {
  position: absolute;
  visibility: hidden;
  pointer-events: none;
}

@keyframes promo-strip-slide {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(calc(-1 * var(--promo-group-width, 0px)));
  }
}
</style>
