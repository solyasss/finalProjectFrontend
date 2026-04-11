import type { Meta, StoryObj } from '@storybook/vue3'
import RatingDisplay from './RatingDisplay.vue'

const meta: Meta<typeof RatingDisplay> = {
  title: 'Molecules/RatingDisplay',
  component: RatingDisplay,
  tags: ['autodocs'],
  argTypes: {
    average: { control: 'number' },
    count: { control: 'number' },
    size: { control: 'select', options: ['card', 'detail'] },
  },
  args: {
    average: 4.2,
    count: 128,
    size: 'card',
  },
}

export default meta

type Story = StoryObj<typeof RatingDisplay>

export const Default: Story = {}

export const NoRating: Story = {
  args: {
    average: null,
    count: 0,
  },
}

export const DetailSize: Story = {
  args: {
    average: 4.8,
    count: 892,
    size: 'detail',
  },
}
