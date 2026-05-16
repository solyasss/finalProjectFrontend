<script setup lang="ts">
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import FileUpload from 'primevue/fileupload'
import Message from 'primevue/message'
import { useI18n } from 'vue-i18n'
import { useAdminImageForm } from '@/composables/useAdminImageForm'
import type { AdminImage } from '@/api'

interface Props {
  mode: 'create' | 'edit'
  image?: AdminImage | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (event: 'success'): void
  (event: 'cancel'): void
}>()

const { t } = useI18n()
const form = useAdminImageForm({ mode: props.mode, image: props.image })

function onFileSelect(event: { files: File[] }) {
  form.setFile(event.files[0] ?? null)
}

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

    <!-- Variant ID + URL — 2-col grid -->
    <div class="grid gap-4 md:grid-cols-2">
      <div class="grid gap-1">
        <label class="text-sm font-medium text-color" for="variantId">
          {{ t('admin.images.fields.variantId') }}
        </label>
        <input
          id="variantId"
          v-model="form.draft.variantId"
          class="rounded-lg border border-surface px-3 py-2 text-sm"
          type="text"
        />
        <span class="text-xs text-muted-color">{{ t('admin.images.variantHint') }}</span>
        <span v-if="form.fieldErrors.variantId" class="text-xs text-red-500">
          {{ form.fieldErrors.variantId }}
        </span>
      </div>

      <div class="grid gap-1">
        <label class="text-sm font-medium text-color" for="imageUrl">
          {{ t('admin.images.fields.url') }}
        </label>
        <input
          id="imageUrl"
          v-model="form.draft.url"
          class="rounded-lg border border-surface px-3 py-2 text-sm"
          type="url"
        />
        <span class="text-xs text-muted-color">&nbsp;</span>
      </div>
    </div>

    <!-- File upload row — items-end so all bottoms align -->
    <div>
      <div class="flex items-end gap-6">
        <!-- FileUpload -->
        <div>
          <span class="block mb-1 text-sm font-medium text-color">
            {{ t('admin.images.fields.file') }}
          </span>
          <FileUpload
            mode="advanced"
            accept="image/*"
            :max-file-size="10000000"
            :show-upload-button="false"
            :show-cancel-button="false"
            :pt="{
              root: { class: 'text-sm border-0 shadow-none bg-transparent' },
              pcChooseButton: { root: { class: 'border-0 shadow-none' } },
              content: { class: 'border-0 shadow-none p-0 bg-transparent' },
              header: { class: 'p-0 bg-transparent border-0 shadow-none' },
            }"
            @select="onFileSelect"
            @clear="form.setFile(null)"
            @remove="form.setFile(null)"
          />
        </div>

        <!-- isPrimary checkbox -->
        <label class="flex items-center gap-2 text-sm pb-2">
          <Checkbox v-model="form.draft.isPrimary" binary />
          <span class="font-medium text-color">{{ t('admin.images.fields.isPrimary') }}</span>
        </label>
      </div>

      <span v-if="form.fieldErrors.file" class="mt-1 block text-xs text-red-500">
        {{ form.fieldErrors.file }}
      </span>
    </div>

    <!-- Sort order — standalone, left-aligned -->
    <div class="grid gap-1 justify-self-start">
      <label class="text-sm font-medium text-color" for="sortOrder">
        {{ t('admin.images.fields.sortOrder') }}
      </label>
      <input
        id="sortOrder"
        v-model="form.draft.sortOrder"
        class="w-64 rounded-lg border border-surface px-3 py-2 text-sm"
        inputmode="numeric"
        type="number"
      />
      <span v-if="form.fieldErrors.sortOrder" class="text-xs text-red-500">
        {{ form.fieldErrors.sortOrder }}
      </span>
    </div>

    <!-- Cancel/Save buttons — right-aligned -->
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
          props.mode === 'create' ? t('admin.actions.createImage') : t('admin.actions.saveImage')
        "
      />
    </div>
  </form>
</template>
