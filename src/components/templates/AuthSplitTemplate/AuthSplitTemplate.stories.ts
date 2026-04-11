import type { Meta, StoryObj } from '@storybook/vue3'
import AuthSplitTemplate from './AuthSplitTemplate.vue'

const meta: Meta<typeof AuthSplitTemplate> = {
  title: 'Templates/AuthSplitTemplate',
  component: AuthSplitTemplate,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof AuthSplitTemplate>

export const Default: Story = {
  render: () => ({
    components: { AuthSplitTemplate },
    template: `
      <AuthSplitTemplate>
        <template #visual>
          <div class="min-h-[18rem] rounded-[2rem] bg-primary p-8 text-primary-contrast lg:min-h-[42rem]">
            Visual panel preview
          </div>
        </template>
        <div class="rounded-[2rem] border border-surface bg-surface-0 p-8">
          Form panel preview
        </div>
      </AuthSplitTemplate>
    `,
  }),
}
