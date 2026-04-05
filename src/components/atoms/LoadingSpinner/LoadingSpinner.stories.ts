import type { Meta, StoryObj } from '@storybook/vue3'
import LoadingSpinner from './LoadingSpinner.vue'

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof LoadingSpinner> = {
  title: 'Atoms/LoadingSpinner',
  component: LoadingSpinner,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    color: {
      control: 'select',
      options: ['current', 'brand', 'white'],
    },
    label: { control: 'text', description: 'Screen-reader label (set to empty string to hide)' },
  },
  args: {
    size: 'md',
    color: 'brand',
    label: 'Loading…',
  },
}

export default meta
type Story = StoryObj<typeof LoadingSpinner>

// ─── Default ──────────────────────────────────────────────────────────────────

export const Default: Story = {}

// ─── Sizes ────────────────────────────────────────────────────────────────────

export const Small: Story = { args: { size: 'sm' } }
export const Medium: Story = { args: { size: 'md' } }
export const Large: Story = { args: { size: 'lg' } }

// ─── Colors ───────────────────────────────────────────────────────────────────

export const BrandBlue: Story = { args: { color: 'brand' } }

export const White: Story = {
  args: { color: 'white' },
  decorators: [
    () => ({
      template:
        '<div class="flex items-center justify-center rounded bg-brand-blue p-6"><story /></div>',
    }),
  ],
}

export const InheritsCurrent: Story = {
  args: { color: 'current' },
  decorators: [
    () => ({
      template: '<div class="text-error"><story /></div>',
    }),
  ],
}

// ─── All sizes at a glance ────────────────────────────────────────────────────

export const AllSizes: Story = {
  render: () => ({
    components: { LoadingSpinner },
    template: `
      <div class="flex items-center gap-6 p-4">
        <LoadingSpinner size="sm" color="brand" label="Loading small" />
        <LoadingSpinner size="md" color="brand" label="Loading medium" />
        <LoadingSpinner size="lg" color="brand" label="Loading large" />
      </div>
    `,
  }),
}
