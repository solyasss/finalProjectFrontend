import type { Meta, StoryObj } from '@storybook/vue3'
import NewArrivalGrid from './NewArrivalGrid.vue'

const items = [
  {
    image: {
      url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
      alt: 'Soft beige bedroom with layered textiles',
      width: 1200,
      height: 1200,
    },
  },
  {
    image: {
      url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
      alt: 'Bright living room with a neutral sofa',
      width: 1200,
      height: 1200,
    },
  },
  {
    image: {
      url: 'https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?auto=format&fit=crop&w=1200&q=80',
      alt: 'Dining room with warm wood furniture',
      width: 1200,
      height: 1200,
    },
  },
  {
    image: {
      url: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=1200&q=80',
      alt: 'Minimal living area with modern chairs',
      width: 1200,
      height: 1200,
    },
  },
]

const meta: Meta<typeof NewArrivalGrid> = {
  title: 'Organisms/NewArrivalGrid',
  component: NewArrivalGrid,
  tags: ['autodocs'],
  argTypes: {
    items: { control: 'object' },
  },
  args: {
    title: 'New arrivals',
    items,
  },
  render: (args) => ({
    components: { NewArrivalGrid },
    setup() {
      return { args }
    },
    template: `
      <div class="mx-auto max-w-6xl px-4 py-8">
        <NewArrivalGrid v-bind="args" />
      </div>
    `,
  }),
}

export default meta
type Story = StoryObj<typeof NewArrivalGrid>

export const Default: Story = {}
