<script setup lang="ts">
import Button from 'primevue/button'
import Message from 'primevue/message'
import Password from 'primevue/password'
import { useI18n } from 'vue-i18n'
import AccountInfoCard from '@/components/molecules/AccountInfoCard/AccountInfoCard.vue'
import { useChangePasswordForm } from '@/composables/useChangePasswordForm'

const { t } = useI18n()
const {
  draft,
  fieldErrors,
  formError,
  successMessage,
  submitting,
  markTouched,
  submitChangePassword,
} = useChangePasswordForm()

async function handleSubmit() {
  await submitChangePassword()
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <AccountInfoCard
      :title="t('accountPage.passwordTitle')"
      :description="t('accountPage.passwordDescription')"
      :success-message="successMessage"
      :error-message="formError"
    >
      <div class="grid gap-5">
        <div>
          <label for="account-current-password" class="mb-2 block text-sm font-bold text-color">
            {{ t('accountPage.fields.currentPassword') }}
          </label>
          <Password
            input-id="account-current-password"
            v-model="draft.currentPassword"
            fluid
            toggle-mask
            :feedback="false"
            autocomplete="current-password"
            :invalid="Boolean(fieldErrors.currentPassword)"
            @blur="markTouched('currentPassword')"
          />
          <Message
            v-if="fieldErrors.currentPassword"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ fieldErrors.currentPassword }}
          </Message>
        </div>

        <div>
          <label for="account-new-password" class="mb-2 block text-sm font-bold text-color">
            {{ t('accountPage.fields.newPassword') }}
          </label>
          <Password
            input-id="account-new-password"
            v-model="draft.newPassword"
            fluid
            toggle-mask
            :feedback="false"
            autocomplete="new-password"
            :invalid="Boolean(fieldErrors.newPassword)"
            @blur="markTouched('newPassword')"
          />
          <Message v-if="fieldErrors.newPassword" severity="error" size="small" variant="simple">
            {{ fieldErrors.newPassword }}
          </Message>
        </div>

        <div>
          <label for="account-confirm-password" class="mb-2 block text-sm font-bold text-color">
            {{ t('accountPage.fields.confirmPassword') }}
          </label>
          <Password
            input-id="account-confirm-password"
            v-model="draft.confirmPassword"
            fluid
            toggle-mask
            :feedback="false"
            autocomplete="new-password"
            :invalid="Boolean(fieldErrors.confirmPassword)"
            @blur="markTouched('confirmPassword')"
          />
          <Message
            v-if="fieldErrors.confirmPassword"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ fieldErrors.confirmPassword }}
          </Message>
        </div>
      </div>

      <template #footer>
        <Button
          type="submit"
          :loading="submitting"
          :label="submitting ? t('common.submitting') : t('accountPage.cardSave')"
        />
      </template>
    </AccountInfoCard>
  </form>
</template>
