import { reactive } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import type { FilterDefinition } from '@/api'
import ProductFilters from './ProductFilters.vue'

const filters: FilterDefinition[] = [
  {
    key: 'color',
    label: 'Color',
    type: 'MULTI_SELECT',
    options: [
      { value: 'black', label: 'Black', count: 18 },
      { value: 'white', label: 'White', count: 9 },
      { value: 'oak', label: 'Oak', count: 5 },
    ],
    range: null,
  },
  {
    key: 'availability',
    label: 'In stock only',
    type: 'BOOLEAN',
    options: null,
    range: null,
  },
  {
    key: 'price',
    label: 'Price',
    type: 'RANGE',
    options: null,
    range: { min: 100, max: 5000, step: 100 },
  },
]

const meta: Meta<typeof ProductFilters> = {
  title: 'Organisms/ProductFilters',
  component: ProductFilters,
  tags: ['autodocs'],
  args: {
    filters,
    selectedFilters: {},
    activeChips: [],
    resultCount: 32,
    loading: false,
  },
}

export default meta
type Story = StoryObj<typeof meta>

function renderFilters(args: Record<string, unknown>) {
  return {
    components: { ProductFilters },
    setup() {
      const state = reactive({
        selectedFilters:
          (args.selectedFilters as Record<string, boolean | string | string[]>) ?? {},
        activeChips:
          (args.activeChips as Array<{
            key: string
            label: string
            value?: string
            displayLabel: string
          }>) ?? [],
      })

      return { args, state }
    },
    template: `
      <div class="p-4" style="max-width: 980px">
        <ProductFilters
          :filters="args.filters"
          :selected-filters="state.selectedFilters"
          :active-chips="state.activeChips"
          :result-count="args.resultCount"
          :loading="args.loading"
        />
      </div>
    `,
  }
}

export const Default: Story = {
  render: renderFilters,
}

export const ActiveFilters: Story = {
  render: renderFilters,
  args: {
    selectedFilters: {
      color: ['black', 'white'],
      availability: true,
      price: '100-500',
    },
    activeChips: [
      { key: 'color', label: 'Color', value: 'black', displayLabel: 'Black' },
      { key: 'color', label: 'Color', value: 'white', displayLabel: 'White' },
      { key: 'availability', label: 'In stock only', displayLabel: 'In stock only' },
      { key: 'price', label: 'Price', displayLabel: '100-500' },
    ],
  },
}

export const BooleanOnly: Story = {
  render: renderFilters,
  args: {
    filters: [filters[1]!],
    selectedFilters: { availability: true },
    activeChips: [{ key: 'availability', label: 'In stock only', displayLabel: 'In stock only' }],
    resultCount: 12,
  },
}

export const MobileStacked: Story = {
  render: renderFilters,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  args: {
    selectedFilters: {
      color: ['oak'],
      price: '500-1500',
    },
    activeChips: [
      { key: 'color', label: 'Color', value: 'oak', displayLabel: 'Oak' },
      { key: 'price', label: 'Price', displayLabel: '500-1500' },
    ],
  },
}
