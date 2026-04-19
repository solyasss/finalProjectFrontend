import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ProductGallery from './ProductGallery.vue'

const images = [
  {
    url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    alt: 'Front view',
    width: 1200,
    height: 1200,
  },
  {
    url: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80',
    alt: 'Side view',
    width: 1200,
    height: 1200,
  },
]

const meta = {
  title: 'Organisms/ProductGallery',
  component: ProductGallery,
  tags: ['autodocs'],
  args: {
    images,
    name: 'LYNGÖR bed frame',
  },
} satisfies Meta<typeof ProductGallery>

export default meta

type Story = StoryObj<typeof meta>

export const MultipleImages: Story = {}

export const SingleImage: Story = {
  args: {
    images: images.slice(0, 1),
  },
}
