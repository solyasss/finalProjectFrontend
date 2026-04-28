<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ProductSetSummary } from '@/api'
import InteractiveImageCard from '@/components/molecules/InteractiveImageCard/InteractiveImageCard.vue'

interface Props {
  productSet: ProductSetSummary
  clickable?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (event: 'select', productSet: ProductSetSummary): void
}>()

const { t } = useI18n()

const isClickable = computed(() => props.clickable ?? true)

function handleSelect() {
  if (!isClickable.value) {
    return
  }

  emit('select', props.productSet)
}
</script>

<template>
  <InteractiveImageCard
    :image-src="productSet.imageUrl"
    :image-alt="productSet.name"
    :no-image-label="t('productSetCard.noImage')"
    :clickable="isClickable"
    content-class="grid content-start gap-3 p-4"
    @select="handleSelect"
  >
    <div class="space-y-2">
      <h2 class="line-clamp-2 text-base font-bold text-color md:text-lg">
        {{ productSet.name }}
      </h2>
      <p v-if="productSet.description" class="line-clamp-3 text-sm leading-6 text-muted-color">
        {{ productSet.description }}
      </p>
    </div>
  </InteractiveImageCard>
</template>
