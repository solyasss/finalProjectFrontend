<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { CategoryTreeNode } from '@/api'
import CategoryMenu from '@/components/molecules/CategoryMenu/CategoryMenu.vue'
import type { MenuItem } from 'primevue/menuitem'
import { useCatalogStore } from '@/stores'

const router = useRouter()
const catalogStore = useCatalogStore()

async function ensureCategoriesLoaded(force = false) {
  await catalogStore.fetchCategories(force)
}

function createCategoryRouteCommand(slug: string): MenuItem['command'] {
  return () => {
    router.push({
      name: 'plp',
      params: { categorySlug: slug },
    })
  }
}

function convertCategoryNodeToMenuItem(node: CategoryTreeNode): MenuItem {
  const children = node.children?.filter(Boolean) ?? []

  return {
    key: String(node.id),
    label: node.name,
    command: createCategoryRouteCommand(node.slug),
    items: children.length > 0 ? children.map(convertCategoryNodeToMenuItem) : undefined,
  }
}

function convertCategoriesToMenuItems(categories: CategoryTreeNode[]): MenuItem[] {
  return [
    {
      key: 'categories-root',
      label: 'Categories',
      items: categories.map(convertCategoryNodeToMenuItem),
    },
  ]
}

const categoryMenuItems = computed<MenuItem[]>(() => {
  return convertCategoriesToMenuItems(catalogStore.categoriesTree)
})

onMounted(() => {
  ensureCategoriesLoaded()
})
</script>

<template>
  <CategoryMenu :model="categoryMenuItems" />
</template>
