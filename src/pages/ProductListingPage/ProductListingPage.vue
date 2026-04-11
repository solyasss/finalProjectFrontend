<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Message from 'primevue/message'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { getCategoryProducts, type ProductCard as ApiProductCard } from '@/api'
import ProductGrid from '@/components/organisms/ProductGrid/ProductGrid.vue'
import DefaultTemplate from '@/components/templates/DefaultTemplate/DefaultTemplate.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const loading = ref(false)
const error = ref<string | null>(null)
const title = ref('')
const products = ref<ApiProductCard[]>([])

const categorySlug = computed(() => String(route.params.categorySlug ?? ''))

async function loadProducts(slug: string) {
  if (!slug) {
    products.value = []
    title.value = ''
    return
  }

  loading.value = true
  error.value = null

  const result = await getCategoryProducts(slug, { page: 1, limit: 12 })

  loading.value = false

  if (!result.ok) {
    error.value = result.error.message || t('plp.error')
    products.value = []
    title.value = slug
    return
  }

  title.value = result.data.category.name
  products.value = result.data.products
}

function handleSelectProduct(product: ApiProductCard) {
  router.push({ name: 'pdp', params: { productSlug: product.slug } })
}

watch(
  categorySlug,
  (slug) => {
    loadProducts(slug)
  },
  { immediate: true },
)
</script>

<template>
  <DefaultTemplate>
    <section class="mx-auto grid max-w-[75%] gap-6 px-4 py-6 md:px-6 md:py-8">
      <header class="space-y-2">
        <p class="text-sm font-bold uppercase tracking-[0.16em] text-muted-color">
          {{ t('plp.eyebrow') }}
        </p>
        <h1 class="text-2xl font-bold text-color md:text-3xl">
          {{ title || categorySlug }}
        </h1>
      </header>

      <Message v-if="loading" severity="secondary" variant="simple">{{ t('plp.loading') }}</Message>
      <Message v-else-if="error" severity="error">{{ error }}</Message>
      <Message v-else-if="!products.length" severity="secondary" variant="simple">
        {{ t('plp.empty') }}
      </Message>
      <ProductGrid v-else :products="products" @select-product="handleSelectProduct" />
    </section>
  </DefaultTemplate>
</template>
