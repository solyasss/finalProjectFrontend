<script setup lang="ts">
import Button from 'primevue/button'
import Message from 'primevue/message'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type {
  CreateProductReviewRequest,
  Pagination,
  ProductReview,
  RatingSummary,
  ReviewHistogramEntry,
} from '@/api'
import RatingDisplay from '@/components/molecules/RatingDisplay/RatingDisplay.vue'
import Review from '@/components/molecules/Review/Review.vue'
import WriteReview from '@/components/molecules/WriteReview/WriteReview.vue'

interface Props {
  summary?: RatingSummary | null
  histogram?: ReviewHistogramEntry[]
  reviews?: ProductReview[]
  pagination?: Pagination | null
  loading?: boolean
  error?: string | null
  authenticated?: boolean
  submitting?: boolean
  submitError?: string | null
  submitSuccess?: boolean
  canLoadMore?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  summary: null,
  histogram: () => [],
  reviews: () => [],
  pagination: null,
  loading: false,
  error: null,
  authenticated: false,
  submitting: false,
  submitError: null,
  submitSuccess: false,
  canLoadMore: false,
})

const emit = defineEmits<{
  (event: 'load-more'): void
  (event: 'request-auth'): void
  (event: 'submit-review', payload: CreateProductReviewRequest): void
}>()

const { t } = useI18n()

const totalReviews = computed(() => props.summary?.count ?? 0)

function getHistogramWidth(count: number) {
  if (totalReviews.value <= 0) {
    return '0%'
  }

  return `${Math.round((count / totalReviews.value) * 100)}%`
}
</script>

<template>
  <section id="product-reviews" class="grid gap-6 rounded-[2rem] bg-surface-50 p-5 md:p-8">
    <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div class="grid gap-3">
        <h2 class="m-0 text-2xl font-bold text-color md:text-3xl">
          {{ t('pdp.reviewsTitle') }}
        </h2>
        <RatingDisplay
          v-if="summary && summary.count > 0"
          :average="summary.average"
          :count="summary.count"
          size="detail"
        />
      </div>

      <WriteReview
        :authenticated="authenticated"
        :submitting="submitting"
        :submit-error="submitError"
        :success="submitSuccess"
        @request-auth="emit('request-auth')"
        @submit="emit('submit-review', $event)"
      />
    </div>

    <Message v-if="submitSuccess" severity="success">
      {{ t('pdp.reviewForm.success') }}
    </Message>

    <div
      v-if="summary && summary.count > 0"
      class="grid gap-6 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:items-start"
    >
      <div class="grid gap-3 rounded-3xl border border-surface bg-surface-0 p-5">
        <div
          v-for="entry in histogram"
          :key="entry.stars"
          class="grid grid-cols-[2.5rem_minmax(0,1fr)_2.5rem] items-center gap-3 text-sm"
        >
          <span class="font-medium text-color">{{ entry.stars }}/5</span>
          <div class="h-2 overflow-hidden rounded-full bg-surface-200">
            <div
              class="h-full rounded-full bg-surface-900 transition-[width]"
              :style="{ width: getHistogramWidth(entry.count) }"
            />
          </div>
          <span class="text-right text-muted-color">{{ entry.count }}</span>
        </div>
      </div>

      <div class="grid gap-4">
        <Message v-if="loading && !reviews.length" severity="secondary" variant="simple">
          {{ t('pdp.reviewsLoading') }}
        </Message>
        <Message v-else-if="error" severity="error">
          {{ error }}
        </Message>
        <Message v-else-if="!reviews.length" severity="secondary" variant="simple">
          {{ t('pdp.reviewsEmpty') }}
        </Message>

        <template v-else>
          <Review v-for="review in reviews" :key="review.reviewId" :review="review" />
          <Button
            v-if="canLoadMore"
            severity="secondary"
            outlined
            :label="t('pdp.loadMoreReviews')"
            @click="emit('load-more')"
          />
        </template>
      </div>
    </div>

    <div v-else class="grid gap-4">
      <Message v-if="loading" severity="secondary" variant="simple">
        {{ t('pdp.reviewsLoading') }}
      </Message>
      <Message v-else-if="error" severity="error">
        {{ error }}
      </Message>
      <Message v-else severity="secondary" variant="simple">
        {{ t('pdp.reviewsEmpty') }}
      </Message>
    </div>
  </section>
</template>
