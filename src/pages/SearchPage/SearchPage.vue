<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import ProductDiscoveryTemplate from '@/components/templates/ProductDiscoveryTemplate/ProductDiscoveryTemplate.vue'
import { useProductDiscoveryListing } from '@/composables/useProductDiscoveryListing'

const { t } = useI18n()

const listing = useProductDiscoveryListing({ mode: 'search' })
const {
  loading,
  error,
  products,
  filters,
  pagination,
  currentPage,
  sort,
  sortOptions,
  selectedFilters,
  activeFilterChips,
  sourceValue,
  showPromptState,
} = listing

const searchTitle = computed(() =>
  t('search.resultsTitle', { query: sourceValue.value || t('search.prompt') }),
)

const resultCount = computed(() => pagination.value?.total ?? products.value.length)
</script>

<template>
  <ProductDiscoveryTemplate
    :eyebrow="t('search.eyebrow')"
    :title="searchTitle"
    :loading="loading"
    :error="error"
    :products="products"
    :filters="filters"
    :selected-filters="selectedFilters"
    :active-filter-chips="activeFilterChips"
    :result-count="resultCount"
    :current-page="currentPage"
    :pagination-total="pagination?.total ?? 0"
    :pagination-limit="pagination?.limit ?? 0"
    :sort="sort"
    :sort-options="sortOptions"
    :loading-message="t('search.loading')"
    :empty-message="t('search.empty')"
    :show-prompt-state="showPromptState"
    :prompt-message="t('search.prompt')"
    @apply-filters="listing.applyFilters"
    @page-change="listing.setPage"
    @update:sort="listing.setSort"
    @select-product="listing.selectProduct"
  />
</template>
