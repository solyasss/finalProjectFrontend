<script setup lang="ts">
import Button from 'primevue/button'
import { useI18n } from 'vue-i18n'
import AdminStatusBadge from '@/components/atoms/AdminStatusBadge/AdminStatusBadge.vue'

interface Props {
  title: string
  entityId: number | string
  subtitle?: string
  description?: string
  sideBySide?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  (event: 'edit'): void
  (event: 'delete'): void
}>()

const { t } = useI18n()
</script>

<template>
  <article
    class="grid gap-4 rounded-2xl border border-surface bg-surface-0 p-5 shadow-sm"
    :class="sideBySide ? 'lg:grid-cols-[8rem_minmax(0,1fr)]' : ''"
  >
    <slot name="prepend" />

    <div class="grid gap-4">
      <div class="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div class="space-y-2">
          <div class="flex flex-wrap items-center gap-2">
            <h2 class="text-lg font-semibold text-color">{{ title }}</h2>
            <AdminStatusBadge :label="`#${entityId}`" variant="id" />
            <slot name="badges" />
          </div>
          <p v-if="subtitle" class="text-sm text-muted-color">{{ subtitle }}</p>
          <p v-if="description" class="text-sm leading-6 text-muted-color">{{ description }}</p>
        </div>

        <div class="flex flex-wrap gap-2">
          <slot name="actions">
            <Button
              outlined
              severity="secondary"
              icon="pi pi-pencil"
              :label="t('admin.actions.edit')"
              @click="emit('edit')"
            />
            <Button
              severity="danger"
              icon="pi pi-trash"
              :label="t('common.delete')"
              @click="emit('delete')"
            />
          </slot>
        </div>
      </div>

      <slot name="meta" />
    </div>
  </article>
</template>
