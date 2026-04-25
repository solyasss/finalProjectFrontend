<script setup lang="ts">
import { ref } from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Message from 'primevue/message'
import { useI18n } from 'vue-i18n'
import { deleteAccount } from '@/api'
import AccountInfoCard from '@/components/molecules/AccountInfoCard/AccountInfoCard.vue'
import { useAuthStore } from '@/stores'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const authStore = useAuthStore()
const router = useRouter()

const visible = ref(false)
const errorMessage = ref<string | null>(null)
const successMessage = ref<string | null>(null)
const submitting = ref(false)

function openDialog() {
  visible.value = true
  errorMessage.value = null
}

function closeDialog() {
  visible.value = false
  errorMessage.value = null
}

async function handleDeleteAccount() {
  if (submitting.value) {
    return
  }

  successMessage.value = null

  submitting.value = true
  errorMessage.value = null

  const result = await deleteAccount()

  submitting.value = false

  if (result.ok) {
    successMessage.value = t('accountPage.deleteAccountSuccess')
    closeDialog()
    await authStore.logout()
    await router.push({ name: 'home' })
    return
  }

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
          {{ t('accountPage.deleteAccountDescription') }}
        </p>

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
