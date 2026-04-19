import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type { CartLine, OrderSummary, OrderTrackingStep } from '@/api'
import OrderDetailsPanel from './OrderDetailsPanel.vue'

const order: OrderSummary = {
  orderId: 'ORD-2001',
  createdAt: '2026-04-14T08:45:00Z',
  status: 'PROCESSING',
  total: { amountMinor: 729900, currency: 'UAH', formatted: '₴7,299' },
  itemCount: 2,
}

const lines: CartLine[] = [
  {
    lineId: 'line-1',
    productId: 'prd-1',
    variantId: 'var-1',
    name: 'MALM chest of drawers',
    image: { url: 'https://via.placeholder.com/160', alt: 'Drawer unit', width: 160, height: 160 },
    unitPrice: { amountMinor: 359900, currency: 'UAH', formatted: '₴3,599' },
    quantity: 1,
    maxQuantity: 10,
    lineTotal: { amountMinor: 359900, currency: 'UAH', formatted: '₴3,599' },
  },
  {
    lineId: 'line-2',
    productId: 'prd-2',
    variantId: 'var-2',
    name: 'KALLAX shelving unit',
    image: { url: 'https://via.placeholder.com/160', alt: 'Shelf unit', width: 160, height: 160 },
    unitPrice: { amountMinor: 185000, currency: 'UAH', formatted: '₴1,850' },
    quantity: 2,
    maxQuantity: 10,
    lineTotal: { amountMinor: 370000, currency: 'UAH', formatted: '₴3,700' },
  },
]

const trackingSteps: OrderTrackingStep[] = [
  { key: 'placed', title: 'Order confirmed', completed: true, timestamp: '2026-04-14T08:45:00Z' },
  { key: 'packed', title: 'Packed for delivery', completed: false, timestamp: null },
]

const meta = {
  title: 'Organisms/OrderDetailsPanel',
  component: OrderDetailsPanel,
  tags: ['autodocs'],
  args: {
    order,
    lines,
    shippingAddress: {
      street: '15 Heroiv Avenue',
      city: 'Kyiv',
      postalCode: '02000',
      region: 'Kyiv region',
    },
    trackingSteps,
    trackingStatus: 'PROCESSING',
    trackingError: null,
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

export const TrackingUnavailable: Story = {
  args: {
    trackingSteps: [],
    trackingError: 'Tracking details are temporarily unavailable. Please try again later.',
  },
}
