import type { Meta, StoryObj } from '@storybook/vue3'
import type { ProductCard as ApiProductCard } from '@/api'
import ProductGrid from './ProductGrid.vue'

// ---------------------------------------------------------------------------
// Shared fixtures
// ---------------------------------------------------------------------------

const makeProduct = (
  overrides: Partial<ApiProductCard> & { productId: string; slug: string; name: string },
): ApiProductCard => ({
  shortDescription: 'A modern piece for every home.',
  heroImage: {
    url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80',
    alt: overrides.name,
    width: 900,
    height: 900,
  },
  price: { amountMinor: 299900, currency: 'UAH', formatted: '₴2,999' },
  previousPrice: null,
  badges: [],
  rating: { average: 4.2, count: 58 },
  variantPreview: null,
  ...overrides,
})

const PRODUCTS: ApiProductCard[] = [
  makeProduct({
    productId: 'prd_1',
    slug: 'billy-bookcase-white',
    name: 'BILLY Bookcase, white, 80×28×202 cm',
    shortDescription: 'Classic adjustable shelves for books and decor.',
    price: { amountMinor: 599900, currency: 'UAH', formatted: '₴5,999' },
    previousPrice: { amountMinor: 699900, currency: 'UAH', formatted: '₴6,999' },
    badges: ['NEW', 'BEST_SELLER'],
    rating: { average: 4.6, count: 132 },
    variantPreview: {
      totalVariants: 3,
      swatches: [
        { variantId: 'var_1', hex: '#ffffff' },
        { variantId: 'var_2', hex: '#d9d3c7' },
      ],
    },
  }),
  makeProduct({
    productId: 'prd_2',
    slug: 'kallax-shelf-unit',
    name: 'KALLAX Shelf unit, white, 77×147 cm',
    heroImage: {
      url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80',
      alt: 'KALLAX shelf unit',
      width: 900,
      height: 900,
    },
    price: { amountMinor: 489900, currency: 'UAH', formatted: '₴4,899' },
    badges: ['LAST_CHANCE'],
  }),
  makeProduct({
    productId: 'prd_3',
    slug: 'lack-side-table',
    name: 'LACK Side table, black, 55×55 cm',
    heroImage: {
      url: 'https://images.unsplash.com/photo-1538688423619-a81d3f23454b?auto=format&fit=crop&w=900&q=80',
      alt: 'Black side table',
      width: 900,
      height: 900,
    },
    price: { amountMinor: 89900, currency: 'UAH', formatted: '₴899' },
    rating: { average: 3.9, count: 24 },
  }),
  makeProduct({
    productId: 'prd_4',
    slug: 'poang-armchair',
    name: 'POÄNG Armchair, birch veneer / Knisa light beige',
    heroImage: {
      url: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=900&q=80',
      alt: 'Armchair in light beige',
      width: 900,
      height: 900,
    },
    price: { amountMinor: 1299900, currency: 'UAH', formatted: '₴12,999' },
    badges: ['MEMBER_PRICE'],
    rating: { average: 4.8, count: 301 },
    variantPreview: {
      totalVariants: 6,
      swatches: [
        { variantId: 'var_a', hex: '#e8dfc7' },
        { variantId: 'var_b', hex: '#5c4033' },
        { variantId: 'var_c', hex: '#2b2b2b' },
      ],
    },
  }),
  makeProduct({
    productId: 'prd_5',
    slug: 'malm-bed-frame',
    name: 'MALM Bed frame, high, white, 160×200 cm',
    heroImage: {
      url: 'https://images.unsplash.com/photo-1588046130717-0eb0c9a3ba15?auto=format&fit=crop&w=900&q=80',
      alt: 'White bed frame',
      width: 900,
      height: 900,
    },
    price: { amountMinor: 2199900, currency: 'UAH', formatted: '₴21,999' },
    previousPrice: { amountMinor: 2599900, currency: 'UAH', formatted: '₴25,999' },
    rating: { average: 4.5, count: 88 },
    variantPreview: {
      totalVariants: 2,
      swatches: [
        { variantId: 'var_w', hex: '#ffffff' },
        { variantId: 'var_o', hex: '#c8a96e' },
      ],
    },
  }),
  makeProduct({
    productId: 'prd_6',
    slug: 'hemnes-dresser',
    name: 'HEMNES Chest of 6 drawers, grey, 108×131 cm',
    heroImage: {
      url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80',
      alt: 'Grey chest of drawers',
      width: 900,
      height: 900,
    },
    price: { amountMinor: 3499900, currency: 'UAH', formatted: '₴34,999' },
    badges: ['NEW'],
    rating: null,
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
