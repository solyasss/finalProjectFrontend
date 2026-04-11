import type { Meta, StoryObj } from '@storybook/vue3'
import type { ApiResult, MessageResponse, RegisterRequest } from '@/api'
import RegistrationStepperForm from './RegistrationStepperForm.vue'

const meta: Meta<typeof RegistrationStepperForm> = {
  title: 'Organisms/RegistrationStepperForm',
  component: RegistrationStepperForm,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof RegistrationStepperForm>

function mockSuccess(_payload: RegisterRequest): Promise<ApiResult<MessageResponse>> {
  return Promise.resolve({
    ok: true,
    data: { message: 'Registration successful. Please verify your email address.' },
  })
}

export const Default: Story = {
  args: {
    submitRegister: mockSuccess,
  },
}

export const StepTwoPrefilled: Story = {
  args: {
    initialStep: '2',
    initialDraft: {
      firstName: 'Olya',
      lastName: 'S.',
      dateOfBirth: new Date('1998-03-12'),
      email: 'olya@example.com',
    },
    submitRegister: mockSuccess,
  },
}

export const ReadyToSubmit: Story = {
  args: {
    initialStep: '3',
    initialDraft: {
      firstName: 'Olya',
      lastName: 'S.',
      dateOfBirth: new Date('1998-03-12'),
      email: 'olya@example.com',
      password: 'securepass123',
      confirmPassword: 'securepass123',
      acceptTerms: true,
    },
    submitRegister: mockSuccess,
  },
}
