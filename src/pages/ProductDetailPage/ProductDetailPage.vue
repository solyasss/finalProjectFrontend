<script setup lang="ts">
import Message from 'primevue/message'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import type { ProductCard as ApiProductCard } from '@/api'
import { useProductDetailPage } from '@/composables/useProductDetailPage'
import BreadcrumbNav from '@/components/molecules/BreadcrumbNav/BreadcrumbNav.vue'
import ProductCard from '@/components/molecules/ProductCard/ProductCard.vue'
import ProductDetailsAccordion from '@/components/organisms/ProductDetailsAccordion/ProductDetailsAccordion.vue'
import ProductGallery from '@/components/organisms/ProductGallery/ProductGallery.vue'
import ProductPurchasePanel from '@/components/organisms/ProductPurchasePanel/ProductPurchasePanel.vue'
import ReviewSection from '@/components/organisms/ReviewSection/ReviewSection.vue'
import CarouselSection from '@/components/organisms/CarouselSection/CarouselSection.vue'
import DefaultTemplate from '@/components/templates/DefaultTemplate/DefaultTemplate.vue'

const { t } = useI18n()
const router = useRouter()

const {
  loading,
  error,
  availabilityError,
  product,
  relatedProducts,
  accessories,
  breadcrumbs,
  reviewsSummary,
  reviewHistogram,
  reviews,
  reviewsPagination,
  selectedVariant,
  selectorGroups,
  galleryImages,
  availability,
  quantity,
  loadingAvailability,
  loadingReviews,
  addingToCart,
  submittingReview,
  canLoadMoreReviews,
  canAddToCart,
  isAuthenticated,
  ctaMessage,
  reviewsError,
  submitReviewError,
  submitReviewSuccess,
  selectOption,
  setQuantity,
  addToCart,
  loadMoreReviews,
  requestReviewAuth,
  submitReview,
} = useProductDetailPage()

function handleSelectProduct(card: ApiProductCard) {
  router.push({ name: 'pdp', params: { productSlug: card.slug } })
}
</script>

<template>
  <DefaultTemplate>
    <section class="mx-auto grid max-w-400 gap-8 px-4 py-6 md:px-6 md:py-8">
      <Message v-if="loading" severity="secondary" variant="simple">
        {{ t('pdp.loading') }}
      </Message>

      <Message v-else-if="error" severity="error">
        {{ error }}
      </Message>

      <template v-else-if="product">
        <BreadcrumbNav
          :items="
            breadcrumbs.map((item) => ({
              label: item.label,
              route: item.slug ? { name: 'plp', params: { categorySlug: item.slug } } : undefined,
            }))
          "
          :current-label="product.name"
        />

        <div class="grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(22rem,0.9fr)] lg:items-start">
          <ProductGallery :images="galleryImages" :name="product.name" />

          <ProductPurchasePanel
            :product="product"
            :selected-variant="selectedVariant"
            :selector-groups="selectorGroups"
            :availability="availability"
            :quantity="quantity"
            :loading-availability="loadingAvailability"
            :adding-to-cart="addingToCart"
            :availability-error="availabilityError"
            :can-add-to-cart="canAddToCart"
            :cta-message="ctaMessage"
            @select-option="selectOption($event.groupKey, $event.value)"
            @update:quantity="setQuantity"
            @add-to-cart="addToCart"
          />
        </div>

        <ProductDetailsAccordion
          :sections="product.detailsSections"
          :documents="product.documents"
        />

        <ReviewSection
          :summary="reviewsSummary"
          :histogram="reviewHistogram"
          :reviews="reviews"
          :pagination="reviewsPagination"
          :loading="loadingReviews"
          :error="reviewsError"
          :authenticated="isAuthenticated"
          :submitting="submittingReview"
          :submit-error="submitReviewError"
          :submit-success="submitReviewSuccess"
          :can-load-more="canLoadMoreReviews"
          @request-auth="requestReviewAuth"
          @submit-review="submitReview"
          @load-more="loadMoreReviews"
        />

        <CarouselSection
          v-if="relatedProducts.length"
          :title="t('pdp.relatedProductsTitle')"
          :items="relatedProducts"
          item-key="productId"
          :num-visible="4"
          :num-scroll="1"
          :responsive-options="[
            { breakpoint: '1199px', numVisible: 3, numScroll: 1 },
            { breakpoint: '767px', numVisible: 2, numScroll: 1 },
            { breakpoint: '575px', numVisible: 1, numScroll: 1 },
          ]"
          content-class="px-2"
          @select-item="handleSelectProduct($event.item as unknown as ApiProductCard)"
        >
          <template #default="{ item, select }">
            <ProductCard :product="item as ApiProductCard" clickable @select="select" />
          </template>
        </CarouselSection>
        <CarouselSection
          v-if="accessories.length"
          :title="t('pdp.accessoriesTitle')"
          :items="accessories"
          item-key="productId"
          :num-visible="4"
          :num-scroll="1"
          :responsive-options="[
            { breakpoint: '1199px', numVisible: 3, numScroll: 1 },
            { breakpoint: '767px', numVisible: 2, numScroll: 1 },
            { breakpoint: '575px', numVisible: 1, numScroll: 1 },
          ]"
          content-class="px-2"
          @select-item="handleSelectProduct($event.item as unknown as ApiProductCard)"
        >
          <template #default="{ item, select }">
            <ProductCard :product="item as ApiProductCard" clickable @select="select" />
          </template>
        </CarouselSection>
      </template>
    </section>
  </DefaultTemplate>
</template>
