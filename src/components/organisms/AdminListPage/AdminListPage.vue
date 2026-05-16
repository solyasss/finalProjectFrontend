<script setup lang="ts">
import AdminFilterBar from '@/components/molecules/AdminFilterBar/AdminFilterBar.vue'
import AdminListingMessages from '@/components/molecules/AdminListingMessages/AdminListingMessages.vue'
import AdminPaginationBar from '@/components/molecules/AdminPaginationBar/AdminPaginationBar.vue'
import AdminFormDialog from '@/components/molecules/AdminFormDialog/AdminFormDialog.vue'
import DeleteEntityDialog from '@/components/molecules/DeleteEntityDialog/DeleteEntityDialog.vue'

interface Props {
  // Listing state
  loading: boolean
  error?: string | null
  empty: boolean
  emptyMessage: string

  // Pagination
  currentPage: number
  total: number
  limit: number

  // Edit/Create dialog (optional — pages without dialogs can omit)
  dialogVisible?: boolean
  dialogHeader?: string
  dialogWidth?: string
  dialogLoading?: boolean

  // Delete dialog
  deleteVisible?: boolean
  deleteTitle?: string
  deleteDescription?: string
  deleteConfirmLabel?: string
  deleteLoading?: boolean
  deleteError?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  dialogVisible: false,
  deleteVisible: false,
})

const emit = defineEmits<{
  (event: 'update:dialogVisible', value: boolean): void
  (event: 'update:deleteVisible', value: boolean): void
  (event: 'page', page: number): void
  (event: 'confirmDelete'): void
}>()
</script>

<template>
  <section class="grid gap-5">
    <!-- Filter / Actions bar -->
    <AdminFilterBar>
      <slot name="filters" />
      <template #actions>
        <slot name="actions" />
      </template>
    </AdminFilterBar>

    <!-- State messages -->
    <AdminListingMessages
      :loading="loading"
      :error="error"
      :empty="empty"
      :empty-message="emptyMessage"
    />

    <!-- Items list + pagination -->
    <div v-if="!loading && !error && !empty" class="grid gap-4">
      <slot name="items" />
      <AdminPaginationBar
        :current-page="currentPage"
        :total="total"
        :limit="limit"
        @page="emit('page', $event)"
      />
    </div>

    <!-- Edit/Create dialog (rendered only if dialogHeader is provided) -->
    <AdminFormDialog
      v-if="dialogHeader"
      :visible="dialogVisible"
      :header="dialogHeader"
      :loading="dialogLoading"
      :width="dialogWidth"
      @update:visible="emit('update:dialogVisible', $event)"
    >
      <slot name="dialog-content" />
    </AdminFormDialog>

    <!-- Delete dialog (rendered only if deleteTitle is provided) -->
    <DeleteEntityDialog
      v-if="deleteTitle"
      :visible="deleteVisible"
      :title="deleteTitle"
      :description="deleteDescription ?? ''"
      :confirm-label="deleteConfirmLabel ?? ''"
      :loading="deleteLoading"
      :error-message="deleteError"
      @update:visible="emit('update:deleteVisible', $event)"
      @confirm="emit('confirmDelete')"
    />
  </section>
</template>
