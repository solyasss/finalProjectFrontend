<script setup lang="ts">
import { ref } from 'vue'
import Button from 'primevue/button'
import Drawer from 'primevue/drawer'
import { useI18n } from 'vue-i18n'
import type { CategoryTreeNode, FilterDefinition } from '@/api'
import ProductFilters from '@/components/organisms/ProductFilters/ProductFilters.vue'
import type {
  ProductDiscoveryFilterChip,
  ProductDiscoverySelectedFilters,
} from '@/composables/usePlpListing'

interface Props {
  filters: FilterDefinition[]
  selectedFilters: ProductDiscoverySelectedFilters
  activeChips: ProductDiscoveryFilterChip[]
  resultCount: number
  loading?: boolean
  categoryTree?: CategoryTreeNode[]
}

defineProps<Props>()

const emit = defineEmits<{
  (event: 'apply-filters', value: ProductDiscoverySelectedFilters): void
}>()

const { t } = useI18n()
const open = ref(false)

function setOpen(nextState: boolean) {
  open.value = nextState
}

function handleApplyFilters(value: ProductDiscoverySelectedFilters) {
  emit('apply-filters', value)
  setOpen(false)
}
</script>

<template>
  <div>
    <Button
      type="button"
      severity="secondary"
      variant="outlined"
      icon="pi pi-bars"
      :label="t('listingControls.filtersTitle')"
      :disabled="loading"
      :aria-expanded="open"
      aria-controls="product-filter-drawer"
      class="min-h-11"
      @click="setOpen(true)"
    />

    <Drawer
      :visible="open"
      position="left"
      :header="t('listingControls.filtersTitle')"
      class="w-full max-w-[28rem]"
      :pt="{
        root: { id: 'product-filter-drawer' },
      }"
      @update:visible="setOpen"
    >
      <div class="h-full overflow-y-auto pb-4">
        <ProductFilters
          :filters="filters"
          :selected-filters="selectedFilters"
          :active-chips="activeChips"
          :result-count="resultCount"
          :loading="loading"
          :category-tree="categoryTree"
          class="h-full max-h-none"
          @apply-filters="handleApplyFilters"
        />
      </div>
    </Drawer>
  </div>
</template>
