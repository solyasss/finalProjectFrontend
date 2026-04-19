<script setup lang="ts">
import DefaultTemplate from '@/components/templates/DefaultTemplate/DefaultTemplate.vue'
import AccountShell from '@/components/organisms/AccountShell/AccountShell.vue'
import OrdersHistoryPanel from '@/components/organisms/OrdersHistoryPanel/OrdersHistoryPanel.vue'
import { useOrdersPage } from '@/composables/useOrdersPage'
import { useAccountNavigation } from '@/composables/useAccountNavigation'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()

const { items } = useAccountNavigation()
const { loading, error, orders, pagination, currentPage, setPage, openOrder } = useOrdersPage()

async function handleNavSelect(itemId: 'purchases' | 'accountDetails' | 'dataPrivacy') {
  const item = items.value.find((entry) => entry.id === itemId)

  if (!item) {
    return
  }

  if (item.action === 'route') {
    await router.push({ name: item.routeName })
    return
  }

  await router.push({
    name: 'account',
    query: item.section === 'dataPrivacy' ? { section: item.section } : {},
  })
}
</script>

<template>
  <DefaultTemplate>
    <AccountShell
      :eyebrow="t('ordersPage.eyebrow')"
      :title="t('ordersPage.title')"
      :description="t('ordersPage.description')"
      :items="items"
      active-item-id="purchases"
      @select="handleNavSelect"
    >
      <OrdersHistoryPanel
        :orders="orders"
        :pagination="pagination"
        :loading="loading"
        :error="error"
        :current-page="currentPage"
        @page-change="setPage"
        @select-order="openOrder"
      />
    </AccountShell>
  </DefaultTemplate>
</template>
