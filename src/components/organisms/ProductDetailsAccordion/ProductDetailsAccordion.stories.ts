import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
import ProductDetailsAccordion from './ProductDetailsAccordion.vue'

const meta = {
  title: 'Organisms/ProductDetailsAccordion',
  component: ProductDetailsAccordion,
  tags: ['autodocs'],
  args: {
    sections: [
      {
        key: 'DETAILS',
        title: 'Details',
        content: 'Solid pine frame with **soft rounded edges**.',
      },
      { key: 'MEASUREMENTS', title: 'Measurements', content: '- Width: 160 cm\n- Length: 200 cm' },
    ],
    documents: [
      { type: 'ASSEMBLY', label: 'Assembly guide', url: 'https://example.com/assembly.pdf' },
    ],
  },
} satisfies Meta<typeof ProductDetailsAccordion>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: 'Measurements' })

    await userEvent.click(button)
    await expect(canvas.getByText('Width: 160 cm')).toBeInTheDocument()
  },
}
