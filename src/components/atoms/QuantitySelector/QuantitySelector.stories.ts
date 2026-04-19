import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
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

export const Default: Story = {}
