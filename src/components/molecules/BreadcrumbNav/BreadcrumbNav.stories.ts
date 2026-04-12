import type { Meta, StoryObj } from '@storybook/vue3-vite'
import BreadcrumbNav from './BreadcrumbNav.vue'

const meta = {
  title: 'Molecules/BreadcrumbNav',
  component: BreadcrumbNav,
  tags: ['autodocs'],
  args: {
    items: [
      { label: 'Living room', route: { name: 'plp', params: { categorySlug: 'living-room' } } },
      { label: 'Coffee tables', route: { name: 'plp', params: { categorySlug: 'coffee-tables' } } },
    ],
    currentLabel: 'LISTERBY Coffee table',
  },
} satisfies Meta<typeof BreadcrumbNav>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
