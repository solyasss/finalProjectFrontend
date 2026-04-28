<script setup lang="ts">
import { computed } from 'vue'
import Message from 'primevue/message'
import Paginator from 'primevue/paginator'
import { useI18n } from 'vue-i18n'
import type { FilterDefinition, ProductCard, SortOption } from '@/api'
import SortControl from '@/components/molecules/SortControl/SortControl.vue'
import ProductFilterDrawer from '@/components/organisms/ProductFilterDrawer/ProductFilterDrawer.vue'
import ProductFilters from '@/components/organisms/ProductFilters/ProductFilters.vue'
import ProductGrid from '@/components/organisms/ProductGrid/ProductGrid.vue'
import DefaultTemplate from '@/components/templates/DefaultTemplate/DefaultTemplate.vue'
import type {
  ProductDiscoveryFilterChip,
  ProductDiscoverySelectedFilters,
} from '@/composables/useProductDiscoveryListing'

interface SortControlOption {
  label: string
  value: SortOption
}

interface Props {
  eyebrow: string
  title: string
  loading: boolean
  error: string | null
  products: ProductCard[]
  filters?: FilterDefinition[]
  selectedFilters?: ProductDiscoverySelectedFilters
  activeFilterChips?: ProductDiscoveryFilterChip[]
  resultCount?: number
  currentPage?: number
  paginationTotal?: number
  paginationLimit?: number
  sort?: SortOption | ''
  sortOptions?: SortControlOption[]
  loadingMessage: string
  emptyMessage: string
  showPromptState?: boolean
  promptMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
  filters: () => [],
  selectedFilters: () => ({}),
  activeFilterChips: () => [],
  resultCount: 0,
  currentPage: 1,
  paginationTotal: 0,
  paginationLimit: 0,
  sort: '',
  sortOptions: () => [],
  showPromptState: false,
  promptMessage: '',
})

const emit = defineEmits<{
  (event: 'apply-filters', value: ProductDiscoverySelectedFilters): void
  (event: 'update:sort', value: SortOption | ''): void
  (event: 'page-change', page: number): void
  (event: 'select-product', product: ProductCard): void
}>()

const { t } = useI18n()

const showFilters = computed(() => props.filters.length > 0)
const showSort = computed(() => props.sortOptions.length > 0)
const showControls = computed(() => showFilters.value || showSort.value)
const contentLayoutClass = computed(() =>
  showFilters.value ? 'md:grid-cols-[18rem_minmax(0,1fr)] md:items-start' : '',
)
const pageCount = computed(() => {
  if (!props.paginationLimit) {
    return 1
  }

  return Math.max(1, Math.ceil(props.paginationTotal / props.paginationLimit))
})
const showPaginator = computed(() => props.paginationTotal > 0 && props.paginationLimit > 0)

function handlePageChange(event: { page: number }) {
  emit('page-change', event.page + 1)
}
</script>

<template>
  <DefaultTemplate>
    <section class="mx-auto grid max-w-[1440px] gap-6 px-4 py-6 md:px-6 md:py-8">
      <header class="space-y-2">
        <p class="text-sm font-bold uppercase tracking-[0.16em] text-muted-color">
          {{ props.eyebrow }}
        </p>
        <h1 class="text-2xl font-bold text-color md:text-3xl">
          {{ props.title }}
        </h1>
      </header>

      <Message v-if="props.showPromptState" severity="secondary" variant="simple">
        {{ props.promptMessage }}
      </Message>
      <Message v-else-if="props.loading" severity="secondary" variant="simple">
        {{ props.loadingMessage }}
      </Message>
      <Message v-else-if="props.error" severity="error">{{ props.error }}</Message>
      <Message v-else-if="!props.products.length" severity="secondary" variant="simple">
        {{ props.emptyMessage }}
      </Message>
      <div v-else class="grid gap-6" :class="contentLayoutClass">
        <aside v-if="showFilters" class="hidden md:sticky md:top-24 md:block">
          <ProductFilters
            :filters="props.filters"
            :selected-filters="props.selectedFilters"
            :active-chips="props.activeFilterChips"
            :result-count="props.resultCount"
            :loading="props.loading"
            @apply-filters="emit('apply-filters', $event)"
          />
        </aside>

        <div class="grid gap-4">
          <div v-if="showControls" class="flex flex-wrap items-end justify-between gap-3">
            <div v-if="showFilters" class="self-end md:hidden">
              <ProductFilterDrawer
                :filters="props.filters"
                :selected-filters="props.selectedFilters"
                :active-chips="props.activeFilterChips"
                :result-count="props.resultCount"
                :loading="props.loading"
                @apply-filters="emit('apply-filters', $event)"
              />
            </div>
            <div v-if="showSort" class="flex justify-end md:ml-auto">
              <SortControl
                :model-value="props.sort"
                :options="props.sortOptions"
                :disabled="props.loading"
                @update:model-value="emit('update:sort', $event)"
              />
            </div>
          </div>

          <ProductGrid
            :products="props.products"
            @select-product="emit('select-product', $event)"
          />

          <div
            v-if="showPaginator"
            class="flex flex-col gap-3 rounded-lg border border-surface bg-surface-0 p-4 md:flex-row md:items-center md:justify-between"
          >
            <p class="text-sm text-muted-color">
              {{
                t('listingControls.paginationSummary', {
                  page: props.currentPage,
                  total: pageCount,
                })
              }}
            </p>

            <Paginator
              :rows="props.paginationLimit"
              :first="(props.currentPage - 1) * props.paginationLimit"
              :total-records="props.paginationTotal"
              template="PrevPageLink PageLinks NextPageLink"
              @page="handlePageChange"
            />
          </div>
        </div>
      </div>
    </section>
  </DefaultTemplate>
</template>
