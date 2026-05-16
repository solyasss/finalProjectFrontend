<script setup lang="ts">
import Button from 'primevue/button'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { deleteAdminProductSet, type AdminProductSet } from '@/api'
import AdminListPage from '@/components/organisms/AdminListPage/AdminListPage.vue'
import AdminEntityCard from '@/components/molecules/AdminEntityCard/AdminEntityCard.vue'
import AdminSearchField from '@/components/molecules/AdminSearchField/AdminSearchField.vue'
import AdminMetaGrid from '@/components/molecules/AdminMetaGrid/AdminMetaGrid.vue'
import AdminProductSetForm from '@/components/organisms/AdminProductSetForm/AdminProductSetForm.vue'
import { useAdminProductSetsListing } from '@/composables/useAdminProductSetsListing'

const { t } = useI18n()
const listing = useAdminProductSetsListing()

const dialogVisible = ref(false)
const dialogMode = ref<'create' | 'edit'>('create')
const activeProductSet = ref<AdminProductSet | null>(null)
const deleteVisible = ref(false)
const deleteLoading = ref(false)
const deleteError = ref<string | null>(null)
const deleteTarget = ref<AdminProductSet | null>(null)

function openCreateDialog() {
  activeProductSet.value = null
  dialogMode.value = 'create'
  dialogVisible.value = true
}

function openEditDialog(productSet: AdminProductSet) {
  activeProductSet.value = productSet
  dialogMode.value = 'edit'
  dialogVisible.value = true
}

function openDeleteDialog(productSet: AdminProductSet) {
  deleteTarget.value = productSet
  deleteVisible.value = true
  deleteError.value = null
}

async function confirmDelete() {
  if (!deleteTarget.value) return
  deleteLoading.value = true
  deleteError.value = null
  const result = await deleteAdminProductSet(deleteTarget.value.id)
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
  activeProductSet.value = null
  listing.reload()
}
</script>

<template>
  <AdminListPage
    :loading="listing.loading.value"
    :error="listing.error.value"
    :empty="!listing.productSets.value.length"
    :empty-message="t('admin.productSets.empty')"
    :current-page="listing.currentPage.value"
    :total="listing.pagination.value.total"
    :limit="listing.pagination.value.limit"
    v-model:dialog-visible="dialogVisible"
    :dialog-header="
      dialogMode === 'create'
        ? t('admin.actions.createProductSet')
        : t('admin.actions.editProductSet')
    "
    v-model:delete-visible="deleteVisible"
    :delete-title="t('admin.productSets.deleteTitle')"
    :delete-description="
      t('admin.productSets.deleteDescription', { name: deleteTarget?.name ?? '' })
    "
    :delete-confirm-label="t('admin.actions.deleteProductSet')"
    :delete-loading="deleteLoading"
    :delete-error="deleteError"
    @page="listing.setPage"
    @confirm-delete="confirmDelete"
  >
    <template #filters>
      <AdminSearchField
        :label="t('admin.productSets.searchLabel')"
        :placeholder="t('admin.productSets.searchPlaceholder')"
        :model-value="listing.filter.value"
        :wide-min="true"
        @change="listing.setFilter($event)"
      />
    </template>

    <template #actions>
      <Button
        icon="pi pi-plus"
        :label="t('admin.actions.createProductSet')"
        @click="openCreateDialog"
      />
    </template>

    <template #items>
      <AdminEntityCard
        v-for="set in listing.productSets.value"
        :key="set.id"
        :title="set.name"
        :entity-id="set.id"
        :subtitle="`/${set.slug}`"
        @edit="openEditDialog(set)"
        @delete="openDeleteDialog(set)"
      >
        <template #meta>
          <AdminMetaGrid
            :columns="3"
            :items="[
              { label: t('admin.productSets.table.roomId'), value: set.roomId },
              {
                label: t('admin.productSets.table.variantCount'),
                value: set.variantIds?.length ?? 0,
              },
              { label: t('admin.productSets.table.updatedAt'), value: set.updatedAt },
            ]"
          />
        </template>
      </AdminEntityCard>
    </template>

    <template #dialog-content>
      <AdminProductSetForm
        :key="`${dialogMode}-${activeProductSet?.id ?? 'new'}`"
        :mode="dialogMode"
        :product-set="activeProductSet"
        @cancel="dialogVisible = false"
        @success="handleSaved"
      />
    </template>
  </AdminListPage>
</template>
