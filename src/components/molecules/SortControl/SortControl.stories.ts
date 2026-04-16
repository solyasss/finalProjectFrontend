import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import type { SortOption } from '@/api'
import SortControl from './SortControl.vue'

const options: Array<{ label: string; value: SortOption }> = [
  { label: 'Relevance', value: 'relevance' },
  { label: 'Price: low to high', value: 'price_asc' },
  { label: 'Price: high to low', value: 'price_desc' },
  { label: 'Top rated', value: 'rating' },
  { label: 'Newest arrivals', value: 'newest' },
]

const meta: Meta<typeof SortControl> = {
  title: 'Molecules/SortControl',
  component: SortControl,
  tags: ['autodocs'],
  args: {
    modelValue: '',
    options,
    disabled: false,
  },
}

export default meta
type Story = StoryObj<typeof meta>

function renderSortControl(args: Record<string, unknown>) {
  return {
    components: { SortControl },
    setup() {
      const value = ref<SortOption | ''>((args.modelValue as SortOption | '') ?? '')
      return { args, value }
    },
    template: `
      <div class="w-full p-4" style="max-width: 360px">
        <SortControl
          v-model="value"
          :options="args.options"
          :disabled="args.disabled"
        />
      </div>
    `,
  }
}

export const Default: Story = {
  render: renderSortControl,
}

export const Selected: Story = {
  render: renderSortControl,
  args: {
    modelValue: 'price_asc',
  },
}

export const Disabled: Story = {
  render: renderSortControl,
  args: {
    disabled: true,
    modelValue: 'rating',
  },
}

export const LongLabels: Story = {
  render: renderSortControl,
  args: {
    options: [
      {
        label: 'Recommended for rooms with layered lighting and flexible mood changes',
        value: 'relevance',
      },
      {
        label: 'Price from lowest visible offer to highest premium configuration',
        value: 'price_asc',
      },
    ],
  },
}
