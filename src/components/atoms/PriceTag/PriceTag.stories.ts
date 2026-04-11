import type { Meta, StoryObj } from '@storybook/vue3'
import PriceTag from './PriceTag.vue'

const meta: Meta<typeof PriceTag> = {
  title: 'Atoms/PriceTag',
  component: PriceTag,
  tags: ['autodocs'],
  argTypes: {
    currentPrice: { control: 'text' },
    previousPrice: { control: 'text' },
  },
  args: {
    currentPrice: '12$',
    size: 'large',
  },
}

export default meta
type Story = StoryObj<typeof PriceTag>

export const Default: Story = {}

export const WithPreviousPrice: Story = {
  args: {
    currentPrice: '30$',
    previousPrice: '45$',
  },
}

export const Compact: Story = {
  args: {
    currentPrice: '₴5,999',
    previousPrice: '₴6,999',
    size: 'compact',
  },
}
