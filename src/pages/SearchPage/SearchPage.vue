<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Message from 'primevue/message'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { search, type ProductCard as ApiProductCard } from '@/api'
import ProductGrid from '@/components/organisms/ProductGrid/ProductGrid.vue'
import DefaultTemplate from '@/components/templates/DefaultTemplate/DefaultTemplate.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const loading = ref(false)
const error = ref<string | null>(null)
const products = ref<ApiProductCard[]>([])

const searchQuery = computed(() => {
  const query = route.query.q
  return typeof query === 'string' ? query.trim() : ''
})

async function loadSearchResults(query: string) {
  if (!query) {
    loading.value = false
    error.value = null
    products.value = []
    return
  }

  loading.value = true
  error.value = null

  const result = await search({ q: query, page: 1, limit: 12 })

  loading.value = false

  if (!result.ok) {
    error.value = result.error.message || t('search.error')
    products.value = []
    return
  }

  products.value = result.data.products
}

function handleSelectProduct(product: ApiProductCard) {
  router.push({ name: 'pdp', params: { productSlug: product.slug } })
}

watch(
  searchQuery,
  (query) => {
    loadSearchResults(query)
  },
  { immediate: true },
)
</script>

<template>
  <DefaultTemplate>
    <section class="mx-auto grid max-w-[75%] gap-6 px-4 py-6 md:px-6 md:py-8">
      <header class="space-y-2">
        <p class="text-sm font-bold uppercase tracking-[0.16em] text-muted-color">
          {{ t('search.eyebrow') }}
        </p>
        <h1 class="text-2xl font-bold text-color md:text-3xl">
          {{ t('search.resultsTitle', { query: searchQuery || t('search.prompt') }) }}
        </h1>
      </header>

      <Message v-if="!searchQuery" severity="secondary" variant="simple">
        {{ t('search.prompt') }}
      </Message>
      <Message v-else-if="loading" severity="secondary" variant="simple">
        {{ t('search.loading') }}
      </Message>
      <Message v-else-if="error" severity="error">{{ error }}</Message>
      <Message v-else-if="!products.length" severity="secondary" variant="simple">
        {{ t('search.empty') }}
      </Message>
      <ProductGrid v-else :products="products" @select-product="handleSelectProduct"/>
    </section>
  </DefaultTemplate>
</template>
