import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import HamburgerToggle from './HamburgerToggle.vue'

const meta: Meta<typeof HamburgerToggle> = {
  title: 'Atoms/HamburgerToggle',
  component: HamburgerToggle,
  tags: ['autodocs'],
  argTypes: {
    open: { control: 'boolean' },
    disabled: { control: 'boolean' },
    ariaLabel: { control: 'text' },
  },
  args: {
    open: false,
    disabled: false,
    ariaLabel: 'Toggle menu',
  },
}

export default meta
type Story = StoryObj<typeof HamburgerToggle>

export const Default: Story = {}

export const Open: Story = {
  args: {
    open: true,
  },
}

export const Interactive: Story = {
  render: (args) => ({
    components: { HamburgerToggle },
    setup() {
      const open = ref(Boolean(args.open))

      function handleToggle(nextState: boolean) {
        open.value = nextState
      }

      return { args, open, handleToggle }
    },
    template: `
      <div class="p-4">
        <HamburgerToggle
          :open="open"
          :disabled="args.disabled"
          :aria-label="args.ariaLabel"
          @toggle="handleToggle"
        />
      </div>
    `,
  }),
}
