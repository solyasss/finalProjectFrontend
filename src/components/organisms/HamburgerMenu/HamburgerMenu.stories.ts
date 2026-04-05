import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import HamburgerMenu from './HamburgerMenu.vue'

const sampleItems = [
  { id: 'home', label: 'Home', icon: 'pi pi-home' },
  { id: 'search', label: 'Search', icon: 'pi pi-search' },
  { id: 'favorites', label: 'Favorites', icon: 'pi pi-heart' },
  { id: 'cart', label: 'Cart', icon: 'pi pi-shopping-cart' },
]

const meta: Meta<typeof HamburgerMenu> = {
  title: 'Organisms/HamburgerMenu',
  component: HamburgerMenu,
  tags: ['autodocs'],
  argTypes: {
    items: {
      control: 'object',
      description: 'Menu entries rendered in drawer',
    },
    open: {
      control: 'boolean',
      description: 'Current drawer state',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables menu toggle',
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible label for toggle',
    },
    title: {
      control: 'text',
      description: 'Drawer header text',
    },
    closeOnSelect: {
      control: 'boolean',
      description: 'Close drawer after item click',
    },
    onSelect: {
      action: 'select',
      description: 'Fires when a menu item is selected',
    },
  },
  args: {
    items: sampleItems,
    open: false,
    disabled: false,
    ariaLabel: 'Toggle menu',
    title: 'Menu',
    closeOnSelect: true,
  },
}

export default meta
type Story = StoryObj<typeof HamburgerMenu>

export const Default: Story = {}

export const Open: Story = {
  args: {
    open: true,
  },
}

export const Interactive: Story = {
  render: (args) => ({
    components: { HamburgerMenu },
    setup() {
      const open = ref(Boolean(args.open))

      function handleToggle(nextState: boolean) {
        open.value = nextState
      }

      return { args, open, handleToggle }
    },
    template: `
      <div class="p-4">
        <HamburgerMenu
          v-model:open="open"
          :items="args.items"
          :disabled="args.disabled"
          :aria-label="args.ariaLabel"
          :title="args.title"
          :close-on-select="args.closeOnSelect"
          @toggle="handleToggle"
          @select="args.onSelect"
        />
      </div>
    `,
  }),
}
