<script setup lang="ts">
import Button from 'primevue/button'
import Message from 'primevue/message'
import { useI18n } from 'vue-i18n'
import { useAdminOrderStatusForm } from '@/composables/useAdminOrderStatusForm'
import type { AdminOrder } from '@/api'

interface Props {
  order: AdminOrder
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (event: 'success'): void
  (event: 'cancel'): void
}>()

const { t } = useI18n()
const form = useAdminOrderStatusForm({ order: props.order })

async function handleSubmit() {
  const succeeded = await form.submit()
  if (succeeded) emit('success')
}
</script>

<template>
  <form class="grid gap-5" @submit.prevent="handleSubmit">
    <Message v-if="form.formError.value" severity="error">{{ form.formError.value }}</Message>

    <label class="grid gap-2 text-sm">
      <span class="font-medium text-color">{{ t('admin.orders.table.status') }}</span>
      <select v-model="form.draft.status" class="rounded-lg border border-surface px-3 py-2">
        <option value="PENDING">PENDING</option>
        <option value="PAID">PAID</option>
        <option value="SHIPPED">SHIPPED</option>
        <option value="DELIVERED">DELIVERED</option>
        <option value="CANCELLED">CANCELLED</option>
      </select>
      <span v-if="form.fieldErrors.status" class="text-xs text-red-500">{{
        form.fieldErrors.status
      }}</span>
    </label>

    <div class="flex flex-col gap-3 sm:flex-row sm:justify-end">
      <Button
        type="button"
        text
        severity="secondary"
        :label="t('common.cancel')"
        @click="emit('cancel')"
      />
      <Button
        type="submit"
        :loading="form.submitting.value"
        :label="t('admin.actions.updateOrderStatus')"
      />
    </div>
  </form>
</template>
