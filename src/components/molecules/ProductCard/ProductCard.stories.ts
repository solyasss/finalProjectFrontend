import type { Meta, StoryObj } from '@storybook/vue3'
import type { ProductCard as ApiProductCard } from '@/api'
import ProductCard from './ProductCard.vue'

const sampleProduct: ApiProductCard = {
  productId: 'prd_1',
  slug: 'billy-bookcase-white',
  name: 'BILLY Bookcase, white, 80x28x202 cm',
  shortDescription: 'A timeless storage piece with adjustable shelves for books and decor.',
  heroImage: {
    url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    alt: 'White bookcase in a bright living room',
    width: 900,
    height: 900,
  },
  price: {
    amountMinor: 599900,
    currency: 'UAH',
    formatted: '₴5,999',
  },
  previousPrice: {
    amountMinor: 699900,
    currency: 'UAH',
    formatted: '₴6,999',
  },
  badges: ['NEW', 'BEST_SELLER'],
  rating: {
    average: 4.4,
    count: 132,
  },
  variantPreview: {
    totalVariants: 3,
    swatches: [
      { variantId: 'var_1', hex: '#ffffff' },
      { variantId: 'var_2', hex: '#d9d3c7' },
    ],
  },
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
      rating: null,
    },
  },
}

export const WithoutDiscount: Story = {
  args: {
    product: {
      ...sampleProduct,
      previousPrice: null,
    },
  },
}

export const LongContent: Story = {
  args: {
    product: {
      ...sampleProduct,
      name: 'HAUGA Storage combination with shelves and cabinet for living room organization',
      shortDescription:
        'Versatile storage for books, ceramics, framed art, and everyday essentials with a calm neutral finish that blends into multiple room setups.',
    },
  },
}

export const NonInteractive: Story = {
  args: {
    clickable: false,
  },
}
