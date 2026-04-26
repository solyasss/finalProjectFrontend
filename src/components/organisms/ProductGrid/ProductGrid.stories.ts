import type { Meta, StoryObj } from '@storybook/vue3'
import type { ProductCard as ApiProductCard } from '@/api'
import ProductGrid from './ProductGrid.vue'

// ---------------------------------------------------------------------------
// Shared fixtures
// ---------------------------------------------------------------------------

const makeProduct = (
  overrides: Partial<ApiProductCard> & { id: number; slug: string; name: string },
): ApiProductCard => ({
  description: 'A modern piece for every home.',
  isActive: true,
  createdAt: '2026-04-10T09:00:00Z',
  updatedAt: '2026-04-10T09:00:00Z',
  baseImageUrl:
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80',
  ratingAverage: 4.2,
  ratingCount: 58,
  ...overrides,
})

const PRODUCTS: ApiProductCard[] = [
  makeProduct({
    id: 1,
    slug: 'billy-bookcase-white',
    name: 'BILLY Bookcase, white, 80×28×202 cm',
    description: 'Classic adjustable shelves for books and decor.',
    ratingAverage: 4.6,
    ratingCount: 132,
  }),
  makeProduct({
    id: 2,
    slug: 'kallax-shelf-unit',
    name: 'KALLAX Shelf unit, white, 77×147 cm',
    baseImageUrl:
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80',
  }),
  makeProduct({
    id: 3,
    slug: 'lack-side-table',
    name: 'LACK Side table, black, 55×55 cm',
    baseImageUrl:
      'https://images.unsplash.com/photo-1538688423619-a81d3f23454b?auto=format&fit=crop&w=900&q=80',
    ratingAverage: 3.9,
    ratingCount: 24,
  }),
  makeProduct({
    id: 4,
    slug: 'poang-armchair',
    name: 'POÄNG Armchair, birch veneer / Knisa light beige',
    baseImageUrl:
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=900&q=80',
    ratingAverage: 4.8,
    ratingCount: 301,
  }),
  makeProduct({
    id: 5,
    slug: 'malm-bed-frame',
    name: 'MALM Bed frame, high, white, 160×200 cm',
    baseImageUrl:
      'https://images.unsplash.com/photo-1588046130717-0eb0c9a3ba15?auto=format&fit=crop&w=900&q=80',
    ratingAverage: 4.5,
    ratingCount: 88,
  }),
  makeProduct({
    id: 6,
    slug: 'hemnes-dresser',
    name: 'HEMNES Chest of 6 drawers, grey, 108×131 cm',
    baseImageUrl:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80',
    ratingAverage: null,
    ratingCount: null,
  }),
]

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta<typeof ProductGrid> = {
  title: 'Organisms/ProductGrid',
  component: ProductGrid,
  tags: ['autodocs'],
  parameters: {
    actions: {
      handles: ['select-product'],
    },
  },
  argTypes: {
    products: { control: 'object' },
  },
  args: {
    products: PRODUCTS,
  },
}

export default meta

type Story = StoryObj<typeof meta>

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/** Full grid — 6 products, all variants of badge / rating / price states */
export const Default: Story = {}

/** Single product — useful for checking card stretching in a 4-col grid */
export const SingleItem: Story = {
  args: {
    products: PRODUCTS.slice(0, 1),
  },
}

/** Two products — checks even/odd column behaviour on mobile (2-col) */
export const TwoItems: Story = {
  args: {
    products: PRODUCTS.slice(0, 2),
  },
}

/** Empty state — grid renders nothing; parent page should handle this */
export const Empty: Story = {
  args: {
    products: [],
  },
}
