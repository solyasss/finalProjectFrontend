<script setup lang="ts">
import { ref } from 'vue'
import Button from 'primevue/button'
import AccountInfoCard from '@/components/molecules/AccountInfoCard/AccountInfoCard.vue'
import { useAuthStore } from '@/stores'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const submitting = ref(false)
const errorMessage = ref<string | null>(null)

async function handleLogout() {
  if (submitting.value) {
    return
  }

  submitting.value = true
  errorMessage.value = null

  try {
    await authStore.logout()
    await router.push({ name: 'home' })
  } catch {
    errorMessage.value = 'We could not sign you out right now. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <AccountInfoCard
    title="Log out"
    description="Sign out of your account on this device."
    :error-message="errorMessage"
  >
    <template #footer>
      <Button
        type="button"
        severity="secondary"
        :loading="submitting"
        label="Log out"
        @click="handleLogout"
      />
    </template>
  </AccountInfoCard>
</template>
