import type { Meta, StoryObj } from '@storybook/vue3'
import CollectionOverlayCard from '@/components/molecules/CollectionOverlayCard/CollectionOverlayCard.vue'
import PromoProductCard from '@/components/molecules/PromoProductCard/PromoProductCard.vue'
import MoleculeCarousel from './MoleculeCarousel.vue'

const promoItems = [
  {
    id: 1,
    imageSrc:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Soft decorative pillows on a sofa',
    title: 'Pillows',
    subtitle: 'Bedroom collection with textured fabrics',
    price: '$12',
    badgeText: 'TOP',
  },
  {
    id: 2,
    imageSrc:
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Folded grey blanket on a sofa',
    title: 'Throws',
    subtitle: 'Layered neutrals for cooler evenings',
    price: '$30',
    badgeText: 'NEW',
  },
  {
    id: 3,
    imageSrc:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Neutral sofa in a bright living room',
    title: 'Sofas',
    subtitle: 'Clean silhouettes in warm fabrics',
    price: '$414',
    badgeText: 'TOP',
  },
]

const collectionItems = [
  {
    id: 1,
    imageSrc:
      'https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Dining room interior with a wooden table',
    title: 'Dining Collection',
  },
  {
    id: 2,
    imageSrc:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Bedroom interior with a soft bed',
    title: 'Bedroom Edit',
  },
  {
    id: 3,
    imageSrc:
      'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Light-toned living room with chairs',
    title: 'Living Room',
  },
]

const meta: Meta<typeof MoleculeCarousel> = {
  title: 'Molecules/MoleculeCarousel',
  component: MoleculeCarousel,
  tags: ['autodocs'],
  argTypes: {
    items: { control: 'object' },
    itemComponent: { control: false },
    itemProps: { control: 'object' },
    itemKey: { control: 'text' },
    numVisible: { control: 'number' },
    numScroll: { control: 'number' },
    circular: { control: 'boolean' },
    showIndicators: { control: 'boolean' },
    showNavigators: { control: 'boolean' },
    responsiveOptions: { control: 'object' },
    contentClass: { control: 'text' },
    'onSelect-item': { action: 'select-item' },
  },
  args: {
    items: promoItems,
    itemComponent: PromoProductCard,
    itemProps: { clickable: true },
    itemKey: 'id',
    numVisible: 1,
    numScroll: 1,
    circular: false,
    showIndicators: false,
    showNavigators: true,
    responsiveOptions: [],
    contentClass: 'px-2',
  },
  render: (args) => ({
    components: { MoleculeCarousel },
    setup() {
      return { args }
    },
    template: `
      <div class="mx-auto max-w-[28rem] px-4 py-8">
        <MoleculeCarousel v-bind="args" />
      </div>
    `,
  }),
}

export default meta
type Story = StoryObj<typeof MoleculeCarousel>

export const Default: Story = {}

export const PromoCards: Story = {
  args: {
    items: promoItems,
    itemComponent: PromoProductCard,
    itemProps: { clickable: true },
    contentClass: 'px-2',
  },
}

export const CollectionCards: Story = {
  args: {
    items: collectionItems,
    itemComponent: CollectionOverlayCard,
    itemProps: { clickable: true },
    contentClass: 'px-2',
  },
  render: (args) => ({
    components: { MoleculeCarousel },
    setup() {
      return { args }
    },
    template: `
      <div class="mx-auto max-w-[22rem] px-4 py-8">
        <MoleculeCarousel v-bind="args" />
      </div>
    `,
  }),
}

export const TwoUpWithIndicators: Story = {
  args: {
    items: promoItems,
    itemComponent: PromoProductCard,
    itemProps: { clickable: true },
    numVisible: 2,
    numScroll: 1,
    showIndicators: true,
    responsiveOptions: [
      {
        breakpoint: '1024px',
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: '640px',
        numVisible: 1,
        numScroll: 1,
      },
    ],
    contentClass: 'px-3',
  },
  render: (args) => ({
    components: { MoleculeCarousel },
    setup() {
      return { args }
    },
    template: `
      <div class="mx-auto max-w-5xl px-6 py-8">
        <MoleculeCarousel v-bind="args" />
      </div>
    `,
  }),
}
