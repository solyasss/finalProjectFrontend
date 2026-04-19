<script setup lang="ts">
import { computed } from 'vue'
import Message from 'primevue/message'
import { useI18n } from 'vue-i18n'
import ProductFilterDrawer from '@/components/organisms/ProductFilterDrawer/ProductFilterDrawer.vue'
import ProductFilters from '@/components/organisms/ProductFilters/ProductFilters.vue'
import SortControl from '@/components/molecules/SortControl/SortControl.vue'
import ProductGrid from '@/components/organisms/ProductGrid/ProductGrid.vue'
import DefaultTemplate from '@/components/templates/DefaultTemplate/DefaultTemplate.vue'
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
  <DefaultTemplate>
    <section class="mx-auto grid max-w-[1440px] gap-6 px-4 py-6 md:px-6 md:py-8">
      <header class="space-y-2">
        <p class="text-sm font-bold uppercase tracking-[0.16em] text-muted-color">
          {{ t('plp.eyebrow') }}
        </p>
        <h1 class="text-2xl font-bold text-color md:text-3xl">
          {{ title || sourceValue }}
        </h1>
      </header>

      <Message v-if="loading" severity="secondary" variant="simple">{{ t('plp.loading') }}</Message>
      <Message v-else-if="error" severity="error">{{ error }}</Message>
      <Message v-else-if="!products.length" severity="secondary" variant="simple">
        {{ t('plp.empty') }}
      </Message>
      <div v-else class="grid gap-6 md:grid-cols-[18rem_minmax(0,1fr)] md:items-start">
        <aside class="hidden md:sticky md:top-24 md:block">
          <ProductFilters
            :filters="filters"
            :selected-filters="selectedFilters"
            :active-chips="activeFilterChips"
            :result-count="resultCount"
            :loading="loading"
            @apply-filters="listing.applyFilters"
          />
        </aside>

        <div class="grid gap-4">
          <div class="flex items-end justify-between gap-3">
            <div class="md:hidden self-end">
              <ProductFilterDrawer
                :filters="filters"
                :selected-filters="selectedFilters"
                :active-chips="activeFilterChips"
                :result-count="resultCount"
                :loading="loading"
                @apply-filters="listing.applyFilters"
              />
            </div>
            <div class="flex justify-end md:ml-auto">
              <SortControl
                :model-value="sort"
                :options="sortOptions"
                :disabled="loading"
                @update:model-value="listing.setSort"
              />
            </div>
          </div>

          <ProductGrid :products="products" @select-product="listing.selectProduct" />
        </div>
      </div>
    </section>
  </DefaultTemplate>
</template>
