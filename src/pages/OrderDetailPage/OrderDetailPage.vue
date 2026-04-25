<script setup lang="ts">
import Button from 'primevue/button'
import Message from 'primevue/message'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import OrderDetailsPanel from '@/components/organisms/OrderDetailsPanel/OrderDetailsPanel.vue'
import AccountShell from '@/components/organisms/AccountShell/AccountShell.vue'
import DefaultTemplate from '@/components/templates/DefaultTemplate/DefaultTemplate.vue'
import { useAccountNavigation } from '@/composables/useAccountNavigation'
import { useOrderDetailPage } from '@/composables/useOrderDetailPage'

const { t } = useI18n()
const router = useRouter()
const { items } = useAccountNavigation()
const { loading, pageError, order, lines, shippingAddress, goBackToOrders } = useOrderDetailPage()

const pageTitle = computed(() =>
  order.value
    ? t('orderDetailPage.title', { orderId: order.value.orderId })
    : t('orderDetailPage.titleFallback'),
)

async function handleNavSelect(itemId: 'purchases' | 'accountDetails' | 'dataPrivacy') {
  const item = items.value.find((entry) => entry.id === itemId)

  if (!item) {
    return
  }

  if (item.action === 'route') {
    await goBackToOrders()
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
      :eyebrow="t('orderDetailPage.eyebrow')"
      :title="pageTitle"
      :description="t('orderDetailPage.description')"
      :items="items"
      active-item-id="purchases"
      @select="handleNavSelect"
    >
      <Message v-if="loading" severity="secondary" variant="simple">
        {{ t('orderDetailPage.loading') }}
      </Message>

      <div v-else-if="pageError" class="grid gap-4">
        <Message severity="error">
          {{ pageError }}
        </Message>

        <div class="flex justify-start">
          <Button
            :label="t('orderDetailPage.backToOrders')"
            icon="pi pi-arrow-left"
            severity="secondary"
            variant="outlined"
            @click="goBackToOrders"
          />
        </div>
      </div>

      <OrderDetailsPanel
        v-else-if="order"
        :order="order"
        :lines="lines"
        :shipping-address="shippingAddress"
        @back="goBackToOrders"
      />
    </AccountShell>
  </DefaultTemplate>
</template>
