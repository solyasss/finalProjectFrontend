<script setup lang="ts">
import Paginator from 'primevue/paginator'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  currentPage: number
  total: number
  limit: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (event: 'page', page: number): void
}>()

const { t } = useI18n()

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.limit)))
</script>

<template>
  <div
    class="flex flex-col gap-3 rounded-lg border border-surface bg-surface-0 p-4 md:flex-row md:items-center md:justify-between"
  >
    <p class="text-sm text-muted-color">
      {{ t('listingControls.paginationSummary', { page: currentPage, total: totalPages }) }}
    </p>
    <Paginator
      :rows="limit"
      :first="(currentPage - 1) * limit"
      :total-records="total"
      template="PrevPageLink PageLinks NextPageLink"
      @page="emit('page', $event.page + 1)"
    />
  </div>
</template>
