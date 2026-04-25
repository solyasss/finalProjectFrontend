<script setup lang="ts">
import { ref } from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Message from 'primevue/message'
import Password from 'primevue/password'
import { useI18n } from 'vue-i18n'
import { deleteAccount } from '@/api'
import AccountInfoCard from '@/components/molecules/AccountInfoCard/AccountInfoCard.vue'
import { useAuthStore } from '@/stores'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const authStore = useAuthStore()
const router = useRouter()

const visible = ref(false)
const password = ref('')
const errorMessage = ref<string | null>(null)
const successMessage = ref<string | null>(null)
const fieldError = ref<string | null>(null)
const submitting = ref(false)

function openDialog() {
  visible.value = true
  password.value = ''
  errorMessage.value = null
  fieldError.value = null
}

function closeDialog() {
  visible.value = false
  password.value = ''
  errorMessage.value = null
  fieldError.value = null
}

async function handleDeleteAccount() {
  if (submitting.value) {
    return
  }

  successMessage.value = null

  if (!password.value) {
    fieldError.value = t('accountPage.errors.required')
    return
  }

  submitting.value = true
  errorMessage.value = null
  fieldError.value = null

  const result = await deleteAccount({ password: password.value })

  submitting.value = false

  if (result.ok) {
    successMessage.value = t('accountPage.deleteAccountSuccess')
    closeDialog()
    await authStore.logout()
    await router.push({ name: 'home' })
    return
  }

  fieldError.value = result.error.fields?.password ?? null
  errorMessage.value = result.error.message || t('accountPage.errors.generic')
}
</script>

<template>
  <div class="contents">
    <AccountInfoCard
      :title="t('accountPage.deleteAccountTitle')"
      :description="t('accountPage.deleteAccountDescription')"
      :success-message="successMessage"
      :error-message="errorMessage"
    >
      <template #footer>
        <Button
          type="button"
          severity="danger"
          :label="t('accountPage.deleteAccountCta')"
          @click="openDialog"
        />
      </template>
    </AccountInfoCard>

    <Dialog
      v-model:visible="visible"
      modal
      :header="t('accountPage.deleteAccountDialogTitle')"
      :style="{ width: 'min(32rem, calc(100vw - 2rem))' }"
    >
      <form class="grid gap-5" @submit.prevent="handleDeleteAccount">
        <p class="text-sm leading-6 text-muted-color">
          {{ t('accountPage.deleteAccountDialogDescription') }}
        </p>

        <div>
          <label for="delete-account-password" class="mb-2 block text-sm font-bold text-color">
            {{ t('accountPage.fields.deletePassword') }}
          </label>
          <Password
            input-id="delete-account-password"
            v-model="password"
            fluid
            toggle-mask
            :feedback="false"
            autocomplete="current-password"
            :invalid="Boolean(fieldError)"
            @blur="fieldError = password ? null : t('accountPage.errors.required')"
          />
          <Message v-if="fieldError" severity="error" size="small" variant="simple">
            {{ fieldError }}
          </Message>
        </div>

        <Message v-if="errorMessage" severity="error">{{ errorMessage }}</Message>

        <div class="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            text
            severity="secondary"
            :label="t('common.cancel')"
            @click="closeDialog"
          />
          <Button
            type="submit"
            severity="danger"
            :loading="submitting"
            :label="t('accountPage.deleteAccountConfirm')"
          />
        </div>
      </form>
    </Dialog>
  </div>
</template>
