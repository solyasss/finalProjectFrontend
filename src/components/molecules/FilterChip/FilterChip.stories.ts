import type { Meta, StoryObj } from '@storybook/vue3'
import FilterChip from './FilterChip.vue'

const meta: Meta<typeof FilterChip> = {
  title: 'Molecules/FilterChip',
  component: FilterChip,
  tags: ['autodocs'],
  args: {
    label: 'Color: Black',
    disabled: false,
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}

export const WrappedRow: Story = {
  render: (args) => ({
    components: { FilterChip },
    setup() {
      return { args }
    },
    template: `
      <div class="flex max-w-md flex-wrap gap-2 p-4">
        <FilterChip v-bind="args" />
        <FilterChip label="Availability: In stock" />
        <FilterChip label="Price: 100-500" />
        <FilterChip label="Material: Oak veneer" />
      </div>
    `,
  }),
}
