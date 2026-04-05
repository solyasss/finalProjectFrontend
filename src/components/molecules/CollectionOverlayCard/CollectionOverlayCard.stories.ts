import type { Meta, StoryObj } from '@storybook/vue3'
import CollectionOverlayCard from './CollectionOverlayCard.vue'

const meta: Meta<typeof CollectionOverlayCard> = {
  title: 'Molecules/CollectionOverlayCard',
  component: CollectionOverlayCard,
  tags: ['autodocs'],
  argTypes: {
    imageSrc: { control: 'text' },
    imageAlt: { control: 'text' },
    title: { control: 'text' },
    clickable: { control: 'boolean' },
    onSelect: { action: 'select' },
  },
  args: {
    imageSrc:
      'https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Dining room interior with a wooden table',
    title: 'Dining Collection',
    clickable: true,
  },
}

export default meta
type Story = StoryObj<typeof CollectionOverlayCard>

export const Default: Story = {}

export const LongTitle: Story = {
  args: {
    title: 'Living Room Collection with Accessories',
  },
}
