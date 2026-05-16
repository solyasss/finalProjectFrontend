<script setup lang="ts">
import Button from 'primevue/button'
import Message from 'primevue/message'
import Textarea from 'primevue/textarea'
import { useI18n } from 'vue-i18n'
import { useAdminReviewForm } from '@/composables/useAdminReviewForm'
import type { AdminReview } from '@/api'

interface Props {
  review: AdminReview
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (event: 'success'): void
  (event: 'cancel'): void
}>()

const { t } = useI18n()
const form = useAdminReviewForm({ review: props.review })

async function handleSubmit() {
  const succeeded = await form.submit()
  if (succeeded) emit('success')
}
</script>

<template>
  <form class="grid gap-5" @submit.prevent="handleSubmit">
    <Message v-if="form.formError.value" severity="error">{{ form.formError.value }}</Message>

    <div class="grid gap-4 md:grid-cols-2">
      <label class="grid gap-2 text-sm">
        <span class="font-medium text-color">{{ t('admin.reviews.fields.rating') }}</span>
        <input
          v-model="form.draft.rating"
          class="rounded-lg border border-surface px-3 py-2"
          inputmode="numeric"
          type="text"
        />
        <span v-if="form.fieldErrors.rating" class="text-xs text-red-500">{{
          form.fieldErrors.rating
        }}</span>
      </label>

      <label class="grid gap-2 text-sm">
        <span class="font-medium text-color">{{ t('admin.reviews.fields.status') }}</span>
        <select v-model="form.draft.status" class="rounded-lg border border-surface px-3 py-2">
          <option value="PENDING">PENDING</option>
          <option value="APPROVED">APPROVED</option>
          <option value="REJECTED">REJECTED</option>
        </select>
      </label>
    </div>

    <label class="grid gap-2 text-sm">
      <span class="font-medium text-color">{{ t('admin.reviews.fields.text') }}</span>
      <Textarea v-model="form.draft.text" rows="5" auto-resize />
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
        :label="t('admin.actions.editReview')"
      />
    </div>
  </form>
</template>
