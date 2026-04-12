import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
import VariantSelector from './VariantSelector.vue'

const meta = {
  title: 'Molecules/VariantSelector',
  component: VariantSelector,
  tags: ['autodocs'],
} satisfies Meta<typeof VariantSelector>

export default meta

type Story = StoryObj<typeof meta>

export const TextOptions: Story = {
  args: {
    label: 'Size',
    presentation: 'text',
    options: [],
  },
  render: () => ({
    components: { VariantSelector },
    setup() {
      const selected = ref('large')
      const options = ref([
        { value: 'small', label: 'Small', selected: false, disabled: true },
        { value: 'medium', label: 'Medium', selected: false, disabled: false },
        { value: 'large', label: 'Large', selected: true, disabled: false },
      ])

      function handleSelect(value: string) {
        selected.value = value
        options.value = options.value.map((option) => ({
          ...option,
          selected: option.value === value,
        }))
      }

      return { options, selected, handleSelect }
    },
    template:
      '<VariantSelector label="Size" presentation="text" :options="options" @select="handleSelect" />',
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const medium = canvas.getByTestId('variant-option-medium')

    await userEvent.click(medium)
    await expect(medium).toHaveAttribute('aria-pressed', 'true')
  },
}

export const Swatches: Story = {
  args: {
    label: 'Colour',
    presentation: 'swatch',
    options: [
      { value: 'white', label: 'White', hex: '#ffffff', selected: true, disabled: false },
      { value: 'oak', label: 'Oak', hex: '#bf9b73', selected: false, disabled: false },
      { value: 'black', label: 'Black', hex: '#111111', selected: false, disabled: true },
    ],
  },
}
