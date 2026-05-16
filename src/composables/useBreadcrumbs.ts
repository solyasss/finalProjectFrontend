import { ref, watch, type Ref } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import { type Category, type CategoryTreeNode, type ProductDetails } from '@/api'
import { getCategoriesTree } from '@/api/catalog'

export interface BreadcrumbItem {
  label: string
  route?: RouteLocationRaw
}

function isSameCategory(left: Pick<Category, 'id' | 'slug'>, right: Pick<Category, 'id' | 'slug'>) {
  return left.id === right.id || left.slug === right.slug
}

function findCategoryPath(
  nodes: CategoryTreeNode[],
  target: Pick<Category, 'id' | 'slug'>,
  ancestors: CategoryTreeNode[] = [],
): CategoryTreeNode[] {
  for (const node of nodes) {
    const path = [...ancestors, node]

    if (isSameCategory(node, target)) {
      return path
    }

    if (node.children?.length) {
      const nestedPath = findCategoryPath(node.children, target, path)

      if (nestedPath.length) {
        return nestedPath
      }
    }
  }

  return []
}

function toBreadcrumbItems(path: CategoryTreeNode[]): BreadcrumbItem[] {
  return path.map((category) => ({
    label: category.name,
    route: {
      name: 'plp',
      params: { categorySlug: category.slug },
    },
  }))
}

export function useBreadcrumbs(product: Ref<ProductDetails | null>) {
  const items = ref<BreadcrumbItem[]>([])
  const loading = ref(false)
  let activeRequestId = 0

  async function reload() {
    const primaryCategory = product.value?.categories[0]

    if (!primaryCategory) {
      activeRequestId += 1
      loading.value = false
      items.value = []
      return
    }

    const requestId = ++activeRequestId
    loading.value = true

    const result = await getCategoriesTree()

    if (requestId !== activeRequestId) {
      return
    }

    loading.value = false

    if (!result.ok) {
      items.value = []
      return
    }

    const path = findCategoryPath(result.data, primaryCategory)

    // TODO: Ask backend to return parent category/path in product details so breadcrumbs
    // can be built without fetching and traversing the full categories tree on the client.
    items.value = toBreadcrumbItems(path)
  }

  watch(
    () => product.value?.id,
    () => {
      void reload()
    },
    { immediate: true },
  )

  return {
    breadcrumbItems: items,
    loadingBreadcrumbs: loading,
    reloadBreadcrumbs: reload,
  }
}
