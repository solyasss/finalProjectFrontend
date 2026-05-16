<script setup lang="ts">
import Button from 'primevue/button'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { deleteAdminPromotion, type AdminPromotion } from '@/api'
import AdminListPage from '@/components/organisms/AdminListPage/AdminListPage.vue'
import AdminEntityCard from '@/components/molecules/AdminEntityCard/AdminEntityCard.vue'
import AdminSearchField from '@/components/molecules/AdminSearchField/AdminSearchField.vue'
import AdminMetaGrid from '@/components/molecules/AdminMetaGrid/AdminMetaGrid.vue'
import AdminPromotionForm from '@/components/organisms/AdminPromotionForm/AdminPromotionForm.vue'
import { useAdminPromotionsListing } from '@/composables/useAdminPromotionsListing'

const { t } = useI18n()
const listing = useAdminPromotionsListing()

const dialogVisible = ref(false)
const dialogMode = ref<'create' | 'edit'>('create')
const activePromotion = ref<AdminPromotion | null>(null)
const deleteVisible = ref(false)
const deleteLoading = ref(false)
const deleteError = ref<string | null>(null)
const deleteTarget = ref<AdminPromotion | null>(null)

function openCreateDialog() {
  activePromotion.value = null
  dialogMode.value = 'create'
  dialogVisible.value = true
}

function openEditDialog(promotion: AdminPromotion) {
  activePromotion.value = promotion
  dialogMode.value = 'edit'
  dialogVisible.value = true
}

function openDeleteDialog(promotion: AdminPromotion) {
  deleteTarget.value = promotion
  deleteVisible.value = true
  deleteError.value = null
}

async function confirmDelete() {
  if (!deleteTarget.value) return
  deleteLoading.value = true
  deleteError.value = null
  const result = await deleteAdminPromotion(deleteTarget.value.id)
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

function handleSaved() {
  dialogVisible.value = false
  activePromotion.value = null
  listing.reload()
}
</script>

<template>
  <AdminListPage
    :loading="listing.loading.value"
    :error="listing.error.value"
    :empty="!listing.promotions.value.length"
    :empty-message="t('admin.promotions.empty')"
    :current-page="listing.currentPage.value"
    :total="listing.pagination.value.total"
    :limit="listing.pagination.value.limit"
    v-model:dialog-visible="dialogVisible"
    :dialog-header="
      dialogMode === 'create'
        ? t('admin.actions.createPromotion')
        : t('admin.actions.editPromotion')
    "
    v-model:delete-visible="deleteVisible"
    :delete-title="t('admin.promotions.deleteTitle')"
    :delete-description="
      t('admin.promotions.deleteDescription', { name: deleteTarget?.name ?? '' })
    "
    :delete-confirm-label="t('admin.actions.deletePromotion')"
    :delete-loading="deleteLoading"
    :delete-error="deleteError"
    @page="listing.setPage"
    @confirm-delete="confirmDelete"
  >
    <template #filters>
      <AdminSearchField
        :label="t('admin.promotions.searchLabel')"
        :placeholder="t('admin.promotions.searchPlaceholder')"
        :model-value="listing.filter.value"
        :wide-min="true"
        @change="listing.setFilter($event)"
      />
    </template>

    <template #actions>
      <Button
        icon="pi pi-plus"
        :label="t('admin.actions.createPromotion')"
        @click="openCreateDialog"
      />
    </template>

    <template #items>
      <AdminEntityCard
        v-for="promo in listing.promotions.value"
        :key="promo.id"
        :title="promo.name"
        :entity-id="promo.id"
        :subtitle="`/${promo.slug}`"
        @edit="openEditDialog(promo)"
        @delete="openDeleteDialog(promo)"
      >
        <template #meta>
          <AdminMetaGrid
            :columns="3"
            :items="[
              { label: t('admin.promotions.table.discountType'), value: promo.discountType },
              { label: t('admin.promotions.table.discountValue'), value: promo.discountValue },
              { label: t('admin.promotions.table.targetType'), value: promo.targetType },
              { label: t('admin.promotions.table.startDate'), value: promo.startDate },
              { label: t('admin.promotions.table.endDate'), value: promo.endDate },
            ]"
          />
        </template>
      </AdminEntityCard>
    </template>

    <template #dialog-content>
      <AdminPromotionForm
        :key="`${dialogMode}-${activePromotion?.id ?? 'new'}`"
        :mode="dialogMode"
        :promotion="activePromotion"
        @cancel="dialogVisible = false"
        @success="handleSaved"
      />
    </template>
  </AdminListPage>
</template>
