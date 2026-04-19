import type { Meta, StoryObj } from '@storybook/vue3'
import type { CategoryTreeNode } from '@/api'
import { useCatalogStore, useLocationStore } from '@/stores'
import AppHeader from './AppHeader.vue'

const sampleTree: CategoryTreeNode[] = [
  {
    id: 1,
    slug: 'living-room',
    name: 'Living room',
    description: 'Living room furniture',
    isActive: true,
    createdAt: '2026-04-19T10:00:00.000Z',
    updatedAt: '2026-04-19T10:00:00.000Z',
    deletedAt: null,
    imageUrl: null,
    sortOrder: 10,
    children: [
      {
        id: 11,
        slug: 'sofas',
        name: 'Sofas',
        description: 'Sofas and sectionals',
        isActive: true,
        createdAt: '2026-04-19T10:00:00.000Z',
        updatedAt: '2026-04-19T10:00:00.000Z',
        deletedAt: null,
        imageUrl: null,
        sortOrder: 10,
        children: [],
      },
    ],
  },
]

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

export const WithCategories: Story = {
  render: () => ({
    components: { AppHeader },
    setup() {
      const locationStore = useLocationStore()
      const catalogStore = useCatalogStore()
      locationStore.setSelectedCity('lviv', 'manual')
      catalogStore.categoriesTree = sampleTree
      catalogStore.categoriesLoaded = true
      catalogStore.categoriesError = null
      catalogStore.loadingCategories = false
      return {}
    },
    template: `
      <div class="min-h-screen bg-surface-0">
        <AppHeader />
        <main class="mx-auto max-w-[1440px] px-4 py-8 md:px-6">
          <div class="bg-surface-100 text-muted-color rounded-border flex min-h-[18rem] items-center justify-center border border-surface">
            Header preview with category navigation
          </div>
        </main>
      </div>
    `,
  }),
}
