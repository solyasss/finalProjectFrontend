import type { StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import Select from 'primevue/select'
import FloatLabel from 'primevue/floatlabel'
import Message from 'primevue/message'

// ─── Shared options ───────────────────────────────────────────────────────────

const QUANTITY_OPTIONS = [
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
  { label: '5', value: 5 },
]

const COLOUR_OPTIONS = [
  { label: 'White', value: 'white' },
  { label: 'Beige', value: 'beige' },
  { label: 'Black', value: 'black' },
  { label: 'Oak (discontinued)', value: 'oak', disabled: true },
  { label: 'Pine', value: 'pine' },
]

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Atoms/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text' },
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
    fluid: { control: 'boolean' },
  },
  args: {
    options: QUANTITY_OPTIONS,
    optionLabel: 'label',
    optionValue: 'value',
    placeholder: 'Select…',
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
    components: { Select },
    setup() {
      const value = ref(null)
      return { args, value }
    },
    template: '<Select v-bind="args" v-model="value" style="min-width: 200px" />',
  }),
}

// ─── With float label ─────────────────────────────────────────────────────────

export const WithFloatLabel: Story = {
  render: () => ({
    components: { Select, FloatLabel },
    setup() {
      const value = ref(null)
      return { value, QUANTITY_OPTIONS }
    },
    template: `
      <FloatLabel style="min-width: 200px">
        <Select
          inputId="qty"
          v-model="value"
          :options="QUANTITY_OPTIONS"
          optionLabel="label"
          optionValue="value"
          style="width: 100%"
        />
        <label for="qty">Quantity</label>
      </FloatLabel>
    `,
  }),
}

// ─── With disabled option ─────────────────────────────────────────────────────

export const WithDisabledOption: Story = {
  render: () => ({
    components: { Select },
    setup() {
      const value = ref(null)
      return { value, COLOUR_OPTIONS }
    },
    template: `
      <Select
        v-model="value"
        :options="COLOUR_OPTIONS"
        optionLabel="label"
        optionValue="value"
        optionDisabled="disabled"
        placeholder="Choose a colour"
        style="min-width: 220px"
      />
    `,
  }),
}

// ─── Invalid / error state ────────────────────────────────────────────────────

export const Invalid: Story = {
  render: () => ({
    components: { Select, Message },
    setup() {
      const value = ref(null)
      return { value, QUANTITY_OPTIONS }
    },
    template: `
      <div class="flex flex-col gap-1" style="min-width: 220px">
        <Select
          v-model="value"
          :options="QUANTITY_OPTIONS"
          optionLabel="label"
          optionValue="value"
          placeholder="Select quantity"
          :invalid="true"
          aria-describedby="qty-error"
          style="width: 100%"
        />
        <Message severity="error" size="small" variant="simple" id="qty-error">
          Please select a quantity.
        </Message>
      </div>
    `,
  }),
}

// ─── Disabled ─────────────────────────────────────────────────────────────────

export const Disabled: Story = {
  render: () => ({
    components: { Select },
    setup() {
      const value = ref(null)
      return { value, QUANTITY_OPTIONS }
    },
    template: `
      <Select
        v-model="value"
        :options="QUANTITY_OPTIONS"
        optionLabel="label"
        optionValue="value"
        placeholder="Not available"
        disabled
        style="min-width: 200px"
      />
    `,
  }),
}

// ─── All states at a glance ───────────────────────────────────────────────────

export const AllStates: Story = {
  render: () => ({
    components: { Select, FloatLabel, Message },
    setup() {
      const v1 = ref(2)
      const v2 = ref(null)
      const v3 = ref(null)
      const v4 = ref(null)
      return { v1, v2, v3, v4, QUANTITY_OPTIONS }
    },
    template: `
      <div class="flex flex-col gap-4 p-4" style="max-width: 320px">
        <FloatLabel>
          <Select inputId="s1" v-model="v1" :options="QUANTITY_OPTIONS" optionLabel="label" optionValue="value" style="width: 100%" />
          <label for="s1">Pre-selected</label>
        </FloatLabel>
        <FloatLabel>
          <Select inputId="s2" v-model="v2" :options="QUANTITY_OPTIONS" optionLabel="label" optionValue="value" style="width: 100%" />
          <label for="s2">Empty</label>
        </FloatLabel>
        <div class="flex flex-col gap-1">
          <FloatLabel>
            <Select inputId="s3" v-model="v3" :options="QUANTITY_OPTIONS" optionLabel="label" optionValue="value" :invalid="true" aria-describedby="s3-err" style="width: 100%" />
            <label for="s3">With error</label>
          </FloatLabel>
          <Message severity="error" size="small" variant="simple" id="s3-err">Please select a quantity.</Message>
        </div>
        <Select v-model="v4" :options="QUANTITY_OPTIONS" optionLabel="label" optionValue="value" placeholder="Disabled" disabled style="width: 100%" />
      </div>
    `,
  }),
}
