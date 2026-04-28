import type { Meta, StoryObj } from '@storybook/vue3'
import type { ProductCard as ApiProductCard } from '@/api'
import ProductCard from './ProductCard.vue'

const sampleProduct: ApiProductCard = {
  id: 1,
  slug: 'billy-bookcase-white',
  name: 'BILLY Bookcase, white, 80x28x202 cm',
  description: 'A timeless storage piece with adjustable shelves for books and decor.',
  isActive: true,
  createdAt: '2026-04-10T09:00:00Z',
  updatedAt: '2026-04-10T09:00:00Z',
  baseImageUrl:
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
  ratingAverage: 4.4,
  ratingCount: 132,
}

const meta: Meta<typeof ProductCard> = {
  title: 'Molecules/ProductCard',
  component: ProductCard,
  tags: ['autodocs'],
  argTypes: {
    product: { control: 'object' },
    clickable: { control: 'boolean' },
    onSelect: { action: 'select' },
  },
  args: {
    product: sampleProduct,
    clickable: true,
  },
}

export default meta

type Story = StoryObj<typeof ProductCard>

export const Default: Story = {}

export const WithoutRating: Story = {
  args: {
    product: {
      ...sampleProduct,
      ratingAverage: null,
      ratingCount: null,
    },
  },
}

export const WithoutDiscount: Story = {
  args: {
    product: {
      ...sampleProduct,
      ratingAverage: 4.4,
      ratingCount: 132,
    },
  },
}

export const LongContent: Story = {
  args: {
    product: {
      ...sampleProduct,
      name: 'HAUGA Storage combination with shelves and cabinet for living room organization',
      description:
        'Versatile storage for books, ceramics, framed art, and everyday essentials with a calm neutral finish that blends into multiple room setups.',
    },
  },
}

export const NonInteractive: Story = {
  args: {
    clickable: false,
  },
}
