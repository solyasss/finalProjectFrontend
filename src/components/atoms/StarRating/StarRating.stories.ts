import type { Meta, StoryObj } from '@storybook/vue3'
import StarRating from './StarRating.vue'

const meta: Meta<typeof StarRating> = {
  title: 'Atoms/StarRating',
  component: StarRating,
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'number' },
    size: { control: 'select', options: ['card', 'detail'] },
  },
  args: {
    value: 4.2,
    size: 'card',
  },
}

export default meta

type Story = StoryObj<typeof StarRating>

export const Default: Story = {}

export const Empty: Story = {
  args: {
    value: 0,
  },
}

export const DetailSize: Story = {
  args: {
    value: 5,
    size: 'detail',
  },
}
