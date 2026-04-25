import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getCategories } from '@/api'
import type { CategoryTreeNode } from '@/api'

export function normalizeCategoryTree(nodes?: CategoryTreeNode[] | null): CategoryTreeNode[] {
  if (!Array.isArray(nodes)) {
    return []
  }

  return nodes.map((node) => ({
    id: node.id,
    slug: node.slug,
    name: node.name,
    description: node.description,
    isActive: node.isActive,
    createdAt: node.createdAt,
    updatedAt: node.updatedAt,
    deletedAt: node.deletedAt ?? null,
    imageUrl: node.imageUrl ?? null,
    sortOrder: node.sortOrder,
    children: normalizeCategoryTree(node.children),
  }))
}

export const useCatalogStore = defineStore('catalog', () => {
  const categoriesTree = ref<CategoryTreeNode[]>([])
  const loadingCategories = ref(false)
  const categoriesError = ref<string | null>(null)
  const categoriesLoaded = ref(false)
  let fetchPromise: Promise<void> | null = null

  async function fetchCategories(force = false) {
    if (categoriesLoaded.value && !force) {
      return
    }

    if (fetchPromise && !force) {
      return fetchPromise
    }

    fetchPromise = (async () => {
      loadingCategories.value = true
      categoriesError.value = null

      const res = await getCategories()

      if (res.ok) {
        categoriesTree.value = normalizeCategoryTree(res.data)
        categoriesLoaded.value = true
        return
      }

      categoriesTree.value = []
      categoriesLoaded.value = false
      categoriesError.value = res.error.message
    })().finally(() => {
      loadingCategories.value = false
      fetchPromise = null
    })

    return fetchPromise
  }

  function findCategoryBySlug(slug: string): CategoryTreeNode | null {
    function search(nodes: CategoryTreeNode[]): CategoryTreeNode | null {
      for (const node of nodes) {
        if (node.slug === slug) return node
        if (node.children?.length) {
          const found = search(node.children)
          if (found) return found
        }
      }
      return null
    }
    return search(categoriesTree.value)
  }

  return {
    categoriesTree,
    loadingCategories,
    categoriesError,
    categoriesLoaded,
    fetchCategories,
    findCategoryBySlug,
  }
})
