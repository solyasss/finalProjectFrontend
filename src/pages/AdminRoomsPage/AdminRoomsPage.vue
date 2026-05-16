<script setup lang="ts">
import Button from 'primevue/button'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { deleteAdminRoom, type AdminRoom } from '@/api'
import AdminListPage from '@/components/organisms/AdminListPage/AdminListPage.vue'
import AdminEntityCard from '@/components/molecules/AdminEntityCard/AdminEntityCard.vue'
import AdminSearchField from '@/components/molecules/AdminSearchField/AdminSearchField.vue'
import AdminMetaGrid from '@/components/molecules/AdminMetaGrid/AdminMetaGrid.vue'
import AdminRoomForm from '@/components/organisms/AdminRoomForm/AdminRoomForm.vue'
import { useAdminRoomsListing } from '@/composables/useAdminRoomsListing'

const { t } = useI18n()
const listing = useAdminRoomsListing()

const dialogVisible = ref(false)
const dialogMode = ref<'create' | 'edit'>('create')
const activeRoom = ref<AdminRoom | null>(null)
const deleteVisible = ref(false)
const deleteLoading = ref(false)
const deleteError = ref<string | null>(null)
const deleteTarget = ref<AdminRoom | null>(null)

function openCreateDialog() {
  activeRoom.value = null
  dialogMode.value = 'create'
  dialogVisible.value = true
}

function openEditDialog(room: AdminRoom) {
  activeRoom.value = room
  dialogMode.value = 'edit'
  dialogVisible.value = true
}

function openDeleteDialog(room: AdminRoom) {
  deleteTarget.value = room
  deleteVisible.value = true
  deleteError.value = null
}

async function confirmDelete() {
  if (!deleteTarget.value) return
  deleteLoading.value = true
  deleteError.value = null
  const result = await deleteAdminRoom(deleteTarget.value.id)
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
  activeRoom.value = null
  listing.reload()
}
</script>

<template>
  <AdminListPage
    :loading="listing.loading.value"
    :error="listing.error.value"
    :empty="!listing.rooms.value.length"
    :empty-message="t('admin.rooms.empty')"
    :current-page="listing.currentPage.value"
    :total="listing.pagination.value.total"
    :limit="listing.pagination.value.limit"
    v-model:dialog-visible="dialogVisible"
    :dialog-header="
      dialogMode === 'create' ? t('admin.actions.createRoom') : t('admin.actions.editRoom')
    "
    v-model:delete-visible="deleteVisible"
    :delete-title="t('admin.rooms.deleteTitle')"
    :delete-description="t('admin.rooms.deleteDescription', { name: deleteTarget?.name ?? '' })"
    :delete-confirm-label="t('admin.actions.deleteRoom')"
    :delete-loading="deleteLoading"
    :delete-error="deleteError"
    @page="listing.setPage"
    @confirm-delete="confirmDelete"
  >
    <template #filters>
      <AdminSearchField
        :label="t('admin.rooms.searchLabel')"
        :placeholder="t('admin.rooms.searchPlaceholder')"
        :model-value="listing.filter.value"
        :wide-min="true"
        @change="listing.setFilter($event)"
      />
    </template>

    <template #actions>
      <Button icon="pi pi-plus" :label="t('admin.actions.createRoom')" @click="openCreateDialog" />
    </template>

    <template #items>
      <AdminEntityCard
        v-for="room in listing.rooms.value"
        :key="room.id"
        :title="room.name"
        :entity-id="room.id"
        :subtitle="`/${room.slug}`"
        :description="room.description || t('admin.rooms.noDescription')"
        @edit="openEditDialog(room)"
        @delete="openDeleteDialog(room)"
      >
        <template #meta>
          <AdminMetaGrid
            :columns="3"
            :items="[
              { label: t('admin.rooms.table.sortOrder'), value: room.sortOrder },
              {
                label: t('admin.status.active'),
                value: room.isActive ? t('admin.status.active') : t('admin.status.hidden'),
              },
              { label: t('admin.rooms.table.updatedAt'), value: room.updatedAt },
            ]"
          />
        </template>
      </AdminEntityCard>
    </template>

    <template #dialog-content>
      <AdminRoomForm
        :key="`${dialogMode}-${activeRoom?.id ?? 'new'}`"
        :mode="dialogMode"
        :room="activeRoom"
        @cancel="dialogVisible = false"
        @success="handleSaved"
      />
    </template>
  </AdminListPage>
</template>
