import type { Meta, StoryObj } from '@storybook/vue3'
import HomeCollectionCta from './HomeCollectionCta.vue'

type StoryItem = {
  image: {
    url: string
    alt: string
    width: number
    height: number
  }
  title: string
  actionIcon?: string
  actionAriaLabel?: string
  actionPlacement?: 'bottom' | 'right' | 'none'
  imageFit?: 'crop' | 'fit' | 'contain' | 'stretch' | 'cover' | 'fill' | 'none' | 'scale-down'
}

const demoItems: StoryItem[] = [
  {
    image: {
      url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      alt: 'Woven chair near a side table',
      width: 1200,
      height: 1200,
    },
    title: 'НАША НОВА КОЛЕКЦІЯ',
    actionAriaLabel: 'Відкрити нову колекцію',
  },
  {
    image: {
      url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
      alt: 'Decorative frame and indoor plants',
      width: 1200,
      height: 1200,
    },
    title: 'НАШІ НАЙКРАЩІ ПРОПОЗИЦІЇ',
    actionAriaLabel: 'Відкрити найкращі пропозиції',
  },
  {
    image: {
      url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=80',
      alt: 'Warm brown sofa in a bright room',
      width: 1600,
      height: 1600,
    },
    title: 'МЕБЛІ ДЛЯ ВІТАЛЬНІ',
    actionPlacement: 'right',
    actionAriaLabel: 'Відкрити меблі для вітальні',
  },
]

const meta: Meta<typeof HomeCollectionCta> = {
  title: 'Organisms/HomeCollectionCta',
  component: HomeCollectionCta,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    items: { control: 'object' },
    'onSelect-item': { action: 'select-item' },
  },
  args: {
    title: 'ЗНАЙДИ ТЕ, ЩО ШУКАЄШ!',
    items: demoItems,
  },
  render: (args) => ({
    components: { HomeCollectionCta },
    setup() {
      return { args }
    },
    template: `
      <div class="mx-auto max-w-[72rem] px-4 py-8">
        <HomeCollectionCta v-bind="args" />
      </div>
    `,
  }),
}

export default meta
type Story = StoryObj<typeof HomeCollectionCta>

export const Default: Story = {}

export const BottomCardWithTitle: Story = {
  args: {
    title: 'ОБЕРИ СВІЙ НАСТРІЙ ДЛЯ ДОМУ',
    items: [
      demoItems[0]!,
      demoItems[1]!,
      {
        ...demoItems[2]!,
        title: 'СОНЯЧНІ АКЦЕНТИ',
        actionPlacement: 'bottom',
      },
    ],
  },
}

export const MinimalActions: Story = {
  args: {
    title: 'ДОБІРКИ ДЛЯ КОЖНОЇ КІМНАТИ',
    items: demoItems.map((item, index) => ({
      ...item,
      actionPlacement: index === 2 ? 'none' : 'bottom',
    })),
  },
}
