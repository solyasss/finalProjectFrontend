import type { Meta, StoryObj } from '@storybook/vue3'
import PromoProductCard from './PromoProductCard.vue'

const meta: Meta<typeof PromoProductCard> = {
  title: 'Molecules/PromoProductCard',
  component: PromoProductCard,
  tags: ['autodocs'],
  argTypes: {
    imageSrc: { control: 'text' },
    imageAlt: { control: 'text' },
    title: { control: 'text' },
    subtitle: { control: 'text' },
    price: { control: 'text' },
    badgeText: { control: 'text' },
    clickable: { control: 'boolean' },
    onSelect: { action: 'select' },
  },
  args: {
    imageSrc:
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Soft brown decorative pillows',
    title: 'Pillows',
    subtitle: 'Bedroom collection with textured fabrics',
    price: '$12',
    badgeText: 'Top',
    clickable: true,
  },
}

export default meta
type Story = StoryObj<typeof PromoProductCard>

export const Default: Story = {}

export const WithoutBadge: Story = {
  args: {
    badgeText: '',
  },
}

export const CustomPrice: Story = {
  args: {
    price: '$89',
    title: 'Throws',
  },
}
