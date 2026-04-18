import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

export type AccountSection = 'accountDetails' | 'dataPrivacy'
export type AccountNavAction = 'route' | 'section'

export interface AccountNavItem {
  id: 'purchases' | 'accountDetails' | 'dataPrivacy'
  label: string
  action: AccountNavAction
  routeName?: 'orders'
  section?: AccountSection
}

export function useAccountSections() {
  const { t } = useI18n()
  const router = useRouter()
  const activeSection = ref<AccountSection>('accountDetails')

  const items = computed<AccountNavItem[]>(() => [
    // TODO: consider refactoring to constant config
    {
      id: 'purchases',
      label: t('accountPage.navPurchases'),
      action: 'route',
      routeName: 'orders',
    },
    {
      id: 'accountDetails',
      label: t('accountPage.navAccountDetails'),
      action: 'section',
      section: 'accountDetails',
    },
    {
      id: 'dataPrivacy',
      label: t('accountPage.navDataPrivacy'),
      action: 'section',
      section: 'dataPrivacy',
    },
  ])

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
      activeSection.value = item.section
    }
  }

  return {
    activeSection,
    activeNavItemId,
    items,
    handleItemSelect,
  }
}
