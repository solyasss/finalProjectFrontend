<script setup lang="ts">
import Message from 'primevue/message'
import { useI18n } from 'vue-i18n'

interface Props {
  title: string
  description: string
}

defineProps<Props>()

const { t } = useI18n()
</script>

<template>
  <section class="grid gap-4 rounded-2xl border border-dashed border-surface bg-surface-0 p-6">
    <div class="space-y-2">
      <h2 class="text-xl font-semibold text-color">{{ title }}</h2>
      <p class="text-sm leading-6 text-muted-color">{{ description }}</p>
    </div>

    <Message severity="secondary" variant="simple">
      {{ t('admin.deferred.message') }}
    </Message>
  </section>
</template>
