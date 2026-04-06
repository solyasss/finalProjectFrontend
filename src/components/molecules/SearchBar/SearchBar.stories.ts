import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import SearchBar from './SearchBar.vue'

const meta: Meta<typeof SearchBar> = {
  title: 'Molecules/SearchBar',
  component: SearchBar,
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Input placeholder text',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables input and submit button',
    },
    onSubmit: {
      action: 'submit',
      description: 'Emits the trimmed search query',
    },
  },
  args: {
    placeholder: 'Пошук',
    disabled: false,
  },
}

export default meta
type Story = StoryObj<typeof SearchBar>

function renderSearchBar(args: {
  placeholder?: string
  disabled?: boolean
  onSubmit?: (query: string) => void
}) {
  return {
    components: { SearchBar },
    setup() {
      const value = ref('')
      return { args, value }
    },
    template: `
      <div class="w-full p-4" style="max-width: 900px">
        <SearchBar
          v-model="value"
          :placeholder="args.placeholder"
          :disabled="args.disabled"
          @submit="args.onSubmit"
        />
      </div>
    `,
  }
}

export const Default: Story = {
  render: renderSearchBar,
}

export const CustomPlaceholder: Story = {
  render: renderSearchBar,
  args: {
    placeholder: 'Search products',
  },
}

export const Disabled: Story = {
  render: renderSearchBar,
  args: {
    disabled: true,
  },
}

export const Prefilled: Story = {
  render: (args: {
    placeholder?: string
    disabled?: boolean
    onSubmit?: (query: string) => void
  }) => ({
    components: { SearchBar },
    setup() {
      const value = ref('диван')
      return { args, value }
    },
    template: `
      <div class="w-full p-4" style="max-width: 900px">
        <SearchBar
          v-model="value"
          :placeholder="args.placeholder"
          :disabled="args.disabled"
          @submit="args.onSubmit"
        />
      </div>
    `,
  }),
}
