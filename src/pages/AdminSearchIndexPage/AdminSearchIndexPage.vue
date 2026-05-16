<script setup lang="ts">
import Button from 'primevue/button'
import Message from 'primevue/message'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { triggerAdminReindex } from '@/api'

const { t } = useI18n()

const loading = ref(false)
const successMessage = ref<string | null>(null)
const errorMessage = ref<string | null>(null)

async function handleReindex() {
  loading.value = true
  successMessage.value = null
  errorMessage.value = null

  const result = await triggerAdminReindex()

  loading.value = false

  if (!result.ok) {
    errorMessage.value =
      result.error.code === 'FORBIDDEN'
        ? t('admin.messages.forbidden')
        : t('admin.searchIndex.errorMessage')
    return
  }

  successMessage.value = t('admin.searchIndex.successMessage')
}
</script>

<template>
  <section class="grid gap-5">
    <div class="grid gap-4 rounded-2xl border border-surface bg-surface-0 p-5">
      <p class="text-sm leading-6 text-muted-color">{{ t('admin.searchIndex.description') }}</p>

      <Message v-if="successMessage" severity="success">{{ successMessage }}</Message>
      <Message v-if="errorMessage" severity="error">{{ errorMessage }}</Message>

      <div>
        <Button
          icon="pi pi-refresh"
          :label="t('admin.searchIndex.triggerLabel')"
          :loading="loading"
          @click="handleReindex"
        />
      </div>
    </div>
  </section>
</template>
