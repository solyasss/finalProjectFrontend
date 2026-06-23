import type { Meta, StoryObj } from '@storybook/vue3'
import HomeHeroCta from './HomeHeroCta.vue'

const meta: Meta<typeof HomeHeroCta> = {
  title: 'Organisms/HomeHeroCta',
  component: HomeHeroCta,
  tags: ['autodocs'],
  argTypes: {
    primaryActionLabel: { control: 'text' },
    items: { control: 'object' },
    promoPrefix: { control: 'text' },
    promoHighlight: { control: 'text' },
    promoSuffix: { control: 'text' },
  },
  args: {
    primaryActionLabel: 'СТВОРИТИ АКАУНТ ТА ПОЧАТИ!',
    promoPrefix: 'ЛОВИ МОМЕНТ |',
    promoHighlight: 'Знижки до 60%',
    promoSuffix: 'на вибрані категорії товарів!',
    items: [
      {
        imageSrc:
          'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
        imageAlt: 'Soft decorative pillows on a sofa',
        title: 'ПОДУШКИ',
        subtitle: 'спальна кімната...',
        price: '12$',
        badgeText: 'TOP',
      },
      {
        imageSrc:
          'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80',
        imageAlt: 'Folded grey blanket on a sofa',
        title: 'КОВДРА',
        subtitle: 'спальна кімната...',
        price: '30$',
        badgeText: 'TOP',
      },
      {
        imageSrc:
          'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80',
        imageAlt: 'Beige bed in a neutral bedroom',
        title: 'ЛІЖКО',
        subtitle: 'спальна кімната...',
        price: '414$',
        badgeText: 'TOP',
      },
    ],
  },
  render: (args) => ({
    components: { HomeHeroCta },
    setup() {
      return { args }
    },
    template: `
      <div class="mx-auto max-w-[42rem] px-4 py-8">
        <HomeHeroCta v-bind="args" />
      </div>
    `,
  }),
}

export default meta
type Story = StoryObj<typeof HomeHeroCta>

export const Default: Story = {}
