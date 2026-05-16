<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { deleteAdminReview, type AdminReview } from '@/api'
import AdminListPage from '@/components/organisms/AdminListPage/AdminListPage.vue'
import AdminEntityCard from '@/components/molecules/AdminEntityCard/AdminEntityCard.vue'
import AdminSearchField from '@/components/molecules/AdminSearchField/AdminSearchField.vue'
import AdminMetaGrid from '@/components/molecules/AdminMetaGrid/AdminMetaGrid.vue'
import AdminStatusBadge from '@/components/atoms/AdminStatusBadge/AdminStatusBadge.vue'
import AdminReviewForm from '@/components/organisms/AdminReviewForm/AdminReviewForm.vue'
import { useAdminReviewsListing } from '@/composables/useAdminReviewsListing'

const { t } = useI18n()
const listing = useAdminReviewsListing()

const dialogVisible = ref(false)
const activeReview = ref<AdminReview | null>(null)
const deleteVisible = ref(false)
const deleteLoading = ref(false)
const deleteError = ref<string | null>(null)
const deleteTarget = ref<AdminReview | null>(null)

const productIdInput = ref(
  listing.productIdFilter.value ? String(listing.productIdFilter.value) : '',
)

function openEditDialog(review: AdminReview) {
  activeReview.value = review
  dialogVisible.value = true
}

function openDeleteDialog(review: AdminReview) {
  deleteTarget.value = review
  deleteVisible.value = true
  deleteError.value = null
}

function applyProductIdFilter() {
  const value = Number(productIdInput.value)
  listing.setProductId(Number.isFinite(value) && value > 0 ? value : undefined)
}

async function confirmDelete() {
  if (!deleteTarget.value) return
  deleteLoading.value = true
  deleteError.value = null
  const result = await deleteAdminReview(deleteTarget.value.id)
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
  activeReview.value = null
  listing.reload()
}
</script>

<template>
  <AdminListPage
    :loading="listing.loading.value"
    :error="listing.error.value"
    :empty="!listing.reviews.value.length"
    :empty-message="t('admin.reviews.empty')"
    :current-page="listing.currentPage.value"
    :total="listing.pagination.value.total"
    :limit="listing.pagination.value.limit"
    v-model:dialog-visible="dialogVisible"
    :dialog-header="t('admin.actions.editReview')"
    :dialog-width="'min(48rem, calc(100vw - 2rem))'"
    v-model:delete-visible="deleteVisible"
    :delete-title="t('admin.reviews.deleteTitle')"
    :delete-description="t('admin.reviews.deleteDescription', { id: deleteTarget?.id ?? '' })"
    :delete-confirm-label="t('admin.actions.deleteReview')"
    :delete-loading="deleteLoading"
    :delete-error="deleteError"
    @page="listing.setPage"
    @confirm-delete="confirmDelete"
  >
    <template #filters>
      <AdminSearchField
        :label="t('admin.reviews.searchLabel')"
        :placeholder="t('admin.reviews.searchPlaceholder')"
        :model-value="listing.filter.value"
        :wide-min="true"
        @change="listing.setFilter($event)"
      />
      <AdminSearchField
        :label="t('admin.reviews.filterProductLabel')"
        v-model="productIdInput"
        type="number"
        inputmode="numeric"
        @change="applyProductIdFilter"
      />
    </template>

    <template #items>
      <AdminEntityCard
        v-for="review in listing.reviews.value"
        :key="review.id"
        :title="`Review #${review.id}`"
        :entity-id="review.id"
        :description="`${review.text.slice(0, 100)}${review.text.length > 100 ? '…' : ''}`"
        @edit="openEditDialog(review)"
        @delete="openDeleteDialog(review)"
      >
        <template #badges>
          <AdminStatusBadge :label="review.status" variant="status" />
        </template>
        <template #meta>
          <AdminMetaGrid
            :columns="4"
            :items="[
              { label: t('admin.reviews.table.rating'), value: review.rating },
              { label: t('admin.reviews.table.status'), value: review.status },
              { label: t('admin.reviews.table.userId'), value: review.userId },
              { label: t('admin.reviews.table.productId'), value: review.productId },
            ]"
          />
        </template>
      </AdminEntityCard>
    </template>

    <template #dialog-content>
      <AdminReviewForm
        v-if="activeReview"
        :key="activeReview.id"
        :review="activeReview"
        @cancel="dialogVisible = false"
        @success="handleSaved"
      />
    </template>
  </AdminListPage>
</template>
