import type { Meta, StoryObj } from '@storybook/vue3-vite'
import FulfillmentOption from './FulfillmentOption.vue'

const meta = {
  title: 'Molecules/FulfillmentOption',
  component: FulfillmentOption,
  tags: ['autodocs'],
  args: {
    option: {
      type: 'DELIVERY',
      available: true,
      etaText: 'Delivered by Tuesday, 12 April',
      cost: { amountMinor: 19900, currency: 'UAH', formatted: '₴199' },
      message: 'Choose a date at checkout.',
    },
  },
} satisfies Meta<typeof FulfillmentOption>

export default meta

type Story = StoryObj<typeof meta>

export const Available: Story = {}

export const Unavailable: Story = {
  args: {
    option: {
      type: 'STORE_PICKUP',
      available: false,
      etaText: null,
      cost: null,
      message: 'Check another store or try delivery.',
    },
  },
}
