<script setup lang="ts">
// ─── Types ────────────────────────────────────────────────────────────────────

type Size = 'sm' | 'md' | 'lg'
type Color = 'current' | 'brand' | 'white'

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  /** Diameter of the spinner */
  size?: Size
  /** Color of the spinning arc */
  color?: Color
  /** Screen-reader label — set to '' to hide the spinner from assistive tech */
  label?: string
}

withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'current',
  label: 'Loading…',
})

// ─── Style maps ───────────────────────────────────────────────────────────────

const SIZE_CLASSES: Record<Size, string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-10 w-10 border-[3px]',
}

const COLOR_CLASSES: Record<Color, string> = {
  current: 'border-current border-t-transparent',
  brand: 'border-brand-blue border-t-transparent',
  white: 'border-white border-t-transparent',
}
</script>

<template>
  <!--
    Pure CSS spinner — no third-party dependency, no SVG, no PrimeVue.
    A simple rotating border technique: full border in the chosen color,
    top border transparent → creates the "arc" illusion.
  -->
  <span
    role="status"
    :aria-label="label || undefined"
    :aria-hidden="label ? undefined : 'true'"
    class="inline-block animate-spin rounded-full"
    :class="[SIZE_CLASSES[size], COLOR_CLASSES[color]]"
  />
</template>
