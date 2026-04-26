<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import ProductDiscoveryTemplate from '@/components/templates/ProductDiscoveryTemplate/ProductDiscoveryTemplate.vue'
import { useProductDiscoveryListing } from '@/composables/useProductDiscoveryListing'

const { t } = useI18n()

const listing = useProductDiscoveryListing({ mode: 'plp' })
const {
  loading,
  error,
  products,
  filters,
  pagination,
  sort,
  sortOptions,
  selectedFilters,
  activeFilterChips,
  title,
  sourceValue,
} = listing
const resultCount = computed(() => pagination.value?.total ?? products.value.length)
</script>

<template>
  <ProductDiscoveryTemplate
    :eyebrow="t('plp.eyebrow')"
    :title="title || sourceValue"
    :loading="loading"
    :error="error"
    :products="products"
    :filters="filters"
    :selected-filters="selectedFilters"
    :active-filter-chips="activeFilterChips"
    :result-count="resultCount"
    :sort="sort"
    :sort-options="sortOptions"
    :loading-message="t('plp.loading')"
    :empty-message="t('plp.empty')"
    @apply-filters="listing.applyFilters"
    @update:sort="listing.setSort"
    @select-product="listing.selectProduct"
  />
</template>
