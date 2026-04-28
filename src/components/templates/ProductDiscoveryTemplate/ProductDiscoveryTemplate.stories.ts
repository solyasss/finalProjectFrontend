import type { Meta, StoryObj } from '@storybook/vue3'
import type { FilterDefinition, ProductCard, SortOption } from '@/api'
import type {
  ProductDiscoveryFilterChip,
  ProductDiscoverySelectedFilters,
} from '@/composables/useProductDiscoveryListing'
import ProductDiscoveryTemplate from './ProductDiscoveryTemplate.vue'

type SortControlOption = {
  label: string
  value: SortOption
}

const PRODUCTS: ProductCard[] = [
  {
    id: 1,
    slug: 'billy-bookcase-white',
    name: 'BILLY Bookcase, white, 80×28×202 cm',
    description: 'Classic adjustable shelves for books and decor.',
    isActive: true,
    createdAt: '2026-04-01T10:00:00.000Z',
    updatedAt: '2026-04-01T10:00:00.000Z',
    baseImageUrl:
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80',
    ratingAverage: 4.6,
    ratingCount: 132,
  },
  {
    id: 2,
    slug: 'kallax-shelf-unit',
    name: 'KALLAX Shelf unit, white, 77×147 cm',
    description: 'Simple open storage for living rooms and home offices.',
    isActive: true,
    createdAt: '2026-04-01T10:00:00.000Z',
    updatedAt: '2026-04-01T10:00:00.000Z',
    baseImageUrl:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80',
    ratingAverage: 4.2,
    ratingCount: 58,
  },
]

const FILTERS: FilterDefinition[] = [
  {
    key: 'color',
    label: 'Color',
    type: 'MULTI_SELECT',
    options: [
      { value: 'white', label: 'White', count: 12 },
      { value: 'black', label: 'Black', count: 8 },
    ],
  },
  {
    key: 'availability',
    label: 'In stock only',
    type: 'BOOLEAN',
  },
]

const SELECTED_FILTERS: ProductDiscoverySelectedFilters = {
  color: ['white'],
  availability: true,
}

const ACTIVE_FILTER_CHIPS: ProductDiscoveryFilterChip[] = [
  {
    key: 'color',
    label: 'Color',
    value: 'white',
    displayLabel: 'White',
  },
  {
    key: 'availability',
    label: 'In stock only',
    displayLabel: 'In stock only',
  },
]

const SORT_OPTIONS: SortControlOption[] = [
  { label: 'Recommended', value: 'relevance' },
  { label: 'Price: low to high', value: 'price_asc' },
  { label: 'Price: high to low', value: 'price_desc' },
]

const meta: Meta<typeof ProductDiscoveryTemplate> = {
  title: 'Templates/ProductDiscoveryTemplate',
  component: ProductDiscoveryTemplate,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    eyebrow: 'Product discovery',
    title: 'Living room storage',
    loading: false,
    error: null,
    products: PRODUCTS,
    filters: FILTERS,
    selectedFilters: SELECTED_FILTERS,
    activeFilterChips: ACTIVE_FILTER_CHIPS,
    resultCount: 24,
    currentPage: 1,
    paginationTotal: 24,
    paginationLimit: 12,
    sort: 'relevance',
    sortOptions: SORT_OPTIONS,
    loadingMessage: 'Loading products…',
    emptyMessage: 'No products found.',
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const WithFiltersAndSorting: Story = {}

export const WithoutControls: Story = {
  args: {
    filters: [],
    selectedFilters: {},
    activeFilterChips: [],
    sort: '',
    sortOptions: [],
  },
}
