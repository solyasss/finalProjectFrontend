<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { deleteAdminOrder, type AdminOrder, type AdminOrderStatus } from '@/api'
import AdminListPage from '@/components/organisms/AdminListPage/AdminListPage.vue'
import AdminEntityCard from '@/components/molecules/AdminEntityCard/AdminEntityCard.vue'
import AdminSearchField from '@/components/molecules/AdminSearchField/AdminSearchField.vue'
import AdminMetaGrid from '@/components/molecules/AdminMetaGrid/AdminMetaGrid.vue'
import AdminStatusBadge from '@/components/atoms/AdminStatusBadge/AdminStatusBadge.vue'
import AdminOrderStatusForm from '@/components/organisms/AdminOrderStatusForm/AdminOrderStatusForm.vue'
import Button from 'primevue/button'
import { useAdminOrdersListing } from '@/composables/useAdminOrdersListing'

const { t } = useI18n()
const listing = useAdminOrdersListing()

const statusDialogVisible = ref(false)
const activeOrder = ref<AdminOrder | null>(null)
const deleteVisible = ref(false)
const deleteLoading = ref(false)
const deleteError = ref<string | null>(null)
const deleteTarget = ref<AdminOrder | null>(null)

const userIdInput = ref(listing.userIdFilter.value ? String(listing.userIdFilter.value) : '')

const ORDER_STATUSES: AdminOrderStatus[] = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED']

function openStatusDialog(order: AdminOrder) {
  activeOrder.value = order
  statusDialogVisible.value = true
}

function openDeleteDialog(order: AdminOrder) {
  deleteTarget.value = order
  deleteVisible.value = true
  deleteError.value = null
}

function applyUserIdFilter() {
  const value = Number(userIdInput.value)
  listing.setUserId(Number.isFinite(value) && value > 0 ? value : undefined)
}

async function confirmDelete() {
  if (!deleteTarget.value) return
  deleteLoading.value = true
  deleteError.value = null
  const result = await deleteAdminOrder(deleteTarget.value.id)
  deleteLoading.value = false
  if (!result.ok) {
    deleteError.value =
      result.error.code === 'FORBIDDEN'
        ? t('admin.messages.forbidden')
        : result.error.message || t('admin.messages.deleteFailed')
    return
  }
  deleteVisible.value = false
  deleteTarget.value = null
  await listing.reload()
}

function handleStatusSaved() {
  statusDialogVisible.value = false
  activeOrder.value = null
  listing.reload()
}
</script>

<template>
  <AdminListPage
    :loading="listing.loading.value"
    :error="listing.error.value"
    :empty="!listing.orders.value.length"
    :empty-message="t('admin.orders.empty')"
    :current-page="listing.currentPage.value"
    :total="listing.pagination.value.total"
    :limit="listing.pagination.value.limit"
    v-model:dialog-visible="statusDialogVisible"
    :dialog-header="t('admin.actions.updateOrderStatus')"
    :dialog-width="'min(32rem, calc(100vw - 2rem))'"
    v-model:delete-visible="deleteVisible"
    :delete-title="t('admin.orders.deleteTitle')"
    :delete-description="t('admin.orders.deleteDescription', { id: deleteTarget?.id ?? '' })"
    :delete-confirm-label="t('admin.actions.deleteOrder')"
    :delete-loading="deleteLoading"
    :delete-error="deleteError"
    @page="listing.setPage"
    @confirm-delete="confirmDelete"
  >
    <template #filters>
      <AdminSearchField
        :label="t('admin.orders.filterUserLabel')"
        v-model="userIdInput"
        type="number"
        inputmode="numeric"
        @change="applyUserIdFilter"
      />
      <label class="grid gap-2 text-sm">
        <span class="font-medium text-color">{{ t('admin.orders.filterStatusLabel') }}</span>
        <select
          :value="listing.statusFilter.value ?? ''"
          class="rounded-lg border border-surface px-3 py-2"
          @change="
            listing.setStatus(
              (($event.target as HTMLSelectElement).value as AdminOrderStatus) || undefined,
            )
          "
        >
          <option value="">{{ t('admin.orders.allStatuses') }}</option>
          <option v-for="status in ORDER_STATUSES" :key="status" :value="status">
            {{ status }}
          </option>
        </select>
      </label>
    </template>

    <template #items>
      <AdminEntityCard
        v-for="order in listing.orders.value"
        :key="order.id"
        :title="`Order #${order.id}`"
        :entity-id="order.id"
      >
        <template #badges>
          <AdminStatusBadge :label="order.status" variant="status" />
        </template>
        <template #actions>
          <Button
            outlined
            severity="secondary"
            icon="pi pi-pencil"
            :label="t('admin.actions.updateOrderStatus')"
            @click="openStatusDialog(order)"
          />
          <Button
            severity="danger"
            icon="pi pi-trash"
            :label="t('common.delete')"
            @click="openDeleteDialog(order)"
          />
        </template>
        <template #meta>
          <AdminMetaGrid
            :columns="4"
            :items="[
              { label: t('admin.orders.table.userId'), value: order.userId },
              { label: t('admin.orders.table.status'), value: order.status },
              { label: t('admin.orders.table.total'), value: order.totalAmount },
              { label: t('admin.orders.table.createdAt'), value: order.createdAt },
            ]"
          />
        </template>
      </AdminEntityCard>
    </template>

    <template #dialog-content>
      <AdminOrderStatusForm
        v-if="activeOrder"
        :key="activeOrder.id"
        :order="activeOrder"
        @cancel="statusDialogVisible = false"
        @success="handleStatusSaved"
      />
    </template>
  </AdminListPage>
</template>
