<script setup lang="ts">
import Dialog from 'primevue/dialog'
import Message from 'primevue/message'
import { useI18n } from 'vue-i18n'

interface Props {
  visible: boolean
  header: string
  loading?: boolean
  width?: string
}

withDefaults(defineProps<Props>(), {
  width: 'min(52rem, calc(100vw - 2rem))',
})

const emit = defineEmits<{
  (event: 'update:visible', value: boolean): void
}>()

const { t } = useI18n()
</script>

<template>
  <Dialog
    :visible="visible"
    modal
    :header="header"
    :style="{ width }"
    @update:visible="emit('update:visible', $event)"
  >
    <Message v-if="loading" severity="secondary" variant="simple">
      {{ t('admin.messages.loading') }}
    </Message>
    <slot v-else />
  </Dialog>
</template>
