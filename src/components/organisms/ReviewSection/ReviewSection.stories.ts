import { computed, ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type { ProductReview, RatingSummary, ReviewHistogramEntry } from '@/api'
import ReviewSection from './ReviewSection.vue'

const reviews: ProductReview[] = [
  {
    reviewId: 'review-1',
    rating: 5,
    title: 'Exactly what I wanted',
    body: 'The finish looks clean and the light works perfectly in a small reading corner.',
    authorName: 'Olya D.',
    createdAt: '2026-04-10T09:00:00Z',
    verifiedPurchase: true,
  },
  {
    reviewId: 'review-2',
    rating: 4,
    title: 'Very good overall',
    body: 'Easy to place and nice quality. I only wish the cable were a bit longer.',
    authorName: 'Max K.',
    createdAt: '2026-04-08T14:30:00Z',
    verifiedPurchase: false,
  },
]

const summary: RatingSummary = { average: 4.5, count: 2 }
const histogram: ReviewHistogramEntry[] = [
  { stars: 5, count: 1 },
  { stars: 4, count: 1 },
  { stars: 3, count: 0 },
  { stars: 2, count: 0 },
  { stars: 1, count: 0 },
]

const meta = {
  title: 'Organisms/ReviewSection',
  component: ReviewSection,
  tags: ['autodocs'],
  args: {
    summary,
    histogram,
    reviews,
    pagination: { total: 4, page: 1, limit: 2 },
    loading: false,
    error: null,
    authenticated: true,
    submitting: false,
    submitError: null,
    submitSuccess: false,
    canLoadMore: true,
  },
} satisfies Meta<typeof ReviewSection>

export default meta

type Story = StoryObj<typeof meta>

export const Populated: Story = {}

export const Loading: Story = {
  args: {
    loading: true,
    reviews: [],
    canLoadMore: false,
  },
}

export const Empty: Story = {
  args: {
    summary: { average: 0, count: 0 },
    histogram: [],
    reviews: [],
    pagination: { total: 0, page: 1, limit: 2 },
    canLoadMore: false,
  },
}

export const Unauthenticated: Story = {
  args: {
    authenticated: false,
  },
}

export const SubmissionFlow: Story = {
  render: (args) => ({
    components: { ReviewSection },
    setup() {
      const items = ref([...reviews])
      const currentSummary = ref({ ...summary })
      const currentHistogram = ref([...histogram])
      const submitting = ref(false)
      const submitSuccess = ref(false)
      const canLoadMore = computed(() => false)

      async function handleSubmit(payload: { rating: number; title?: string; body: string }) {
        submitting.value = true
        submitSuccess.value = false

        items.value = [
          {
            reviewId: 'review-3',
            rating: payload.rating,
            title: payload.title,
            body: payload.body,
            authorName: 'Story User',
            createdAt: '2026-04-13T10:00:00Z',
            verifiedPurchase: true,
          },
          ...items.value,
        ]

        currentSummary.value = {
          average: 4.7,
          count: items.value.length,
        }
        currentHistogram.value = [
          { stars: 5, count: 2 },
          { stars: 4, count: 1 },
          { stars: 3, count: 0 },
          { stars: 2, count: 0 },
          { stars: 1, count: 0 },
        ]

        submitting.value = false
        submitSuccess.value = true
      }

      return {
        args,
        items,
        currentSummary,
        currentHistogram,
        submitting,
        submitSuccess,
        canLoadMore,
        handleSubmit,
      }
    },
    template: `
      <div class="p-4">
        <ReviewSection
          v-bind="args"
          :reviews="items"
          :summary="currentSummary"
          :histogram="currentHistogram"
          :submitting="submitting"
          :submit-success="submitSuccess"
          :can-load-more="canLoadMore"
          @submit-review="handleSubmit"
        />
      </div>
    `,
  }),
}
