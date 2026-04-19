import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type { OrderTrackingStep } from '@/api'
import OrderTrackingTimeline from './OrderTrackingTimeline.vue'

const inProgressSteps: OrderTrackingStep[] = [
  {
    key: 'placed',
    title: 'Order confirmed',
    completed: true,
    timestamp: '2026-04-11T09:00:00Z',
  },
  {
    key: 'packed',
    title: 'Packed for delivery',
    completed: true,
    timestamp: '2026-04-12T11:30:00Z',
  },
  {
    key: 'transit',
    title: 'On the way',
    completed: false,
    timestamp: null,
  },
]

const deliveredSteps: OrderTrackingStep[] = [
  {
    key: 'placed',
    title: 'Order confirmed',
    completed: true,
    timestamp: '2026-04-03T09:00:00Z',
  },
  {
    key: 'shipped',
    title: 'Shipped',
    completed: true,
    timestamp: '2026-04-04T12:00:00Z',
  },
  {
    key: 'delivered',
    title: 'Delivered',
    completed: true,
    timestamp: '2026-04-05T16:00:00Z',
  },
]

const meta = {
  title: 'Organisms/OrderTrackingTimeline',
  component: OrderTrackingTimeline,
  tags: ['autodocs'],
  args: {
    steps: inProgressSteps,
    loading: false,
    error: null,
    status: 'SHIPPED',
  },
} satisfies Meta<typeof OrderTrackingTimeline>

export default meta

type Story = StoryObj<typeof meta>

export const InProgress: Story = {}

export const Delivered: Story = {
  args: {
    steps: deliveredSteps,
    status: 'DELIVERED',
  },
}

export const TimelineError: Story = {
  args: {
    steps: [],
    error: 'Tracking details are temporarily unavailable. Please try again later.',
  },
}

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}
