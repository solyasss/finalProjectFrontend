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
    actionIcon: { control: 'text' },
    actionAriaLabel: { control: 'text' },
    actionPlacement: { control: 'select', options: ['bottom', 'right', 'none'] },
    imageFit: {
      control: 'select',
      options: ['crop', 'fit', 'contain', 'stretch', 'cover', 'fill', 'none', 'scale-down'],
    },
    fillHeight: { control: 'boolean' },
    onSelect: { action: 'select' },
  },
  args: {
    imageSrc:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Brown sofa on neutral background',
    title: 'Our New Collection',
    clickable: true,
    actionPlacement: 'bottom',
    actionAriaLabel: 'Open collection',
    fillHeight: false,
  },
}

export default meta
type Story = StoryObj<typeof ProductCutoutCard>

export const FooterWithTitle: Story = {}

export const ActionOnTheRight: Story = {
  args: {
    actionPlacement: 'right',
  },
}

export const ImageOnly: Story = {
  args: {
    actionPlacement: 'none',
  },
}

export const ContainedImage: Story = {
  args: {
    actionPlacement: 'bottom',
    imageFit: 'contain',
  },
}

export const FillHeightImageOnly: Story = {
  args: {
    actionPlacement: 'none',
    fillHeight: true,
  },
  render: (args) => ({
    components: { ProductCutoutCard },
    setup() {
      return { args }
    },
    template: `
      <div class="h-[24rem] max-w-[28rem]">
        <ProductCutoutCard v-bind="args" />
      </div>
    `,
  }),
}

export const NonInteractive: Story = {
  args: {
    clickable: false,
  },
}

export const NonInteractiveImageOnly: Story = {
  args: {
    clickable: false,
    actionPlacement: 'none',
  },
}
