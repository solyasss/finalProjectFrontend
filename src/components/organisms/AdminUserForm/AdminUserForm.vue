<script setup lang="ts">
import Button from 'primevue/button'
import Message from 'primevue/message'
import { useI18n } from 'vue-i18n'
import { useAdminUserForm } from '@/composables/useAdminUserForm'
import type { AdminUser } from '@/api'

interface Props {
  mode: 'create' | 'edit'
  user?: AdminUser | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (event: 'success'): void
  (event: 'cancel'): void
}>()

const { t } = useI18n()
const form = useAdminUserForm({ mode: props.mode, user: props.user })

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
        <span class="font-medium text-color">{{ t('admin.users.fields.firstName') }}</span>
        <input
          v-model="form.draft.firstName"
          class="rounded-lg border border-surface px-3 py-2"
          type="text"
        />
        <span v-if="form.fieldErrors.firstName" class="text-xs text-red-500">{{
          form.fieldErrors.firstName
        }}</span>
      </label>

      <label class="grid gap-2 text-sm">
        <span class="font-medium text-color">{{ t('admin.users.fields.lastName') }}</span>
        <input
          v-model="form.draft.lastName"
          class="rounded-lg border border-surface px-3 py-2"
          type="text"
        />
        <span v-if="form.fieldErrors.lastName" class="text-xs text-red-500">{{
          form.fieldErrors.lastName
        }}</span>
      </label>
    </div>

    <label class="grid gap-2 text-sm">
      <span class="font-medium text-color">{{ t('admin.users.fields.email') }}</span>
      <input
        v-model="form.draft.email"
        class="rounded-lg border border-surface px-3 py-2"
        type="email"
      />
      <span v-if="form.fieldErrors.email" class="text-xs text-red-500">{{
        form.fieldErrors.email
      }}</span>
    </label>

    <label v-if="props.mode === 'create'" class="grid gap-2 text-sm">
      <span class="font-medium text-color">{{ t('admin.users.fields.password') }}</span>
      <input
        v-model="form.draft.password"
        class="rounded-lg border border-surface px-3 py-2"
        type="password"
      />
      <span v-if="form.fieldErrors.password" class="text-xs text-red-500">{{
        form.fieldErrors.password
      }}</span>
    </label>

    <label class="grid gap-2 text-sm">
      <span class="font-medium text-color">{{ t('admin.users.fields.role') }}</span>
      <select v-model="form.draft.role" class="rounded-lg border border-surface px-3 py-2">
        <option value="USER">USER</option>
        <option value="MANAGER">MANAGER</option>
        <option value="ADMIN">ADMIN</option>
      </select>
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
          props.mode === 'create' ? t('admin.actions.createUser') : t('admin.actions.editUser')
        "
      />
    </div>
  </form>
</template>
