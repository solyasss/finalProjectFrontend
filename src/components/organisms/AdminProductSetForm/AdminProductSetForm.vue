<script setup lang="ts">
import Button from 'primevue/button'
import Message from 'primevue/message'
import Textarea from 'primevue/textarea'
import { useI18n } from 'vue-i18n'
import { useAdminProductSetForm } from '@/composables/useAdminProductSetForm'
import type { AdminProductSet } from '@/api'

interface Props {
  mode: 'create' | 'edit'
  productSet?: AdminProductSet | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (event: 'success'): void
  (event: 'cancel'): void
}>()

const { t } = useI18n()
const form = useAdminProductSetForm({ mode: props.mode, productSet: props.productSet })

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
        <span class="font-medium text-color">{{ t('admin.productSets.fields.name') }}</span>
        <input
          v-model="form.draft.name"
          class="rounded-lg border border-surface px-3 py-2"
          type="text"
        />
        <span v-if="form.fieldErrors.name" class="text-xs text-red-500">{{
          form.fieldErrors.name
        }}</span>
      </label>

      <label class="grid gap-2 text-sm">
        <span class="font-medium text-color">{{ t('admin.productSets.fields.slug') }}</span>
        <input
          v-model="form.draft.slug"
          class="rounded-lg border border-surface px-3 py-2"
          type="text"
        />
        <span v-if="form.fieldErrors.slug" class="text-xs text-red-500">{{
          form.fieldErrors.slug
        }}</span>
      </label>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <label class="grid gap-2 text-sm">
        <span class="font-medium text-color">{{ t('admin.productSets.fields.imageUrl') }}</span>
        <input
          v-model="form.draft.imageUrl"
          class="rounded-lg border border-surface px-3 py-2"
          type="url"
        />
      </label>

      <label class="grid gap-2 text-sm">
        <span class="font-medium text-color">{{ t('admin.productSets.fields.roomId') }}</span>
        <input
          v-model="form.draft.roomId"
          class="rounded-lg border border-surface px-3 py-2"
          inputmode="numeric"
          type="text"
        />
        <span v-if="form.fieldErrors.roomId" class="text-xs text-red-500">{{
          form.fieldErrors.roomId
        }}</span>
      </label>
    </div>

    <label class="grid gap-2 text-sm">
      <span class="font-medium text-color">{{ t('admin.productSets.fields.file') }}</span>
      <input
        class="rounded-lg border border-surface px-3 py-2"
        type="file"
        accept="image/*"
        @change="form.draft.file = ($event.target as HTMLInputElement).files?.[0] ?? null"
      />
    </label>

    <label class="grid gap-2 text-sm">
      <span class="font-medium text-color">{{ t('admin.productSets.fields.variantIds') }}</span>
      <Textarea v-model="form.draft.variantIds" rows="5" auto-resize />
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
        :label="
          props.mode === 'create'
            ? t('admin.actions.createProductSet')
            : t('admin.actions.editProductSet')
        "
      />
    </div>
  </form>
</template>
