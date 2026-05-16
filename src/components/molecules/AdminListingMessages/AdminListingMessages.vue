<script setup lang="ts">
import Message from 'primevue/message'
import { useI18n } from 'vue-i18n'

interface Props {
  loading: boolean
  error?: string | null
  empty: boolean
  emptyMessage: string
}

defineProps<Props>()

const { t } = useI18n()
</script>

<template>
  <Message v-if="loading" severity="secondary" variant="simple">
    {{ t('admin.messages.loading') }}
  </Message>
  <Message v-else-if="error" severity="error">{{ error }}</Message>
  <Message v-else-if="empty" severity="secondary" variant="simple">{{ emptyMessage }}</Message>
</template>
