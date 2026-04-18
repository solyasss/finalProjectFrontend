import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import AccountDeferredPanel from '@/components/molecules/AccountDeferredPanel/AccountDeferredPanel.vue'
import AccountShell from './AccountShell.vue'

const meta: Meta<typeof AccountShell> = {
  title: 'Organisms/AccountShell',
  component: AccountShell,
  tags: ['autodocs'],
  args: {
    eyebrow: 'My account',
    title: 'Manage your account details',
    description: 'Update personal details, password, and saved shopping context from one place.',
    activeItemId: 'accountDetails',
    items: [
      { id: 'purchases', label: 'Purchases', action: 'route', routeName: 'orders' },
      {
        id: 'accountDetails',
        label: 'Account details',
        action: 'section',
        section: 'accountDetails',
      },
      { id: 'dataPrivacy', label: 'Data and privacy', action: 'section', section: 'dataPrivacy' },
    ],
  },
}

export default meta

type Story = StoryObj<typeof meta>

function renderShell(args: Record<string, unknown>) {
  return {
    components: { AccountShell, AccountDeferredPanel },
    setup() {
      const activeItemId = ref(args.activeItemId as 'accountDetails' | 'dataPrivacy')

      function handleSelect(nextId: 'purchases' | 'accountDetails' | 'dataPrivacy') {
        if (nextId === 'purchases') {
          return
        }

        activeItemId.value = nextId
      }

      return { args, activeItemId, handleSelect }
    },
    template: `
      <div class="bg-surface-100 py-6">
        <AccountShell
          :eyebrow="args.eyebrow"
          :title="args.title"
          :description="args.description"
          :items="args.items"
          :active-item-id="activeItemId"
          @select="handleSelect"
        >
          <div
            v-if="activeItemId === 'accountDetails'"
            class="rounded-lg border border-surface bg-surface-0 p-6 text-color"
          >
            Default account details workspace.
          </div>
          <AccountDeferredPanel
            v-else
            title="Data and privacy"
            description="Privacy controls and export options are planned for a future release."
            message="Coming soon."
          />
        </AccountShell>
      </div>
    `,
  }
}

export const Default: Story = {
  render: renderShell,
}

export const DeferredState: Story = {
  render: renderShell,
  args: {
    activeItemId: 'dataPrivacy',
  },
}

export const Mobile: Story = {
  render: renderShell,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}
