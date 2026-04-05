import type { StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import InputText from 'primevue/inputtext'
import FloatLabel from 'primevue/floatlabel'
import Message from 'primevue/message'

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Atoms/InputText',
  component: InputText,
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text' },
    invalid: { control: 'boolean', description: 'Shows error / invalid state' },
    disabled: { control: 'boolean' },
    size: {
      control: 'select',
      options: ['small', undefined, 'large'],
    },
    fluid: { control: 'boolean', description: 'Full-width' },
  },
  args: {
    placeholder: 'you@example.com',
    invalid: false,
    disabled: false,
    fluid: false,
  },
}

export default meta
type Story = StoryObj<typeof meta>

// ─── Default ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => ({
    components: { InputText },
    setup() {
      const value = ref('')
      return { args, value }
    },
    template: '<InputText v-bind="args" v-model="value" />',
  }),
}

// ─── With float label ─────────────────────────────────────────────────────────

export const WithFloatLabel: Story = {
  render: () => ({
    components: { InputText, FloatLabel },
    setup() {
      const value = ref('')
      return { value }
    },
    template: `
      <FloatLabel>
        <InputText id="email" v-model="value" />
        <label for="email">Email address</label>
      </FloatLabel>
    `,
  }),
}

// ─── Invalid / error state ────────────────────────────────────────────────────

export const Invalid: Story = {
  render: () => ({
    components: { InputText, Message },
    setup() {
      const value = ref('not-an-email')
      return { value }
    },
    template: `
      <div class="flex flex-col gap-1" style="max-width: 320px">
        <InputText v-model="value" :invalid="true" placeholder="you@example.com" aria-describedby="email-error" />
        <Message severity="error" size="small" variant="simple" id="email-error">
          Please enter a valid email address.
        </Message>
      </div>
    `,
  }),
}

// ─── Disabled ─────────────────────────────────────────────────────────────────

export const Disabled: Story = {
  render: () => ({
    components: { InputText },
    setup() {
      const value = ref('disabled value')
      return { value }
    },
    template: '<InputText v-model="value" disabled />',
  }),
}

// ─── Sizes ────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => ({
    components: { InputText },
    setup() {
      const v1 = ref('')
      const v2 = ref('')
      const v3 = ref('')
      return { v1, v2, v3 }
    },
    template: `
      <div class="flex flex-col gap-3 p-4" style="max-width: 320px">
        <InputText v-model="v1" size="small" placeholder="Small" />
        <InputText v-model="v2" placeholder="Default" />
        <InputText v-model="v3" size="large" placeholder="Large" />
      </div>
    `,
  }),
}

// ─── All states at a glance ───────────────────────────────────────────────────

export const AllStates: Story = {
  render: () => ({
    components: { InputText, FloatLabel, Message },
    setup() {
      const v1 = ref('anna@example.com')
      const v2 = ref('')
      const v3 = ref('bad-value')
      const v4 = ref('disabled value')
      return { v1, v2, v3, v4 }
    },
    template: `
      <div class="flex flex-col gap-4 p-4" style="max-width: 360px">
        <FloatLabel>
          <InputText id="s1" v-model="v1" />
          <label for="s1">Default (filled)</label>
        </FloatLabel>
        <FloatLabel>
          <InputText id="s2" v-model="v2" />
          <label for="s2">Empty</label>
        </FloatLabel>
        <div class="flex flex-col gap-1">
          <FloatLabel>
            <InputText id="s3" v-model="v3" :invalid="true" aria-describedby="s3-err" />
            <label for="s3">With error</label>
          </FloatLabel>
          <Message severity="error" size="small" variant="simple" id="s3-err">
            Please enter a valid email address.
          </Message>
        </div>
        <InputText v-model="v4" disabled placeholder="Disabled" />
      </div>
    `,
  }),
}
