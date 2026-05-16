<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { deleteAdminCart, type AdminCart } from '@/api'
import AdminListPage from '@/components/organisms/AdminListPage/AdminListPage.vue'
import AdminEntityCard from '@/components/molecules/AdminEntityCard/AdminEntityCard.vue'
import AdminSearchField from '@/components/molecules/AdminSearchField/AdminSearchField.vue'
import AdminMetaGrid from '@/components/molecules/AdminMetaGrid/AdminMetaGrid.vue'
import Button from 'primevue/button'
import { useAdminCartsListing } from '@/composables/useAdminCartsListing'

const { t } = useI18n()
const listing = useAdminCartsListing()

const deleteVisible = ref(false)
const deleteLoading = ref(false)
const deleteError = ref<string | null>(null)
const deleteTarget = ref<AdminCart | null>(null)

const userIdInput = ref(listing.userIdFilter.value ? String(listing.userIdFilter.value) : '')

function applyUserIdFilter() {
  const value = Number(userIdInput.value)
  listing.setUserId(Number.isFinite(value) && value > 0 ? value : undefined)
}

function openDeleteDialog(cart: AdminCart) {
  deleteTarget.value = cart
  deleteVisible.value = true
  deleteError.value = null
}

async function confirmDelete() {
  if (!deleteTarget.value) return
  deleteLoading.value = true
  deleteError.value = null
  const result = await deleteAdminCart(deleteTarget.value.id)
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
</script>

<template>
  <AdminListPage
    :loading="listing.loading.value"
    :error="listing.error.value"
    :empty="!listing.carts.value.length"
    :empty-message="t('admin.carts.empty')"
    :current-page="listing.currentPage.value"
    :total="listing.pagination.value.total"
    :limit="listing.pagination.value.limit"
    v-model:delete-visible="deleteVisible"
    :delete-title="t('admin.carts.deleteTitle')"
    :delete-description="t('admin.carts.deleteDescription', { id: deleteTarget?.id ?? '' })"
    :delete-confirm-label="t('admin.actions.deleteCart')"
    :delete-loading="deleteLoading"
    :delete-error="deleteError"
    @page="listing.setPage"
    @confirm-delete="confirmDelete"
  >
    <template #filters>
      <AdminSearchField
        :label="t('admin.carts.filterUserLabel')"
        v-model="userIdInput"
        type="number"
        inputmode="numeric"
        @change="applyUserIdFilter"
      />
    </template>

    <template #items>
      <AdminEntityCard
        v-for="cart in listing.carts.value"
        :key="cart.id"
        :title="`Cart #${cart.id}`"
        :entity-id="cart.id"
      >
        <template #actions>
          <Button
            severity="danger"
            icon="pi pi-trash"
            :label="t('common.delete')"
            @click="openDeleteDialog(cart)"
          />
        </template>
        <template #meta>
          <AdminMetaGrid
            :columns="3"
            :items="[
              { label: t('admin.carts.table.userId'), value: cart.userId },
              {
                label: t('admin.carts.table.itemCount'),
                value: Array.isArray(cart.items) ? cart.items.length : 0,
              },
              { label: t('admin.carts.table.createdAt'), value: cart.createdAt },
            ]"
          />
        </template>
      </AdminEntityCard>
    </template>
  </AdminListPage>
</template>
