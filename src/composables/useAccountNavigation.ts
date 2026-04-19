import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

export const ACCOUNT_DEFAULT_SECTION = 'accountDetails' as const

export type AccountSection = 'accountDetails' | 'dataPrivacy'
export type AccountNavAction = 'route' | 'section'
export type AccountNavItemId = 'purchases' | 'accountDetails' | 'dataPrivacy'

export interface AccountNavItem {
  id: AccountNavItemId
  label: string
  action: AccountNavAction
  routeName: 'orders' | 'account'
  section?: AccountSection
}

export function isAccountSection(value: unknown): value is AccountSection {
  return value === 'accountDetails' || value === 'dataPrivacy'
}

export function useAccountNavigation() {
  const { t } = useI18n()

  const items = computed<AccountNavItem[]>(() => [
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
      routeName: 'account',
      section: 'accountDetails',
    },
    {
      id: 'dataPrivacy',
      label: t('accountPage.navDataPrivacy'),
      action: 'section',
      routeName: 'account',
      section: 'dataPrivacy',
    },
  ])

  return {
    items,
  }
}
