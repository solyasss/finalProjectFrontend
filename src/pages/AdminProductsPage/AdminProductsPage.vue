<script setup lang="ts">
import Button from 'primevue/button'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  deleteAdminProduct,
  getAdminCategories,
  getAdminProduct,
  type AdminCategory,
  type AdminProduct,
  type AdminProductListItem,
} from '@/api'
import AdminListPage from '@/components/organisms/AdminListPage/AdminListPage.vue'
import AdminEntityCard from '@/components/molecules/AdminEntityCard/AdminEntityCard.vue'
import AdminSearchField from '@/components/molecules/AdminSearchField/AdminSearchField.vue'
import AdminMetaGrid from '@/components/molecules/AdminMetaGrid/AdminMetaGrid.vue'
import AdminProductForm from '@/components/organisms/AdminProductForm/AdminProductForm.vue'
import { useAdminProductsListing } from '@/composables/useAdminProductsListing'

const { t } = useI18n()
const listing = useAdminProductsListing()

const categories = ref<AdminCategory[]>([])
const dialogVisible = ref(false)
const dialogMode = ref<'create' | 'edit'>('create')
const activeProduct = ref<AdminProduct | null>(null)
const dialogLoading = ref(false)
const deleteVisible = ref(false)
const deleteLoading = ref(false)
const deleteError = ref<string | null>(null)
const deleteTarget = ref<AdminProductListItem | null>(null)

async function ensureCategoriesLoaded() {
  if (categories.value.length) return
  const result = await getAdminCategories({ page: 1, limit: 100 })
  if (result.ok) categories.value = result.data.data
}

async function openCreateDialog() {
  await ensureCategoriesLoaded()
  activeProduct.value = null
  dialogMode.value = 'create'
  dialogVisible.value = true
}

async function openEditDialog(product: AdminProductListItem) {
  await ensureCategoriesLoaded()
  dialogLoading.value = true
  dialogMode.value = 'edit'
  dialogVisible.value = true
  const result = await getAdminProduct(product.id)
  dialogLoading.value = false
  if (!result.ok) {
    listing.error.value =
      result.error.code === 'FORBIDDEN'
        ? t('admin.messages.forbidden')
        : result.error.message || t('admin.messages.loadFailed')
    dialogVisible.value = false
    return
  }
  activeProduct.value = result.data
}

function openDeleteDialog(product: AdminProductListItem) {
  deleteTarget.value = product
  deleteVisible.value = true
  deleteError.value = null
}

async function confirmDelete() {
  if (!deleteTarget.value) return
  deleteLoading.value = true
  deleteError.value = null
  const result = await deleteAdminProduct(deleteTarget.value.id)
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
  activeProduct.value = null
  listing.reload()
}
</script>

<template>
  <AdminListPage
    :loading="listing.loading.value"
    :error="listing.error.value"
    :empty="!listing.products.value.length"
    :empty-message="t('admin.products.empty')"
    :current-page="listing.currentPage.value"
    :total="listing.pagination.value.total"
    :limit="listing.pagination.value.limit"
    v-model:dialog-visible="dialogVisible"
    :dialog-header="
      dialogMode === 'create' ? t('admin.actions.createProduct') : t('admin.actions.editProduct')
    "
    :dialog-loading="dialogLoading"
    :dialog-width="'min(72rem, calc(100vw - 2rem))'"
    v-model:delete-visible="deleteVisible"
    :delete-title="t('admin.products.deleteTitle')"
    :delete-description="t('admin.products.deleteDescription', { name: deleteTarget?.name ?? '' })"
    :delete-confirm-label="t('admin.actions.deleteProduct')"
    :delete-loading="deleteLoading"
    :delete-error="deleteError"
    @page="listing.setPage"
    @confirm-delete="confirmDelete"
  >
    <template #filters>
      <AdminSearchField
        :label="t('admin.products.searchLabel')"
        :placeholder="t('admin.products.searchPlaceholder')"
        :model-value="listing.filter.value"
        :wide-min="true"
        @change="listing.setFilter($event)"
      />
    </template>

    <template #actions>
      <Button
        icon="pi pi-plus"
        :label="t('admin.actions.createProduct')"
        @click="openCreateDialog"
      />
    </template>

    <template #items>
      <AdminEntityCard
        v-for="product in listing.products.value"
        :key="product.id"
        :title="product.name"
        :entity-id="product.id"
        :subtitle="`/${product.slug}`"
        :description="product.description || t('admin.products.noDescription')"
        @edit="openEditDialog(product)"
        @delete="openDeleteDialog(product)"
      >
        <template #meta>
          <AdminMetaGrid
            :columns="3"
            :items="[
              {
                label: t('admin.products.table.categories'),
                value: product.categories?.length ?? 0,
              },
              { label: t('admin.products.table.updatedAt'), value: product.updatedAt },
              {
                label: t('admin.products.table.visibility'),
                value: product.isActive ? t('admin.status.active') : t('admin.status.hidden'),
              },
            ]"
          />
        </template>
      </AdminEntityCard>
    </template>

    <template #dialog-content>
      <AdminProductForm
        :key="`${dialogMode}-${activeProduct?.id ?? 'new'}`"
        :mode="dialogMode"
        :product="activeProduct"
        :categories="categories"
        @cancel="dialogVisible = false"
        @success="handleSaved"
      />
    </template>
  </AdminListPage>
</template>
