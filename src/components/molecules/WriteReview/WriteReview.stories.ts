import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import WriteReview from './WriteReview.vue'

const meta = {
  title: 'Molecules/WriteReview',
  component: WriteReview,
  tags: ['autodocs'],
  args: {
    authenticated: true,
    submitting: false,
    submitError: null,
    success: false,
  },
} satisfies Meta<typeof WriteReview>

export default meta

type Story = StoryObj<typeof meta>

export const Authenticated: Story = {}

export const Guest: Story = {
  args: {
    authenticated: false,
  },
}

export const ValidationError: Story = {}

export const SuccessfulSubmit: Story = {
  render: (args) => ({
    components: { WriteReview },
    setup() {
      const success = ref(false)

      function handleSubmit() {
        success.value = true
      }

      return { args, success, handleSubmit }
    },
    template: `
      <div class="p-4">
        <WriteReview
          v-bind="args"
          :success="success"
          @submit="handleSubmit"
        />
      </div>
    `,
  }),
}
