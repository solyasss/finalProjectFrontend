<script setup lang="ts">
import { computed, onMounted } from 'vue'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Image from 'primevue/image'
import Message from 'primevue/message'
import { useI18n } from 'vue-i18n'
import DefaultTemplate from '@/components/templates/DefaultTemplate/DefaultTemplate.vue'
import { useCartStore } from '@/stores'

const { t } = useI18n()
const cartStore = useCartStore()

const items = computed(() => cartStore.cart?.items ?? [])

function formatUAH(amount: number): string {
  return `${amount.toLocaleString('uk-UA')} ₴`
}

async function updateQuantity(itemId: number, quantity: number) {
  if (quantity < 1) return
  await cartStore.updateQuantity(itemId, quantity)
}

async function removeLine(itemId: number) {
  await cartStore.removeLine(itemId)
}

onMounted(async () => {
  await cartStore.fetchCart()
})
</script>

<template>
  <DefaultTemplate>
    <section class="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div class="space-y-2">
        <p class="text-sm font-semibold uppercase tracking-[0.24em] text-muted-color">
          {{ t('cartPage.eyebrow') }}
        </p>
        <h1 class="text-3xl font-bold text-color sm:text-4xl">{{ t('cartPage.title') }}</h1>
        <p class="max-w-3xl text-sm leading-6 text-muted-color sm:text-base">
          {{ t('cartPage.description') }}
        </p>
      </div>

      <Message v-if="cartStore.loading && !cartStore.cart" severity="secondary" variant="simple">
        {{ t('cartPage.loading') }}
      </Message>

      <div v-else-if="cartStore.error && !cartStore.cart" class="grid gap-4">
        <Message severity="error">{{ cartStore.error }}</Message>
        <div>
          <Button
            :label="t('cartPage.refresh')"
            icon="pi pi-refresh"
            @click="cartStore.fetchCart"
          />
        </div>
      </div>

      <Message v-else-if="cartStore.isEmpty" severity="secondary" variant="simple">
        {{ t('cartPage.empty') }}
      </Message>

      <div v-else class="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_24rem] xl:items-start">
        <div class="grid gap-4">
          <div
            v-for="item in items"
            :key="item.id"
            class="overflow-hidden rounded-lg border border-surface bg-surface-0"
          >
            <Card
              :pt="{
                body: { style: { padding: '0' } },
                content: { style: { padding: '0' } },
              }"
            >
              <template #content>
                <article class="grid gap-4 p-4 sm:grid-cols-[7rem_minmax(0,1fr)] sm:p-5">
                  <div class="overflow-hidden rounded-lg bg-surface-100">
                    <Image
                      v-if="item.variant.images[0] || item.variant.product.baseImageUrl"
                      :src="item.variant.images[0] ?? item.variant.product.baseImageUrl ?? ''"
                      :alt="item.variant.product.name"
                      :pt="{
                        root: { style: { display: 'block', width: '100%', height: '100%' } },
                        image: {
                          style: {
                            display: 'block',
                            width: '100%',
                            height: '7rem',
                            objectFit: 'cover',
                          },
                        },
                      }"
                    />
                    <div
                      v-else
                      class="flex h-28 items-center justify-center px-4 text-center text-sm text-muted-color"
                    >
                      {{ item.variant.product.name }}
                    </div>
                  </div>

                  <div class="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
                    <div class="space-y-2">
                      <h2 class="text-lg font-bold text-color">{{ item.variant.product.name }}</h2>
                      <p v-if="item.variant.color" class="text-sm text-muted-color">
                        {{ item.variant.color }}
                      </p>
                      <p class="text-sm text-muted-color">{{ formatUAH(item.dynamicPrice) }}</p>

                      <div class="flex flex-wrap items-center gap-3">
                        <span class="text-sm text-muted-color">{{ t('cartPage.quantity') }}</span>
                        <div
                          class="flex items-center gap-2 rounded-full border border-surface px-2 py-1"
                        >
                          <Button
                            icon="pi pi-minus"
                            severity="secondary"
                            variant="text"
                            rounded
                            :aria-label="t('cartPage.decrease')"
                            :disabled="cartStore.loading || item.quantity <= 1"
                            @click="updateQuantity(item.id, item.quantity - 1)"
                          />
                          <span class="min-w-8 text-center text-sm font-medium text-color">
                            {{ item.quantity }}
                          </span>
                          <Button
                            icon="pi pi-plus"
                            severity="secondary"
                            variant="text"
                            rounded
                            :aria-label="t('cartPage.increase')"
                            :disabled="cartStore.loading"
                            @click="updateQuantity(item.id, item.quantity + 1)"
                          />
                        </div>
                      </div>
                    </div>

                    <div class="flex flex-col items-start gap-3 sm:items-end">
                      <p class="text-lg font-bold text-color">
                        {{ formatUAH(item.dynamicPrice * item.quantity) }}
                      </p>
                      <Button
                        :label="t('cartPage.remove')"
                        icon="pi pi-trash"
                        severity="secondary"
                        variant="outlined"
                        :disabled="cartStore.loading"
                        @click="removeLine(item.id)"
                      />
                    </div>
                  </div>
                </article>
              </template>
            </Card>
          </div>
        </div>

        <aside class="overflow-hidden rounded-lg border border-surface bg-surface-0">
          <Card
            :pt="{
              body: { style: { padding: '0' } },
              content: { style: { padding: '0' } },
            }"
          >
            <template #content>
              <section class="grid gap-4 p-5 sm:p-6">
                <h2 class="text-xl font-bold text-color">{{ t('cartPage.summaryTitle') }}</h2>

                <dl class="grid gap-3 text-sm text-color">
                  <div class="flex items-center justify-between gap-4">
                    <dt class="text-muted-color">{{ t('cartPage.subtotal') }}</dt>
                    <dd class="font-medium">{{ cartStore.subtotal }}</dd>
                  </div>
                  <div
                    v-if="cartStore.discountTotal"
                    class="flex items-center justify-between gap-4"
                  >
                    <dt class="text-muted-color">{{ t('cartPage.discount') }}</dt>
                    <dd class="font-medium">-{{ cartStore.discountTotal }}</dd>
                  </div>
                  <div class="flex items-center justify-between gap-4 border-t border-surface pt-3">
                    <dt class="text-base font-semibold">{{ t('cartPage.total') }}</dt>
                    <dd class="text-base font-bold">{{ cartStore.grandTotal }}</dd>
                  </div>
                </dl>

                <Button
                  :label="t('cartPage.refresh')"
                  icon="pi pi-refresh"
                  severity="secondary"
                  variant="outlined"
                  :loading="cartStore.loading"
                  @click="cartStore.fetchCart"
                />
              </section>
            </template>
          </Card>
        </aside>
      </div>
    </section>
  </DefaultTemplate>
</template>
