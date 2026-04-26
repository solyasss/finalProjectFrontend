import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type { ProductReview } from '@/api'
import Review from './Review.vue'

const baseReview: ProductReview = {
  id: 1,
  rating: 5,
  title: 'Beautiful warm light',
  text: 'This lamp feels sturdy, easy to place, and gives the room a softer evening mood.',
  status: 'approved',
  userId: 101,
  productId: 501,
  authorName: 'Olya D.',
  createdAt: '2026-04-10T09:00:00Z',
  updatedAt: '2026-04-10T09:00:00Z',
  deletedAt: null,
  verifiedPurchase: false,
}

const meta = {
  title: 'Molecules/Review',
  component: Review,
  tags: ['autodocs'],
  args: {
    review: baseReview,
  },
} satisfies Meta<typeof Review>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const VerifiedPurchase: Story = {
  args: {
    review: {
      ...baseReview,
      verifiedPurchase: true,
    },
  },
}

export const LongContent: Story = {
  args: {
    review: {
      ...baseReview,
      title: null,
      text: 'We placed this lamp in a reading corner next to a textured chair and a small side table. The light is soft enough for late evenings, but still bright enough to read comfortably. The base feels stable, the finish looks clean, and it did not take long to assemble. I would happily buy the same model again for another room.',
    },
  },
}
