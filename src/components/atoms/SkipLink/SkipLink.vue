<script setup lang="ts">
import { useI18n } from 'vue-i18n'

withDefaults(
  defineProps<{
    targetId?: string
  }>(),
  {
    targetId: 'main-content',
  },
)

const { t } = useI18n()
</script>

<template>
  <a
    :href="`#${targetId}`"
    class="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-[9999] focus:rounded focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-contrast focus:shadow-lg focus:outline-none"
  >
    {{ t('a11y.skipToMain') }}
  </a>
</template>
