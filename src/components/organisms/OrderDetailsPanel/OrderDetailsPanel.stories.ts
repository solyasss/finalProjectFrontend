import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type { CartLine, OrderSummary } from '@/api'
import OrderDetailsPanel from './OrderDetailsPanel.vue'

const order: OrderSummary = {
  orderId: 'ORD-2001',
  createdAt: '2026-04-14T08:45:00Z',
  status: 'SHIPPED',
  total: { amountMinor: 729900, currency: 'UAH', formatted: '₴7,299' },
  itemCount: 2,
}

const lines: CartLine[] = [
  {
    id: 1,
    name: 'MALM chest of drawers',
    image: { url: 'https://via.placeholder.com/160', alt: 'Drawer unit', width: 160, height: 160 },
    unitPrice: { amountMinor: 359900, currency: 'UAH', formatted: '₴3,599' },
    quantity: 1,
    lineTotal: { amountMinor: 359900, currency: 'UAH', formatted: '₴3,599' },
  },
  {
    id: 2,
    name: 'KALLAX shelving unit',
    image: { url: 'https://via.placeholder.com/160', alt: 'Shelf unit', width: 160, height: 160 },
    unitPrice: { amountMinor: 185000, currency: 'UAH', formatted: '₴1,850' },
    quantity: 2,
    lineTotal: { amountMinor: 370000, currency: 'UAH', formatted: '₴3,700' },
  },
]

const meta = {
  title: 'Organisms/OrderDetailsPanel',
  component: OrderDetailsPanel,
  tags: ['autodocs'],
  args: {
    order,
    lines,
    shippingAddress: '15 Heroiv Avenue, Kyiv, 02000, Kyiv region',
  },
} satisfies Meta<typeof OrderDetailsPanel>

export default meta

type Story = StoryObj<typeof meta>

export const FullDetail: Story = {}

export const MissingShippingAddress: Story = {
  args: {
    shippingAddress: null,
  },
}

export const Delivered: Story = {
  args: {
    order: {
      ...order,
      status: 'DELIVERED',
    },
  },
}

export const Cancelled: Story = {
  args: {
    order: {
      ...order,
      status: 'CANCELLED',
    },
  },
}
