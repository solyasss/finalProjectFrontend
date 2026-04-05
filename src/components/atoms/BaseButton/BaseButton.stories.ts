import type { Meta, StoryObj } from '@storybook/vue3'
import Button from 'primevue/button'

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    severity: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'info', 'warn', 'danger', 'contrast'],
      description: 'PrimeVue severity (maps to colour)',
    },
    size: {
      control: 'select',
      options: ['small', undefined, 'large'],
      description: 'Physical size',
    },
    text: { control: 'boolean', description: 'Ghost / text-only variant' },
    outlined: { control: 'boolean' },
    rounded: { control: 'boolean' },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    fluid: { control: 'boolean' },
    icon: { control: 'text', description: 'PrimeIcon class e.g. "pi pi-heart"' },
    iconPos: { control: 'select', options: ['left', 'right', 'top', 'bottom'] },
    label: { control: 'text' },
  },
  args: {
    label: 'Add to cart',
    loading: false,
    disabled: false,
    fluid: false,
    iconPos: 'left',
  },
}

export default meta
type Story = StoryObj<typeof meta>

// ─── Primary (brand yellow) ───────────────────────────────────────────────────

export const Primary: Story = {
  args: { label: 'Add to cart' },
}

// ─── Secondary ────────────────────────────────────────────────────────────────

export const Secondary: Story = {
  args: { label: 'Save for later', severity: 'secondary' },
}

// ─── Ghost (text) ─────────────────────────────────────────────────────────────

export const Ghost: Story = {
  args: { label: 'Learn more', text: true, severity: 'secondary' },
}

// ─── Danger ───────────────────────────────────────────────────────────────────

export const Danger: Story = {
  args: { label: 'Remove item', severity: 'danger' },
}

// ─── Outlined ─────────────────────────────────────────────────────────────────

export const Outlined: Story = {
  args: { label: 'Compare', outlined: true },
}

// ─── Sizes ────────────────────────────────────────────────────────────────────

export const Small: Story = {
  args: { label: 'Small', size: 'small' },
}

export const Large: Story = {
  args: { label: 'Large', size: 'large' },
}

// ─── States ───────────────────────────────────────────────────────────────────

export const Loading: Story = {
  args: { label: 'Adding…', loading: true },
}

export const Disabled: Story = {
  args: { label: 'Unavailable', disabled: true },
}

// ─── With icon ────────────────────────────────────────────────────────────────

export const WithIconLeft: Story = {
  args: { label: 'Add to cart', icon: 'pi pi-shopping-cart', iconPos: 'left' },
}

export const WithIconRight: Story = {
  args: { label: 'Shop now', icon: 'pi pi-arrow-right', iconPos: 'right' },
}

export const IconOnly: Story = {
  args: { icon: 'pi pi-heart', 'aria-label': 'Save to wishlist' },
}

// ─── Fluid ────────────────────────────────────────────────────────────────────

export const Fluid: Story = {
  args: { label: 'Add to cart', fluid: true },
  decorators: [() => ({ template: '<div style="max-width: 400px"><story /></div>' })],
}

// ─── All variants at a glance ─────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    components: { Button },
    template: `
      <div class="flex flex-wrap gap-3 p-4">
        <Button label="Primary" />
        <Button label="Secondary" severity="secondary" />
        <Button label="Ghost" text severity="secondary" />
        <Button label="Danger" severity="danger" />
        <Button label="Outlined" outlined />
        <Button label="Success" severity="success" />
      </div>
    `,
  }),
}

export const AllSizes: Story = {
  render: () => ({
    components: { Button },
    template: `
      <div class="flex flex-wrap items-center gap-3 p-4">
        <Button label="Small" size="small" />
        <Button label="Medium" />
        <Button label="Large" size="large" />
      </div>
    `,
  }),
}
