<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import { useI18n } from 'vue-i18n'
import DefaultTemplate from '@/components/templates/DefaultTemplate/DefaultTemplate.vue'
import { useCartStore, useCheckoutStore } from '@/stores'

const { t } = useI18n()
const router = useRouter()
const cartStore = useCartStore()
const checkoutStore = useCheckoutStore()

const validationErrors = ref<Partial<Record<string, string>>>({})

const items = computed(() => cartStore.cart?.items ?? [])

function formatUAH(amount: number): string {
  return `${amount.toLocaleString('uk-UA')} ₴`
}

function validate(): boolean {
  const errors: Partial<Record<string, string>> = {}
  const card = checkoutStore.cardDetails

  if (!checkoutStore.shippingAddress.trim()) {
    errors.shippingAddress = t('checkoutPage.validation.shippingAddressRequired')
  }
  if (!card.cardholderName.trim()) {
    errors.cardholderName = t('checkoutPage.validation.cardholderNameRequired')
  }
  if (!card.cardNumber.trim()) {
    errors.cardNumber = t('checkoutPage.validation.cardNumberRequired')
  }
  if (!card.expiryMonth.trim()) {
    errors.expiryMonth = t('checkoutPage.validation.expiryMonthRequired')
  }
  if (!card.expiryYear.trim()) {
    errors.expiryYear = t('checkoutPage.validation.expiryYearRequired')
  }
  if (!card.cvv.trim()) {
    errors.cvv = t('checkoutPage.validation.cvvRequired')
  }

  validationErrors.value = errors
  return Object.keys(errors).length === 0
}

async function handlePurchase() {
  if (!validate()) return

  const order = await checkoutStore.placeOrder()
  if (!order) return

  cartStore.clearCart()
  await router.push({ name: 'orders' })
}

onMounted(() => {
  if (cartStore.isEmpty) {
    router.push({ name: 'cart' })
  }
})
</script>

