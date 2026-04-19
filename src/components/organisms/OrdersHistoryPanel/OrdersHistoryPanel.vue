<script setup lang="ts">
import { computed } from 'vue'
import DataView from 'primevue/dataview'
import Message from 'primevue/message'
import Paginator from 'primevue/paginator'
import { useI18n } from 'vue-i18n'
import type { OrderSummary, Pagination } from '@/api'
import OrderSummaryCard from '@/components/molecules/OrderSummaryCard/OrderSummaryCard.vue'

interface Props {
  orders: OrderSummary[]
  pagination: Pagination | null
  loading: boolean
  error: string | null
  currentPage: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (event: 'page-change', page: number): void
  (event: 'select-order', orderId: string): void
}>()

const { t } = useI18n()

const pageCount = computed(() => {
  if (!props.pagination) {
    return 1
  }

  return Math.max(1, Math.ceil(props.pagination.total / props.pagination.limit))
})

function handlePageChange(event: { page: number }) {
  emit('page-change', event.page + 1)
}

function handleSelectOrder(orderId: string) {
  emit('select-order', orderId)
}
</script>

<template>
  <Message v-if="loading" severity="secondary" variant="simple">
    {{ t('ordersPage.loading') }}
  </Message>

  <Message v-else-if="error" severity="error">
    {{ error }}
  </Message>

  <Message v-else-if="!orders.length" severity="secondary" variant="simple">
    {{ t('ordersPage.empty') }}
  </Message>

  <div v-else class="grid gap-5">
    <DataView :value="orders" data-key="orderId" layout="list">
      <template #list="slotProps">
        <div class="grid gap-4">
          <OrderSummaryCard
            v-for="order in slotProps.items"
            :key="order.orderId"
            :order="order"
            :action-label="t('ordersPage.viewDetails')"
            @select="handleSelectOrder(order.orderId)"
          />
        </div>
      </template>
    </DataView>

    <div
      v-if="pagination"
      class="flex flex-col gap-3 rounded-lg border border-surface bg-surface-0 p-4 md:flex-row md:items-center md:justify-between"
    >
      <p class="text-sm text-muted-color">
        {{ t('ordersPage.paginationSummary', { page: currentPage, total: pageCount }) }}
      </p>

      <Paginator
        :rows="pagination.limit"
        :first="(currentPage - 1) * pagination.limit"
        :total-records="pagination.total"
        template="PrevPageLink PageLinks NextPageLink"
        @page="handlePageChange"
      />
    </div>
  </div>
</template>
