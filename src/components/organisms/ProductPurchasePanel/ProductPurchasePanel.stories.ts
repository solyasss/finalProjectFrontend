import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type { ProductDetails } from '@/api'
import ProductPurchasePanel from './ProductPurchasePanel.vue'

const product: ProductDetails = {
  productId: 'prd_lyngor',
  slug: 'lyngor-bed-frame',
  name: 'LYNGÖR bed frame',
  description: 'Layered comfort with a calm, low profile and a washable cover.',
  series: 'Bedroom',
  badges: ['NEW'],
  rating: { average: 4.7, count: 91 },
  selectedVariantId: 'var_white_160',
  variants: [
    {
      variantId: 'var_white_160',
      sku: '100.01',
      name: 'White / 160x200',
      attributes: { color: 'white', size: '160x200' },
      images: [],
      price: { amountMinor: 1599900, currency: 'UAH', formatted: '₴15,999' },
      previousPrice: null,
    },
  ],
  variantAttributes: [
    {
      key: 'color',
      label: 'Colour',
      presentation: 'swatch' as const,
      options: [{ value: 'white', label: 'White', hex: '#ffffff' }],
    },
  ],
  detailsSections: [],
  documents: [],
  fulfillment: [],
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
