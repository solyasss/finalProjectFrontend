import type { Meta, StoryObj } from '@storybook/vue3'
import type { CategoryTreeNode } from '@/api'
import { useCatalogStore } from '@/stores'
import HeaderCategoryMenu from './HeaderCategoryMenu.vue'

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
        children: [
          {
            id: 111,
            slug: 'sectionals',
            name: 'Sectionals',
            description: 'Modular sofas',
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
      {
        id: 12,
        slug: 'coffee-tables',
        name: 'Coffee tables',
        description: 'Coffee and side tables',
        isActive: true,
        createdAt: '2026-04-19T10:00:00.000Z',
        updatedAt: '2026-04-19T10:00:00.000Z',
        deletedAt: null,
        imageUrl: null,
        sortOrder: 20,
        children: [],
      },
    ],
  },
  {
    id: 2,
    slug: 'bedroom',
    name: 'Bedroom',
    description: 'Bedroom furniture',
    isActive: true,
    createdAt: '2026-04-19T10:00:00.000Z',
    updatedAt: '2026-04-19T10:00:00.000Z',
    deletedAt: null,
    imageUrl: null,
    sortOrder: 20,
    children: [
      {
        id: 21,
        slug: 'beds',
        name: 'Beds',
        description: 'Beds and bed frames',
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
  {
    id: 3,
    slug: 'lighting',
    name: 'Lighting',
    description: 'Lighting for every room',
    isActive: true,
    createdAt: '2026-04-19T10:00:00.000Z',
    updatedAt: '2026-04-19T10:00:00.000Z',
    deletedAt: null,
    imageUrl: null,
    sortOrder: 30,
    children: [],
  },
]

const meta: Meta<typeof HeaderCategoryMenu> = {
  title: 'Organisms/HeaderCategoryMenu',
  component: HeaderCategoryMenu,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof HeaderCategoryMenu>

function seedCatalogStore(state: {
  categoriesTree?: CategoryTreeNode[]
  loadingCategories?: boolean
  categoriesError?: string | null
  categoriesLoaded?: boolean
}) {
  const catalogStore = useCatalogStore()
  catalogStore.categoriesTree = state.categoriesTree ?? []
  catalogStore.loadingCategories = state.loadingCategories ?? false
  catalogStore.categoriesError = state.categoriesError ?? null
  catalogStore.categoriesLoaded = state.categoriesLoaded ?? false
}

export const DesktopTrigger: Story = {
  render: () => ({
    components: { HeaderCategoryMenu },
    setup() {
      seedCatalogStore({ categoriesTree: sampleTree, categoriesLoaded: true })
      return {}
    },
    template: '<div class="min-h-[16rem] bg-surface-0 p-6"><HeaderCategoryMenu /></div>',
  }),
}