<template>
  <DefaultTemplate>
    <section class="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div class="space-y-2">
        <p class="text-sm font-semibold uppercase tracking-[0.24em] text-muted-color">
          {{ t('checkoutPage.eyebrow') }}
        </p>
        <h1 class="text-3xl font-bold text-color sm:text-4xl">{{ t('checkoutPage.title') }}</h1>
        <p class="max-w-3xl text-sm leading-6 text-muted-color sm:text-base">
          {{ t('checkoutPage.description') }}
        </p>
      </div>

      <Message v-if="checkoutStore.error" severity="error">
        {{ checkoutStore.error }}
      </Message>

      <div class="grid gap-6 xl:grid-cols-[24rem_minmax(0,1fr)] xl:items-start">
        <!-- Order summary -->
        <aside class="overflow-hidden rounded-lg border border-surface bg-surface-0">
          <Card
            :pt="{
              body: { style: { padding: '0' } },
              content: { style: { padding: '0' } },
            }"
          >
            <template #content>
              <section class="grid gap-4 p-5 sm:p-6">
                <h2 class="text-xl font-bold text-color">{{ t('checkoutPage.summaryTitle') }}</h2>

                <ul class="grid gap-3">
                  <li
                    v-for="item in items"
                    :key="item.id"
                    class="flex items-center justify-between gap-3 text-sm"
                  >
                    <span class="text-color">
                      {{ item.variant.product.name }}
                      <span class="text-muted-color">× {{ item.quantity }}</span>
                    </span>
                    <span class="font-medium text-color">
                      {{ formatUAH(item.dynamicPrice * item.quantity) }}
                    </span>
                  </li>
                </ul>

                <dl class="grid gap-3 border-t border-surface pt-3 text-sm text-color">
                  <div class="flex items-center justify-between gap-4">
                    <dt class="text-muted-color">{{ t('checkoutPage.subtotal') }}</dt>
                    <dd class="font-medium">{{ cartStore.subtotal }}</dd>
                  </div>
                  <div
                    v-if="cartStore.discountTotal"
                    class="flex items-center justify-between gap-4"
                  >
                    <dt class="text-muted-color">{{ t('checkoutPage.discount') }}</dt>
                    <dd class="font-medium">-{{ cartStore.discountTotal }}</dd>
                  </div>
                  <div class="flex items-center justify-between gap-4 border-t border-surface pt-3">
                    <dt class="text-base font-semibold">{{ t('checkoutPage.total') }}</dt>
                    <dd class="text-base font-bold">{{ cartStore.grandTotal }}</dd>
                  </div>
                </dl>
              </section>
            </template>
          </Card>
        </aside>

        <!-- Payment form -->
        <div class="overflow-hidden rounded-lg border border-surface bg-surface-0">
          <Card
            :pt="{
              body: { style: { padding: '0' } },
              content: { style: { padding: '0' } },
            }"
          >
            <template #content>
              <form class="grid gap-5 p-5 sm:p-6" @submit.prevent="handlePurchase">
                <h2 class="text-xl font-bold text-color">
                  {{ t('checkoutPage.cardDetailsTitle') }}
                </h2>

                <!-- Shipping address -->
                <div class="grid gap-1.5">
                  <label for="shippingAddress" class="text-sm font-medium text-color">
                    {{ t('checkoutPage.shippingAddress') }}
                  </label>
                  <InputText
                    id="shippingAddress"
                    v-model="checkoutStore.shippingAddress"
                    :placeholder="t('checkoutPage.shippingAddressPlaceholder')"
                    :invalid="!!validationErrors.shippingAddress"
                    class="w-full"
                  />
                  <p v-if="validationErrors.shippingAddress" class="text-sm text-red-500">
                    {{ validationErrors.shippingAddress }}
                  </p>
                </div>

                <!-- Cardholder name -->
                <div class="grid gap-1.5">
                  <label for="cardholderName" class="text-sm font-medium text-color">
                    {{ t('checkoutPage.cardholderName') }}
                  </label>
                  <InputText
                    id="cardholderName"
                    v-model="checkoutStore.cardDetails.cardholderName"
                    :placeholder="t('checkoutPage.cardholderNamePlaceholder')"
                    :invalid="!!validationErrors.cardholderName"
                    class="w-full"
                  />
                  <p v-if="validationErrors.cardholderName" class="text-sm text-red-500">
                    {{ validationErrors.cardholderName }}
                  </p>
                </div>

                <!-- Card number -->
                <div class="grid gap-1.5">
                  <label for="cardNumber" class="text-sm font-medium text-color">
                    {{ t('checkoutPage.cardNumber') }}
                  </label>
                  <InputText
                    id="cardNumber"
                    v-model="checkoutStore.cardDetails.cardNumber"
                    :placeholder="t('checkoutPage.cardNumberPlaceholder')"
                    :invalid="!!validationErrors.cardNumber"
                    class="w-full"
                  />
                  <p v-if="validationErrors.cardNumber" class="text-sm text-red-500">
                    {{ validationErrors.cardNumber }}
                  </p>
                </div>

                <!-- Expiry date -->
                <div class="grid gap-1.5">
                  <span class="text-sm font-medium text-color">
                    {{ t('checkoutPage.expiry') }}
                  </span>
                  <div class="grid grid-cols-2 gap-3">
                    <div class="grid gap-1.5">
                      <label for="expiryMonth" class="sr-only">
                        {{ t('checkoutPage.expiryMonth') }}
                      </label>
                      <InputText
                        id="expiryMonth"
                        v-model="checkoutStore.cardDetails.expiryMonth"
                        :placeholder="t('checkoutPage.expiryMonth')"
                        :invalid="!!validationErrors.expiryMonth"
                        class="w-full"
                      />
                      <p v-if="validationErrors.expiryMonth" class="text-sm text-red-500">
                        {{ validationErrors.expiryMonth }}
                      </p>
                    </div>
                    <div class="grid gap-1.5">
                      <label for="expiryYear" class="sr-only">
                        {{ t('checkoutPage.expiryYear') }}
                      </label>
                      <InputText
                        id="expiryYear"
                        v-model="checkoutStore.cardDetails.expiryYear"
                        :placeholder="t('checkoutPage.expiryYear')"
                        :invalid="!!validationErrors.expiryYear"
                        class="w-full"
                      />
                      <p v-if="validationErrors.expiryYear" class="text-sm text-red-500">
                        {{ validationErrors.expiryYear }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- CVV -->
                <div class="grid gap-1.5">
                  <label for="cvv" class="text-sm font-medium text-color">
                    {{ t('checkoutPage.cvv') }}
                  </label>
                  <InputText
                    id="cvv"
                    v-model="checkoutStore.cardDetails.cvv"
                    :placeholder="t('checkoutPage.cvvPlaceholder')"
                    :invalid="!!validationErrors.cvv"
                    class="w-full"
                  />
                  <p v-if="validationErrors.cvv" class="text-sm text-red-500">
                    {{ validationErrors.cvv }}
                  </p>
                </div>

                <div class="flex flex-wrap gap-3 pt-2">
                  <Button
                    type="submit"
                    :label="t('checkoutPage.purchase')"
                    icon="pi pi-lock"
                    :loading="checkoutStore.loading"
                    :disabled="checkoutStore.loading"
                  />
                  <Button
                    type="button"
                    :label="t('checkoutPage.backToCart')"
                    icon="pi pi-arrow-left"
                    severity="secondary"
                    variant="outlined"
                    :disabled="checkoutStore.loading"
                    @click="router.push({ name: 'cart' })"
                  />
                </div>
              </form>
            </template>
          </Card>
        </div>
      </div>
    </section>
  </DefaultTemplate>
</template>
