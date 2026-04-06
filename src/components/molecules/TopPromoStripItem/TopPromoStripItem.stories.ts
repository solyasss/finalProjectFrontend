import type { Meta, StoryObj } from '@storybook/vue3'
import TopPromoStripItem from './TopPromoStripItem.vue'

const meta: Meta<typeof TopPromoStripItem> = {
  title: 'Molecules/TopPromoStripItem',
  component: TopPromoStripItem,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    href: { control: 'text' },
  },
  args: {
    label: '#все_для_дому',
    href: '#',
  },
  render: (args) => ({
    components: { TopPromoStripItem },
    setup() {
      return { args }
    },
    template:
      '<div class="flex min-h-12 items-center bg-primary px-4"><TopPromoStripItem v-bind="args" /></div>',
  }),
}

export default meta
type Story = StoryObj<typeof TopPromoStripItem>

export const Default: Story = {}

export const BuyNow: Story = {
  args: {
    label: '#buy now',
  },
}
