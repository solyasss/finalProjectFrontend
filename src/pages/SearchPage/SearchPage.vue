<script setup lang="ts">
import { computed } from 'vue'
import Message from 'primevue/message'
import { useI18n } from 'vue-i18n'
import ProductFilters from '@/components/organisms/ProductFilters/ProductFilters.vue'
import SortControl from '@/components/molecules/SortControl/SortControl.vue'
import ProductGrid from '@/components/organisms/ProductGrid/ProductGrid.vue'
import DefaultTemplate from '@/components/templates/DefaultTemplate/DefaultTemplate.vue'
import { useProductDiscoveryListing } from '@/composables/useProductDiscoveryListing'

const { t } = useI18n()

const listing = useProductDiscoveryListing({ mode: 'search' })
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
  sourceValue,
  showPromptState,
} = listing

const searchTitle = computed(() =>
  t('search.resultsTitle', { query: sourceValue.value || t('search.prompt') }),
)

const resultCount = computed(() => pagination.value?.total ?? products.value.length)
</script>

<template>
  <DefaultTemplate>
    <section class="mx-auto grid max-w-[1440px] gap-6 px-4 py-6 md:px-6 md:py-8">
      <header class="space-y-2">
        <p class="text-sm font-bold uppercase tracking-[0.16em] text-muted-color">
          {{ t('search.eyebrow') }}
        </p>
        <h1 class="text-2xl font-bold text-color md:text-3xl">
          {{ searchTitle }}
        </h1>
      </header>

      <Message v-if="showPromptState" severity="secondary" variant="simple">
        {{ t('search.prompt') }}
      </Message>
      <Message v-else-if="loading" severity="secondary" variant="simple">
        {{ t('search.loading') }}
      </Message>
      <Message v-else-if="error" severity="error">{{ error }}</Message>
      <Message v-else-if="!products.length" severity="secondary" variant="simple">
        {{ t('search.empty') }}
      </Message>
      <div v-else class="grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start">
        <aside class="lg:sticky lg:top-24 lg:self-start">
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
          <div class="flex justify-start lg:justify-end">
            <SortControl
              :model-value="sort"
              :options="sortOptions"
              :disabled="loading"
              @update:model-value="listing.setSort"
            />
          </div>

          <ProductGrid :products="products" @select-product="listing.selectProduct" />
        </div>
      </div>
    </section>
  </DefaultTemplate>
</template>
