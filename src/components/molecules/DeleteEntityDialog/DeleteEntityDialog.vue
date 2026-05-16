<script setup lang="ts">
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Message from 'primevue/message'

interface Props {
  visible: boolean
  title: string
  description: string
  confirmLabel: string
  loading?: boolean
  errorMessage?: string | null
}

defineProps<Props>()

const emit = defineEmits<{
  (event: 'update:visible', value: boolean): void
  (event: 'confirm'): void
}>()
</script>

<template>
  <Dialog
    :visible="visible"
    modal
    :header="title"
    :style="{ width: 'min(32rem, calc(100vw - 2rem))' }"
    @update:visible="emit('update:visible', $event)"
  >
    <div class="grid gap-5">
      <p class="text-sm leading-6 text-muted-color">{{ description }}</p>

      <Message v-if="errorMessage" severity="error">{{ errorMessage }}</Message>

      <div class="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          text
          severity="secondary"
          label="Cancel"
          @click="emit('update:visible', false)"
        />
        <Button
          type="button"
          severity="danger"
          :loading="loading"
          :label="confirmLabel"
          @click="emit('confirm')"
        />
      </div>
    </div>
  </Dialog>
</template>
