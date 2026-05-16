<script setup lang="ts">
import Button from 'primevue/button'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { deleteAdminCategory, getAdminCategory, type AdminCategory } from '@/api'
import AdminListPage from '@/components/organisms/AdminListPage/AdminListPage.vue'
import AdminEntityCard from '@/components/molecules/AdminEntityCard/AdminEntityCard.vue'
import AdminSearchField from '@/components/molecules/AdminSearchField/AdminSearchField.vue'
import AdminMetaGrid from '@/components/molecules/AdminMetaGrid/AdminMetaGrid.vue'
import AdminCategoryForm from '@/components/organisms/AdminCategoryForm/AdminCategoryForm.vue'
import { useAdminCategoriesListing } from '@/composables/useAdminCategoriesListing'

const { t } = useI18n()
const listing = useAdminCategoriesListing()

const dialogVisible = ref(false)
const dialogMode = ref<'create' | 'edit'>('create')
const activeCategory = ref<AdminCategory | null>(null)
const dialogLoading = ref(false)
const deleteVisible = ref(false)
const deleteLoading = ref(false)
const deleteError = ref<string | null>(null)
const deleteTarget = ref<AdminCategory | null>(null)

function openCreateDialog() {
  activeCategory.value = null
  dialogMode.value = 'create'
  dialogVisible.value = true
}

async function openEditDialog(category: AdminCategory) {
  dialogLoading.value = true
  dialogMode.value = 'edit'
  dialogVisible.value = true
  const result = await getAdminCategory(category.id)
  dialogLoading.value = false
  if (!result.ok) {
    listing.error.value =
      result.error.code === 'FORBIDDEN'
        ? t('admin.messages.forbidden')
        : result.error.message || t('admin.messages.loadFailed')
    dialogVisible.value = false
    return
  }
  activeCategory.value = result.data
}

function openDeleteDialog(category: AdminCategory) {
  deleteTarget.value = category
  deleteVisible.value = true
  deleteError.value = null
}

async function confirmDelete() {
  if (!deleteTarget.value) return
  deleteLoading.value = true
  deleteError.value = null
  const result = await deleteAdminCategory(deleteTarget.value.id)
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
  activeCategory.value = null
  listing.reload()
}
</script>

<template>
  <AdminListPage
    :loading="listing.loading.value"
    :error="listing.error.value"
    :empty="!listing.categories.value.length"
    :empty-message="t('admin.categories.empty')"
    :current-page="listing.currentPage.value"
    :total="listing.pagination.value.total"
    :limit="listing.pagination.value.limit"
    v-model:dialog-visible="dialogVisible"
    :dialog-header="
      dialogMode === 'create' ? t('admin.actions.createCategory') : t('admin.actions.editCategory')
    "
    :dialog-loading="dialogLoading"
    v-model:delete-visible="deleteVisible"
    :delete-title="t('admin.categories.deleteTitle')"
    :delete-description="
      t('admin.categories.deleteDescription', { name: deleteTarget?.name ?? '' })
    "
    :delete-confirm-label="t('admin.actions.deleteCategory')"
    :delete-loading="deleteLoading"
    :delete-error="deleteError"
    @page="listing.setPage"
    @confirm-delete="confirmDelete"
  >
    <template #filters>
      <AdminSearchField
        :label="t('admin.categories.searchLabel')"
        :placeholder="t('admin.categories.searchPlaceholder')"
        :model-value="listing.filter.value"
        :wide-min="true"
        @change="listing.setFilter($event)"
      />
    </template>

    <template #actions>
      <Button
        icon="pi pi-plus"
        :label="t('admin.actions.createCategory')"
        @click="openCreateDialog"
      />
    </template>

    <template #items>
      <AdminEntityCard
        v-for="category in listing.categories.value"
        :key="category.id"
        :title="category.name"
        :entity-id="category.id"
        :subtitle="`/${category.slug}`"
        :description="category.description || t('admin.categories.noDescription')"
        @edit="openEditDialog(category)"
        @delete="openDeleteDialog(category)"
      >
        <template #meta>
          <AdminMetaGrid
            :columns="3"
            :items="[
              { label: t('admin.categories.table.sortOrder'), value: category.sortOrder },
              { label: t('admin.categories.table.parentId'), value: category.parentId },
              {
                label: t('admin.categories.table.visibility'),
                value: category.isActive ? t('admin.status.active') : t('admin.status.hidden'),
              },
            ]"
          />
        </template>
      </AdminEntityCard>
    </template>

    <template #dialog-content>
      <AdminCategoryForm
        :key="`${dialogMode}-${activeCategory?.id ?? 'new'}`"
        :mode="dialogMode"
        :category="activeCategory"
        @cancel="dialogVisible = false"
        @success="handleSaved"
      />
    </template>
  </AdminListPage>
</template>
