<script setup lang="ts">
import { computed } from 'vue'
import Message from 'primevue/message'
import { useI18n } from 'vue-i18n'
import BackButton from '@/components/atoms/BackButton/BackButton.vue'
import DetailHero from '@/components/organisms/DetailHero/DetailHero.vue'
import ProductSetVariantGrid from '@/components/organisms/ProductSetVariantGrid/ProductSetVariantGrid.vue'
import DefaultTemplate from '@/components/templates/DefaultTemplate/DefaultTemplate.vue'
import { useProductSetDetailPage } from '@/composables/useProductSetDetailPage'

const { t } = useI18n()
const { loading, error, productSet, parentRoom, variants, goBackToRoom } = useProductSetDetailPage()

const productSetStats = computed(() => {
  if (!parentRoom.value) {
    return []
  }

  return [
    {
      label: t('productSetDetailPage.roomLabel'),
      value: parentRoom.value.name,
    },
    {
      label: t('productSetDetailPage.variantCountLabel'),
      value: t('productSetDetailPage.variantCountValue', { count: variants.value.length }),
    },
  ]
})
</script>

<template>
  <DefaultTemplate>
    <section class="mx-auto grid max-w-[1440px] gap-6 px-4 py-6 md:px-6 md:py-8">
      <Message v-if="loading" severity="secondary" variant="simple">
        {{ t('productSetDetailPage.loading') }}
      </Message>

      <div v-else-if="error" class="grid gap-4">
        <Message severity="error">{{ error }}</Message>

        <div class="flex justify-start">
          <BackButton
            :label="t('productSetDetailPage.backToRoom')"
            variant="outlined"
            @click="goBackToRoom"
          />
        </div>
      </div>

      <template v-else-if="productSet && parentRoom">
        <div class="flex justify-start">
          <BackButton :label="t('productSetDetailPage.backToRoom')" @click="goBackToRoom" />
        </div>

        <DetailHero
          image-column-class="lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]"
          :image-url="productSet.imageUrl"
          :image-alt="productSet.name"
          :no-image-label="t('productSetDetailPage.noImage')"
          :eyebrow="t('productSetDetailPage.eyebrow')"
          :title="productSet.name"
          :description="productSet.description || t('productSetDetailPage.descriptionFallback')"
          :stats="productSetStats"
        />

        <section class="grid gap-4">
          <div class="space-y-1">
            <h2 class="text-2xl font-bold text-color md:text-3xl">
              {{ t('productSetDetailPage.variantsTitle') }}
            </h2>
            <p class="text-sm leading-6 text-muted-color">
              {{ t('productSetDetailPage.variantsDescription') }}
            </p>
          </div>

          <Message v-if="!variants.length" severity="secondary" variant="simple">
            {{ t('productSetDetailPage.empty') }}
          </Message>

          <ProductSetVariantGrid v-else :variants="variants" />
        </section>
      </template>
    </section>
  </DefaultTemplate>
</template>
