<script setup lang="ts">
import Button from 'primevue/button'
import FileUpload from 'primevue/fileupload'
import Message from 'primevue/message'
import Textarea from 'primevue/textarea'
import { useI18n } from 'vue-i18n'
import { useAdminCategoryForm } from '@/composables/useAdminCategoryForm'
import type { AdminCategory } from '@/api'

interface Props {
  mode: 'create' | 'edit'
  category?: AdminCategory | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (event: 'success'): void
  (event: 'cancel'): void
}>()

const { t } = useI18n()
const form = useAdminCategoryForm({ mode: props.mode, category: props.category })

async function handleSubmit() {
  const succeeded = await form.submit()
  if (succeeded) {
    emit('success')
  }
}
</script>

<template>
  <form class="grid gap-5" @submit.prevent="handleSubmit">
    <Message v-if="form.formError.value" severity="error">{{ form.formError.value }}</Message>

    <div class="grid gap-4 md:grid-cols-2">
      <label class="grid gap-2 text-sm">
        <span class="font-medium text-color">{{ t('admin.categories.fields.name') }}</span>
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
        <span class="font-medium text-color">{{ t('admin.categories.fields.slug') }}</span>
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

    <label class="grid gap-2 text-sm">
      <span class="font-medium text-color">{{ t('admin.categories.fields.description') }}</span>
      <Textarea v-model="form.draft.description" rows="4" auto-resize />
    </label>

    <div class="grid items-start gap-4 md:grid-cols-3">
      <div class="grid self-start gap-2 text-sm">
        <span class="font-medium text-color">{{ t('admin.categories.fields.imageUrl') }}</span>
        <FileUpload
          mode="basic"
          accept="image/*"
          :auto="false"
          :show-upload-button="false"
          :pt="{
            root: { class: 'text-sm' },
            pcChooseButton: { root: { class: 'border-0 shadow-none' } },
          }"
          @select="form.selectFile($event.files[0] ?? null)"
          @clear="form.clearFile()"
        />
        <input
          v-model="form.draft.imageUrl"
          class="rounded-lg border border-surface px-3 py-2"
          type="url"
          :placeholder="t('admin.categories.fields.imageUrl')"
        />
        <span class="text-xs text-muted-color">{{ t('admin.categories.uploadHint') }}</span>
        <span v-if="form.fieldErrors.file" class="text-xs text-red-500">{{
          form.fieldErrors.file
        }}</span>
      </div>

      <label class="grid self-start gap-2 text-sm">
        <span class="font-medium text-color">{{ t('admin.categories.fields.sortOrder') }}</span>
        <input
          v-model="form.draft.sortOrder"
          class="rounded-lg border border-surface px-3 py-2"
          type="number"
        />
        <span v-if="form.fieldErrors.sortOrder" class="text-xs text-red-500">{{
          form.fieldErrors.sortOrder
        }}</span>
      </label>

      <label class="grid self-start gap-2 text-sm">
        <span class="font-medium text-color">{{ t('admin.categories.fields.parentId') }}</span>
        <input
          v-model="form.draft.parentId"
          class="rounded-lg border border-surface px-3 py-2"
          inputmode="numeric"
          type="text"
        />
        <span class="text-xs text-muted-color">{{ t('admin.categories.parentHint') }}</span>
        <span v-if="form.fieldErrors.parentId" class="text-xs text-red-500">{{
          form.fieldErrors.parentId
        }}</span>
      </label>
    </div>

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
            ? t('admin.actions.createCategory')
            : t('admin.actions.saveCategory')
        "
      />
    </div>
  </form>
</template>
