<script setup lang="ts">
import Button from 'primevue/button'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { deleteAdminUser, getAdminUser, type AdminUser } from '@/api'
import AdminListPage from '@/components/organisms/AdminListPage/AdminListPage.vue'
import AdminEntityCard from '@/components/molecules/AdminEntityCard/AdminEntityCard.vue'
import AdminMetaGrid from '@/components/molecules/AdminMetaGrid/AdminMetaGrid.vue'
import AdminStatusBadge from '@/components/atoms/AdminStatusBadge/AdminStatusBadge.vue'
import AdminUserForm from '@/components/organisms/AdminUserForm/AdminUserForm.vue'
import { useAdminUsersListing } from '@/composables/useAdminUsersListing'

const { t } = useI18n()
const listing = useAdminUsersListing()

const dialogVisible = ref(false)
const dialogMode = ref<'create' | 'edit'>('create')
const activeUser = ref<AdminUser | null>(null)
const dialogLoading = ref(false)
const deleteVisible = ref(false)
const deleteLoading = ref(false)
const deleteError = ref<string | null>(null)
const deleteTarget = ref<AdminUser | null>(null)

function openCreateDialog() {
  activeUser.value = null
  dialogMode.value = 'create'
  dialogVisible.value = true
}

async function openEditDialog(user: AdminUser) {
  dialogLoading.value = true
  dialogMode.value = 'edit'
  dialogVisible.value = true
  const result = await getAdminUser(user.id)
  dialogLoading.value = false
  if (!result.ok) {
    listing.error.value =
      result.error.code === 'FORBIDDEN'
        ? t('admin.messages.forbidden')
        : result.error.message || t('admin.messages.loadFailed')
    dialogVisible.value = false
    return
  }
  activeUser.value = result.data
}

function openDeleteDialog(user: AdminUser) {
  deleteTarget.value = user
  deleteVisible.value = true
  deleteError.value = null
}

async function confirmDelete() {
  if (!deleteTarget.value) return
  deleteLoading.value = true
  deleteError.value = null
  const result = await deleteAdminUser(deleteTarget.value.id)
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
  activeUser.value = null
  listing.reload()
}
</script>

<template>
  <AdminListPage
    :loading="listing.loading.value"
    :error="listing.error.value"
    :empty="!listing.users.value.length"
    :empty-message="t('admin.users.empty')"
    :current-page="listing.currentPage.value"
    :total="listing.pagination.value.total"
    :limit="listing.pagination.value.limit"
    v-model:dialog-visible="dialogVisible"
    :dialog-header="
      dialogMode === 'create' ? t('admin.actions.createUser') : t('admin.actions.editUser')
    "
    :dialog-loading="dialogLoading"
    :dialog-width="'min(48rem, calc(100vw - 2rem))'"
    v-model:delete-visible="deleteVisible"
    :delete-title="t('admin.users.deleteTitle')"
    :delete-description="t('admin.users.deleteDescription', { email: deleteTarget?.email ?? '' })"
    :delete-confirm-label="t('admin.actions.deleteUser')"
    :delete-loading="deleteLoading"
    :delete-error="deleteError"
    @page="listing.setPage"
    @confirm-delete="confirmDelete"
  >
    <template #actions>
      <Button icon="pi pi-plus" :label="t('admin.actions.createUser')" @click="openCreateDialog" />
    </template>

    <template #items>
      <AdminEntityCard
        v-for="user in listing.users.value"
        :key="user.id"
        :title="user.email"
        :entity-id="user.id"
        :subtitle="`${user.firstName} ${user.lastName}`"
        @edit="openEditDialog(user)"
        @delete="openDeleteDialog(user)"
      >
        <template #badges>
          <AdminStatusBadge v-if="user.role" :label="user.role" variant="role" />
        </template>
        <template #meta>
          <AdminMetaGrid
            :columns="3"
            :items="[
              { label: t('admin.users.table.firstName'), value: user.firstName },
              { label: t('admin.users.table.role'), value: user.role },
              { label: t('admin.users.table.createdAt'), value: user.createdAt },
            ]"
          />
        </template>
      </AdminEntityCard>
    </template>

    <template #dialog-content>
      <AdminUserForm
        :key="`${dialogMode}-${activeUser?.id ?? 'new'}`"
        :mode="dialogMode"
        :user="activeUser"
        @cancel="dialogVisible = false"
        @success="handleSaved"
      />
    </template>
  </AdminListPage>
</template>
