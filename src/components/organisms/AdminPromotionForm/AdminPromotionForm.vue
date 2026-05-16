<script setup lang="ts">
import Button from 'primevue/button'
import Message from 'primevue/message'
import Textarea from 'primevue/textarea'
import { useI18n } from 'vue-i18n'
import { useAdminPromotionForm } from '@/composables/useAdminPromotionForm'
import type { AdminPromotion } from '@/api'

interface Props {
  mode: 'create' | 'edit'
  promotion?: AdminPromotion | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (event: 'success'): void
  (event: 'cancel'): void
}>()

const { t } = useI18n()
const form = useAdminPromotionForm({ mode: props.mode, promotion: props.promotion })

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
        <span class="font-medium text-color">{{ t('admin.promotions.fields.name') }}</span>
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
        <span class="font-medium text-color">{{ t('admin.promotions.fields.slug') }}</span>
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
      <span class="font-medium text-color">{{ t('admin.promotions.fields.description') }}</span>
      <Textarea v-model="form.draft.description" rows="3" auto-resize />
    </label>

    <div class="grid gap-4 md:grid-cols-2">
      <label class="grid gap-2 text-sm">
        <span class="font-medium text-color">{{ t('admin.promotions.fields.discountType') }}</span>
        <select
          v-model="form.draft.discountType"
          class="rounded-lg border border-surface px-3 py-2"
        >
          <option value="PERCENTAGE">PERCENTAGE</option>
          <option value="FIXED_AMOUNT">FIXED_AMOUNT</option>
        </select>
      </label>

      <label class="grid gap-2 text-sm">
        <span class="font-medium text-color">{{ t('admin.promotions.fields.discountValue') }}</span>
        <input
          v-model="form.draft.discountValue"
          class="rounded-lg border border-surface px-3 py-2"
          inputmode="numeric"
          type="text"
        />
        <span v-if="form.fieldErrors.discountValue" class="text-xs text-red-500">{{
          form.fieldErrors.discountValue
        }}</span>
      </label>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <label class="grid gap-2 text-sm">
        <span class="font-medium text-color">{{ t('admin.promotions.fields.targetType') }}</span>
        <select v-model="form.draft.targetType" class="rounded-lg border border-surface px-3 py-2">
          <option value="GLOBAL">GLOBAL</option>
          <option value="CATEGORY">CATEGORY</option>
          <option value="VARIANT">VARIANT</option>
        </select>
      </label>

      <label class="grid gap-2 text-sm">
        <span class="font-medium text-color">{{ t('admin.promotions.fields.isActive') }}</span>
        <div class="flex items-center gap-2 pt-2">
          <input v-model="form.draft.isActive" type="checkbox" class="h-4 w-4" />
          <span class="text-muted-color">{{ t('admin.promotions.fields.isActive') }}</span>
        </div>
      </label>
    </div>

    <label class="grid gap-2 text-sm">
      <span class="font-medium text-color">{{ t('admin.promotions.fields.targetIds') }}</span>
      <Textarea v-model="form.draft.targetIds" rows="4" auto-resize />
    </label>

    <div class="grid gap-4 md:grid-cols-2">
      <label class="grid gap-2 text-sm">
        <span class="font-medium text-color">{{ t('admin.promotions.fields.startDate') }}</span>
        <input
          v-model="form.draft.startDate"
          class="rounded-lg border border-surface px-3 py-2"
          type="date"
        />
        <span v-if="form.fieldErrors.startDate" class="text-xs text-red-500">{{
          form.fieldErrors.startDate
        }}</span>
      </label>

      <label class="grid gap-2 text-sm">
        <span class="font-medium text-color">{{ t('admin.promotions.fields.endDate') }}</span>
        <input
          v-model="form.draft.endDate"
          class="rounded-lg border border-surface px-3 py-2"
          type="date"
        />
        <span v-if="form.fieldErrors.endDate" class="text-xs text-red-500">{{
          form.fieldErrors.endDate
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
            ? t('admin.actions.createPromotion')
            : t('admin.actions.editPromotion')
        "
      />
    </div>
  </form>
</template>
