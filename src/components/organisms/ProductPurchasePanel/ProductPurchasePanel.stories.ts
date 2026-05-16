import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type { ProductDetails } from '@/api'
import ProductPurchasePanel from './ProductPurchasePanel.vue'

const product: ProductDetails = {
  id: 1,
  slug: 'lyngor-bed-frame',
  name: 'LYNGÖR bed frame',
  description: 'Layered comfort with a calm, low profile and a washable cover.',
  isActive: true,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  baseImageUrl: null,
  ratingAverage: 4.7,
  ratingCount: 91,
  categories: [],
  variants: [
    {
      id: 'var_white_160',
      sku: '100.01',
      color: 'white',
      price: '15999',
      stock: 10,
      images: [],
      weightKg: '24.5',
      widthCm: '160',
      heightCm: '35',
      depthCm: '200',
      attributes: {},
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
  ],
}

const meta = {
  title: 'Organisms/ProductPurchasePanel',
  component: ProductPurchasePanel,
  tags: ['autodocs'],
  args: {
    product,
    selectedVariant: product.variants[0],
    selectorGroups: [
      {
        key: 'color',
        label: 'Colour',
        presentation: 'swatch' as const,
        selectedValue: 'white',
        options: [
          { value: 'white', label: 'White', hex: '#ffffff', selected: true, disabled: false },
        ],
      },
    ],
    availability: [
      {
        type: 'DELIVERY',
        available: true,
        etaText: 'Delivered by Tuesday, 12 April',
        cost: { amountMinor: 19900, currency: 'UAH', formatted: '₴199' },
        message: 'Choose a date at checkout.',
      },
    ],
    quantity: 1,
    loadingAvailability: false,
    addingToCart: false,
    canAddToCart: true,
    availabilityError: null,
    ctaMessage: null,
  },
} satisfies Meta<typeof ProductPurchasePanel>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const CtaDisabled: Story = {
  args: {
    canAddToCart: false,
  },
}

export const SuccessMessage: Story = {
  args: {
    ctaMessage: { severity: 'success', text: 'Added to your basket.' },
  },
}

export const AvailabilityError: Story = {
  args: {
    availabilityError: 'We could not refresh fulfillment information right now.',
  },
}
