<script setup lang="ts">
import Card from 'primevue/card'
import Message from 'primevue/message'

interface Props {
  title: string
  description?: string
  successMessage?: string | null
  errorMessage?: string | null
}

defineProps<Props>()
</script>

<template>
  <div class="overflow-hidden rounded-lg border border-surface bg-surface-0">
    <Card
      :pt="{
        body: { style: { padding: '0' } },
        content: { style: { padding: '0' } },
        footer: { style: { padding: '0' } },
      }"
    >
      <template #content>
        <div class="grid gap-5 p-5 sm:p-6">
          <div class="space-y-2">
            <h2 class="text-xl font-bold text-color">{{ title }}</h2>
            <p v-if="description" class="text-sm leading-6 text-muted-color">
              {{ description }}
            </p>
          </div>

          <Message v-if="successMessage" severity="success">{{ successMessage }}</Message>
          <Message v-if="errorMessage" severity="error">{{ errorMessage }}</Message>

          <slot />
        </div>
      </template>

      <template #footer>
        <div v-if="$slots.footer" class="border-t border-surface px-5 py-4 sm:px-6">
          <div class="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <slot name="footer" />
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>
