import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ACCOUNT_DEFAULT_SECTION,
  isAccountSection,
  useAccountNavigation,
  type AccountNavItem,
  type AccountSection,
} from './useAccountNavigation'

export function useAccountSections() {
  const route = useRoute()
  const router = useRouter()
  const { items } = useAccountNavigation()

  const activeSection = computed<AccountSection>(() => {
    const section = route.query.section
    return typeof section === 'string' && isAccountSection(section)
      ? section
      : ACCOUNT_DEFAULT_SECTION
  })

  const activeNavItemId = computed(() =>
    activeSection.value === 'accountDetails' ? 'accountDetails' : 'dataPrivacy',
  )

  async function handleItemSelect(itemId: AccountNavItem['id']) {
    const item = items.value.find((entry) => entry.id === itemId)

    if (!item) {
      return
    }

    if (item.action === 'route' && item.routeName) {
      await router.push({ name: item.routeName })
      return
    }

    if (item.section) {
      const nextQuery = { ...route.query }

      if (item.section === ACCOUNT_DEFAULT_SECTION) {
        delete nextQuery.section
      } else {
        nextQuery.section = item.section
      }

      await router.replace({
        name: 'account',
        query: nextQuery,
      })
    }
  }

  return {
    activeSection,
    activeNavItemId,
    items,
    handleItemSelect,
  }
}
