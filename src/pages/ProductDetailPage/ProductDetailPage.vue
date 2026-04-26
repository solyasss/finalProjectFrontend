<script setup lang="ts">
import Message from 'primevue/message'
import { useI18n } from 'vue-i18n'
import { useProductDetailPage } from '@/composables/useProductDetailPage'
import ProductDetailsAccordion from '@/components/organisms/ProductDetailsAccordion/ProductDetailsAccordion.vue'
import ProductGallery from '@/components/organisms/ProductGallery/ProductGallery.vue'
import ProductPurchasePanel from '@/components/organisms/ProductPurchasePanel/ProductPurchasePanel.vue'
import ReviewSection from '@/components/organisms/ReviewSection/ReviewSection.vue'
import ProductCard from '@/components/molecules/ProductCard/ProductCard.vue'
import DefaultTemplate from '@/components/templates/DefaultTemplate/DefaultTemplate.vue'

// TODO: BreadcrumbNav removed — breadcrumbs not supported by backend API yet.
// import BreadcrumbNav from '@/components/molecules/BreadcrumbNav/BreadcrumbNav.vue'

const { t } = useI18n()

const {
  loading,
  error,
  product,
  relatedProducts,
  reviews,
  reviewsPagination,
  selectedVariant,
  selectorGroups,
  galleryImages,
  quantity,
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

// TODO: availability, loadingAvailability, availabilityError removed — not supported by backend yet.
// TODO: breadcrumbs removed — not supported by backend yet.
// TODO: reviewsSummary, reviewHistogram removed — not supported by backend yet.
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
        <!-- TODO: BreadcrumbNav removed — breadcrumbs not supported by backend API yet.
          To enable once backend supports it.
        <BreadcrumbNav :items="..." :current-label="product.name" />
        -->

        <div class="grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(22rem,0.9fr)] lg:items-stretch">
          <ProductGallery
            :images="galleryImages"
            :name="product.name"
            class="h-full min-h-[300px]"
          />

          <ProductPurchasePanel
            :product="product"
            :selected-variant="selectedVariant"
            :selector-groups="selectorGroups"
            :availability="[]"
            :quantity="quantity"
            :loading-availability="false"
            :adding-to-cart="addingToCart"
            :availability-error="null"
            :can-add-to-cart="canAddToCart"
            :cta-message="ctaMessage"
            @select-option="selectOption($event.groupKey, $event.value)"
            @update:quantity="setQuantity"
            @add-to-cart="addToCart"
          />
        </div>

        <!-- Accordion always shown; empty sections show "seller hasn't provided details" message -->
        <ProductDetailsAccordion :sections="[]" :documents="[]" />

        <ReviewSection
          :summary="null"
          :histogram="[]"
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

        <section v-if="relatedProducts.length" class="grid gap-6">
          <h2 class="text-color m-0 text-3xl font-bold uppercase leading-tight md:text-4xl">
            {{ t('pdp.relatedProductsTitle') }}
          </h2>
          <div class="flex gap-4 overflow-x-auto pb-2">
            <div v-for="item in relatedProducts" :key="item.id" class="w-[200px] shrink-0">
              <ProductCard :product="item" :clickable="true" />
            </div>
          </div>
        </section>

        <!-- TODO: Accessories not supported by backend API yet.
          To enable once backend supports it.
        <CarouselSection v-if="accessories.length" :title="t('pdp.accessoriesTitle')" ...>
          ...
        </CarouselSection>
        <p>Available in future release</p>
        -->
      </template>
    </section>
  </DefaultTemplate>
</template>
