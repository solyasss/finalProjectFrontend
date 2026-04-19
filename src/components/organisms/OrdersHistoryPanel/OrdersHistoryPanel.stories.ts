import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type { OrderSummary } from '@/api'
import OrdersHistoryPanel from './OrdersHistoryPanel.vue'

const orders: OrderSummary[] = [
  {
    orderId: 'ORD-1001',
    createdAt: '2026-04-11T09:00:00Z',
    status: 'SHIPPED',
    total: { amountMinor: 529900, currency: 'UAH', formatted: '₴5,299' },
    itemCount: 3,
  },
  {
    orderId: 'ORD-1002',
    createdAt: '2026-04-03T14:30:00Z',
    status: 'DELIVERED',
    total: { amountMinor: 189900, currency: 'UAH', formatted: '₴1,899' },
    itemCount: 1,
  },
]

const meta = {
  title: 'Organisms/OrdersHistoryPanel',
  component: OrdersHistoryPanel,
  tags: ['autodocs'],
  args: {
    orders,
    pagination: { total: 20, page: 1, limit: 10 },
    loading: false,
    error: null,
    currentPage: 1,
  },
} satisfies Meta<typeof OrdersHistoryPanel>

export default meta

type Story = StoryObj<typeof meta>

export const Populated: Story = {}

export const Empty: Story = {
  args: {
    orders: [],
    pagination: { total: 0, page: 1, limit: 10 },
  },
}

export const Loading: Story = {
  args: {
    orders: [],
    pagination: null,
    loading: true,
  },
}

export const Mobile: Story = {
  args: {
    orders,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}
