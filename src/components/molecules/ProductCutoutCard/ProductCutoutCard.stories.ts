import type { Meta, StoryObj } from '@storybook/vue3'
import ProductCutoutCard from './ProductCutoutCard.vue'

const meta: Meta<typeof ProductCutoutCard> = {
  title: 'Molecules/ProductCutoutCard',
  component: ProductCutoutCard,
  tags: ['autodocs'],
  argTypes: {
    imageSrc: { control: 'text' },
    imageAlt: { control: 'text' },
    title: { control: 'text' },
    clickable: { control: 'boolean' },
    background: { control: 'text' },
    showTitle: { control: 'boolean' },
    actionIcon: { control: 'text' },
    actionAriaLabel: { control: 'text' },
    actionPlacement: { control: 'select', options: ['bottom', 'right', 'none'] },
    onSelect: { action: 'select' },
  },
  args: {
    imageSrc:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Brown sofa on neutral background',
    title: 'Our New Collection',
    clickable: true,
    background: 'var(--color-gray-100)',
    showTitle: true,
    actionPlacement: 'bottom',
    actionAriaLabel: 'Open collection',
  },
}

export default meta
type Story = StoryObj<typeof ProductCutoutCard>

export const Default: Story = {}

export const ActionOnTheRight: Story = {
  args: {
    showTitle: false,
    actionPlacement: 'right',
  },
}

export const TitleWithoutAction: Story = {
  args: {
    showTitle: true,
    actionPlacement: 'none',
  },
}

export const NonInteractive: Story = {
  args: {
    clickable: false,
  },
}

export const NoBackgroundTint: Story = {
  args: {
    background: 'var(--color-brand-white)',
  },
}
