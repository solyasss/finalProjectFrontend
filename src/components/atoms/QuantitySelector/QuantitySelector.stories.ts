import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
import QuantitySelector from './QuantitySelector.vue'

const meta = {
  title: 'Atoms/QuantitySelector',
  component: QuantitySelector,
  tags: ['autodocs'],
  args: {
    modelValue: 1,
    min: 1,
    max: 3,
    disabled: false,
  },
  render: (args) => ({
    components: { QuantitySelector },
    setup() {
      const value = ref(args.modelValue)
      return { args, value }
    },
    template:
      '<QuantitySelector v-bind="args" :model-value="value" @update:model-value="value = $event" />',
  }),
} satisfies Meta<typeof QuantitySelector>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const increment = canvas.getByTestId('quantity-increment')
    const decrement = canvas.getByTestId('quantity-decrement')
    const input = canvas.getByTestId('quantity-input') as HTMLInputElement

    await userEvent.click(increment)
    await expect(input.value).toBe('2')

    await userEvent.click(decrement)
    await expect(input.value).toBe('1')

    await userEvent.click(increment)
    await userEvent.click(increment)
    await userEvent.click(increment)
    await expect(input.value).toBe('3')
  },
}
