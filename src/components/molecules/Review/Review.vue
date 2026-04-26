<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import Tag from 'primevue/tag'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import StarRating from '@/components/atoms/StarRating/StarRating.vue'
import type { ProductReview } from '@/api'

interface Props {
  review: ProductReview
}

const props = defineProps<Props>()

const { d, t } = useI18n()

const formattedDate = computed(() => {
  const date = new Date(props.review.createdAt)
  return Number.isNaN(date.getTime()) ? props.review.createdAt : d(date, 'short')
})

const hasTitle = computed(() => Boolean(props.review.title?.trim()))
const displayName = computed(() => props.review.authorName || `User #${props.review.userId}`)
</script>

<template>
  <article class="grid gap-3 rounded-3xl border border-surface bg-surface-0 p-5 md:p-6">
    <header class="flex flex-wrap items-start justify-between gap-3">
      <div class="grid gap-2">
        <div class="flex flex-wrap items-center gap-2">
          <h3 class="m-0 text-base font-bold text-color">
            {{ displayName }}
          </h3>
          <Tag
            v-if="review.verifiedPurchase"
            severity="secondary"
            :value="t('pdp.verifiedPurchase')"
          />
        </div>
        <StarRating :value="review.rating" size="card" />
      </div>

      <p class="m-0 text-sm text-muted-color">
        {{ formattedDate }}
      </p>
    </header>

    <h4 v-if="hasTitle" class="m-0 text-base font-bold text-color">
      {{ review.title }}
    </h4>

    <p class="m-0 whitespace-pre-line text-sm leading-6 text-muted-color md:text-base">
      {{ review.text }}
    </p>
  </article>
</template>
