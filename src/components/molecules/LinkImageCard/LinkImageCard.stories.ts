import type { Meta, StoryObj } from '@storybook/vue3'
import LinkImageCard from './LinkImageCard.vue'

const meta: Meta<typeof LinkImageCard> = {
  title: 'Molecules/LinkImageCard',
  component: LinkImageCard,
  tags: ['autodocs'],
  argTypes: {
    imageSrc: { control: 'text' },
    imageAlt: { control: 'text' },
    actionIcon: { control: 'text' },
    actionAriaLabel: { control: 'text' },
    showAction: { control: 'boolean' },
    clickable: { control: 'boolean' },
    onSelect: { action: 'select' },
  },
  args: {
    imageSrc:
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Dining room with wooden table and chandelier',
    actionIcon: 'pi pi-arrow-up-right',
    actionAriaLabel: 'Open collection',
    showAction: true,
    clickable: true,
  },
}

export default meta
type Story = StoryObj<typeof LinkImageCard>

export const Default: Story = {}

export const WithoutAction: Story = {
  args: {
    showAction: false,
  },
}
