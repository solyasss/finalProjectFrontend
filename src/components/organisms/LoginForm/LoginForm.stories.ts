import type { Meta, StoryObj } from '@storybook/vue3'
import type { ApiResult, LoginRequest, LoginResponse } from '@/api'
import LoginForm from './LoginForm.vue'

const meta: Meta<typeof LoginForm> = {
  title: 'Organisms/LoginForm',
  component: LoginForm,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof LoginForm>

function mockSuccess(payload: LoginRequest): Promise<ApiResult<LoginResponse>> {
  return Promise.resolve({
    ok: true,
    data: {
      accessToken: 'storybook-token',
      user: {
        id: 'user-1',
        email: payload.email,
        firstName: 'Olya',
        lastName: 'S.',
        dateOfBirth: '1998-03-12',
        address: null,
      },
    },
  })
}

function mockInvalidCredentials(): Promise<ApiResult<LoginResponse>> {
  return Promise.resolve({
    ok: false,
    error: {
      code: 'UNAUTHORIZED',
      message: 'Invalid email or password',
    },
  })
}

export const Default: Story = {
  args: {
    submitSignIn: mockSuccess,
  },
}

export const ReadyToSubmit: Story = {
  args: {
    initialDraft: {
      email: 'olya@example.com',
      password: 'securepass123',
    },
    submitSignIn: mockSuccess,
  },
}

export const InvalidCredentials: Story = {
  args: {
    initialDraft: {
      email: 'olya@example.com',
      password: 'wrong-password',
    },
    submitSignIn: mockInvalidCredentials,
  },
}
