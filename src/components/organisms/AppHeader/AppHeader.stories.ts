import type { Meta, StoryObj } from '@storybook/vue3'
import { useLocationStore } from '@/stores'
import AppHeader from './AppHeader.vue'

const meta: Meta<typeof AppHeader> = {
  title: 'Organisms/AppHeader',
  component: AppHeader,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof AppHeader>

export const Default: Story = {}

export const PagePreview: Story = {
  render: () => ({
    components: { AppHeader },
    setup() {
      const locationStore = useLocationStore()
      locationStore.setSelectedCity('lviv', 'manual')
      return {}
    },
    template: `
      <div class="min-h-screen bg-surface-0">
        <AppHeader />
        <main class="mx-auto max-w-[1440px] px-4 py-8 md:px-6">
          <div class="bg-surface-100 text-muted-color rounded-border flex min-h-[18rem] items-center justify-center border border-surface">
            Page content preview
          </div>
        </main>
      </div>
    `,
  }),
}

export const AutoDetectedCity: Story = {
  render: () => ({
    components: { AppHeader },
    setup() {
      const locationStore = useLocationStore()
      locationStore.setSelectedCity('kyiv', 'auto')
      return {}
    },
    template: '<AppHeader />',
  }),
}
