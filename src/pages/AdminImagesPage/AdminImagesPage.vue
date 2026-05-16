<script setup lang="ts">
import Button from 'primevue/button'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { deleteAdminImage, type AdminImage } from '@/api'
import AdminListPage from '@/components/organisms/AdminListPage/AdminListPage.vue'
import AdminSearchField from '@/components/molecules/AdminSearchField/AdminSearchField.vue'
import AdminMetaGrid from '@/components/molecules/AdminMetaGrid/AdminMetaGrid.vue'
import AdminStatusBadge from '@/components/atoms/AdminStatusBadge/AdminStatusBadge.vue'
import AdminImageUploadForm from '@/components/organisms/AdminImageUploadForm/AdminImageUploadForm.vue'
import { useAdminImagesListing } from '@/composables/useAdminImagesListing'

const { t } = useI18n()
const listing = useAdminImagesListing()

const dialogVisible = ref(false)
const dialogMode = ref<'create' | 'edit'>('create')
const activeImage = ref<AdminImage | null>(null)
const deleteVisible = ref(false)
const deleteLoading = ref(false)
const deleteError = ref<string | null>(null)
const deleteTarget = ref<AdminImage | null>(null)

function openCreateDialog() {
  activeImage.value = null
  dialogMode.value = 'create'
  dialogVisible.value = true
}

function openEditDialog(image: AdminImage) {
  activeImage.value = image
  dialogMode.value = 'edit'
  dialogVisible.value = true
}

function openDeleteDialog(image: AdminImage) {
  deleteTarget.value = image
  deleteVisible.value = true
  deleteError.value = null
}

async function confirmDelete() {
  if (!deleteTarget.value) return
  deleteLoading.value = true
  deleteError.value = null
  const result = await deleteAdminImage(deleteTarget.value.id)
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
  activeImage.value = null
  listing.reload()
}
</script>

<template>
  <AdminListPage
    :loading="listing.loading.value"
    :error="listing.error.value"
    :empty="!listing.images.value.length"
    :empty-message="t('admin.images.empty')"
    :current-page="listing.currentPage.value"
    :total="listing.pagination.value.total"
    :limit="listing.pagination.value.limit"
    v-model:dialog-visible="dialogVisible"
    :dialog-header="
      dialogMode === 'create' ? t('admin.actions.createImage') : t('admin.actions.editImage')
    "
    :dialog-width="'min(48rem, calc(100vw - 2rem))'"
    v-model:delete-visible="deleteVisible"
    :delete-title="t('admin.images.deleteTitle')"
    :delete-description="t('admin.images.deleteDescription', { id: deleteTarget?.id ?? '' })"
    :delete-confirm-label="t('admin.actions.deleteImage')"
    :delete-loading="deleteLoading"
    :delete-error="deleteError"
    @page="listing.setPage"
    @confirm-delete="confirmDelete"
  >
    <template #filters>
      <AdminSearchField
        :label="t('admin.images.searchLabel')"
        :placeholder="t('admin.images.searchPlaceholder')"
        :model-value="listing.variantId.value"
        :wide-min="true"
        @change="listing.setVariantId($event)"
      />
    </template>

    <template #actions>
      <Button icon="pi pi-plus" :label="t('admin.actions.createImage')" @click="openCreateDialog" />
    </template>

    <template #items>
      <article
        v-for="image in listing.images.value"
        :key="image.id"
        class="grid gap-4 rounded-2xl border border-surface bg-surface-0 p-5 shadow-sm lg:grid-cols-[8rem_minmax(0,1fr)]"
      >
        <div class="overflow-hidden rounded-xl border border-surface bg-emphasis">
          <img
            v-if="image.url"
            :src="image.url"
            :alt="t('admin.images.previewAlt', { id: image.id })"
            class="h-32 w-full object-cover"
          />
          <div v-else class="flex h-32 items-center justify-center text-sm text-muted-color">
            {{ t('admin.images.noPreview') }}
          </div>
        </div>

        <div class="grid gap-4">
          <div class="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div class="space-y-2">
              <div class="flex flex-wrap items-center gap-2">
                <h2 class="text-lg font-semibold text-color">
                  {{ t('admin.images.imageLabel', { id: image.id }) }}
                </h2>
                <AdminStatusBadge
                  :label="
                    image.isPrimary
                      ? t('admin.images.primaryBadge')
                      : t('admin.images.secondaryBadge')
                  "
                />
              </div>
              <p class="break-all text-sm text-muted-color">
                {{ image.url || t('admin.images.noUrl') }}
              </p>
            </div>

            <div class="flex flex-wrap gap-2">
              <Button
                outlined
                severity="secondary"
                icon="pi pi-pencil"
                :label="t('admin.actions.edit')"
                @click="openEditDialog(image)"
              />
              <Button
                severity="danger"
                icon="pi pi-trash"
                :label="t('common.delete')"
                @click="openDeleteDialog(image)"
              />
            </div>
          </div>

          <AdminMetaGrid
            :columns="3"
            :items="[
              { label: t('admin.images.table.variantId'), value: image.variantId },
              { label: t('admin.images.table.sortOrder'), value: image.sortOrder },
              { label: t('admin.images.table.updatedAt'), value: image.updatedAt },
            ]"
          />
        </div>
      </article>
    </template>

    <template #dialog-content>
      <AdminImageUploadForm
        :key="`${dialogMode}-${activeImage?.id ?? 'new'}`"
        :mode="dialogMode"
        :image="activeImage"
        @cancel="dialogVisible = false"
        @success="handleSaved"
      />
    </template>
  </AdminListPage>
</template>
