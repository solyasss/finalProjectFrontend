<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'
import Message from 'primevue/message'
import { useI18n } from 'vue-i18n'
import { useAdminOrderStatusForm } from '@/composables/useAdminOrderStatusForm'
import type { AdminOrder, AdminOrderItem } from '@/api'

interface Props {
  order: AdminOrder
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (event: 'success'): void
  (event: 'cancel'): void
}>()

const { t } = useI18n()
const form = useAdminOrderStatusForm({ order: props.order })

const readonlyInputClass =
  'w-full rounded-lg border border-surface bg-surface-50 px-3 py-2 text-muted-color'

const orderItems = computed(() => props.order.items ?? [])
const hasOrderItems = computed(() => orderItems.value.length > 0)
const shippingAddressText = computed(() => formatReadonlyValue(props.order.shippingAddress))

const readonlyOrderFields = computed(() => [
  { label: t('admin.orders.fields.orderId'), value: props.order.id },
  { label: t('admin.orders.fields.userId'), value: props.order.userId },
  { label: t('admin.orders.fields.totalAmount'), value: props.order.totalAmount },
  { label: t('admin.orders.fields.createdAt'), value: props.order.createdAt },
  { label: t('admin.orders.fields.updatedAt'), value: props.order.updatedAt },
])

function formatReadonlyValue(value: unknown): string {
  if (value === null || value === undefined || value === '') return '—'
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  return JSON.stringify(value, null, 2)
}

function getItemTitle(item: AdminOrderItem): string {
  const productName = item.variant?.product?.name ?? item.product?.name
  if (productName) return productName

  const variantSku = item.variant?.sku
  if (variantSku) return variantSku

  if (item.variantId) return item.variantId
  if (item.id) return `#${item.id}`

  return t('admin.orders.itemFallback')
}

function getItemFields(item: AdminOrderItem) {
  return [
    { label: t('admin.orders.fields.itemId'), value: item.id },
    { label: t('admin.orders.fields.variantId'), value: item.variant?.id ?? item.variantId },
    { label: t('admin.orders.fields.sku'), value: item.variant?.sku },
    { label: t('admin.orders.fields.color'), value: item.variant?.color },
    { label: t('admin.orders.fields.quantity'), value: item.quantity },
    { label: t('admin.orders.fields.priceAtPurchase'), value: item.priceAtPurchase },
    { label: t('admin.orders.fields.currentPrice'), value: item.variant?.price },
    { label: t('admin.orders.fields.stock'), value: item.variant?.stock },
    {
      label: t('admin.orders.fields.productId'),
      value: item.variant?.product?.id ?? item.product?.id,
    },
    {
      label: t('admin.orders.fields.productSlug'),
      value: item.variant?.product?.slug ?? item.product?.slug,
    },
  ]
}

async function handleSubmit() {
  const succeeded = await form.submit()
  if (succeeded) emit('success')
}
</script>

<template>
  <form class="grid gap-5" @submit.prevent="handleSubmit">
    <Message v-if="form.formError.value" severity="error">{{ form.formError.value }}</Message>

    <section class="grid gap-4 rounded-xl border border-surface bg-surface-0 p-4">
      <h3 class="text-base font-semibold text-color">
        {{ t('admin.orders.sections.orderDetails') }}
      </h3>

      <div class="grid gap-4 md:grid-cols-2">
        <label v-for="field in readonlyOrderFields" :key="field.label" class="grid gap-2 text-sm">
          <span class="font-medium text-color">{{ field.label }}</span>
          <input
            :value="formatReadonlyValue(field.value)"
            :class="readonlyInputClass"
            readonly
            disabled
          />
        </label>
      </div>
    </section>

    <section class="grid gap-4 rounded-xl border border-surface bg-surface-0 p-4">
      <h3 class="text-base font-semibold text-color">{{ t('admin.orders.sections.shipping') }}</h3>

      <label class="grid gap-2 text-sm">
        <span class="font-medium text-color">{{ t('admin.orders.fields.shippingAddress') }}</span>
        <textarea
          :value="shippingAddressText"
          :class="readonlyInputClass"
          rows="4"
          readonly
          disabled
        />
      </label>
    </section>

    <section class="grid gap-4 rounded-xl border border-surface bg-surface-0 p-4">
      <div class="space-y-1">
        <h3 class="text-base font-semibold text-color">{{ t('admin.orders.sections.items') }}</h3>
        <p class="text-sm text-muted-color">
          {{ t('admin.orders.itemCount', { count: orderItems.length }) }}
        </p>
      </div>

      <Message v-if="!hasOrderItems" severity="secondary" variant="simple">
        {{ t('admin.orders.itemsEmpty') }}
      </Message>

      <article
        v-for="(item, index) in orderItems"
        :key="item.id ?? item.variantId ?? index"
        class="grid gap-4 rounded-lg border border-surface bg-surface-50 p-4"
      >
        <h4 class="font-medium text-color">{{ getItemTitle(item) }}</h4>

        <div class="grid gap-4 md:grid-cols-2">
          <label v-for="field in getItemFields(item)" :key="field.label" class="grid gap-2 text-sm">
            <span class="font-medium text-color">{{ field.label }}</span>
            <input
              :value="formatReadonlyValue(field.value)"
              :class="readonlyInputClass"
              readonly
              disabled
            />
          </label>
        </div>

        <label class="grid gap-2 text-sm">
          <span class="font-medium text-color">{{ t('admin.orders.fields.images') }}</span>
          <textarea
            :value="formatReadonlyValue(item.variant?.images)"
            :class="readonlyInputClass"
            rows="3"
            readonly
            disabled
          />
        </label>
      </article>
    </section>

    <label class="grid gap-2 text-sm">
      <span class="font-medium text-color">{{ t('admin.orders.table.status') }}</span>
      <select v-model="form.draft.status" class="rounded-lg border border-surface px-3 py-2">
        <option value="PENDING">PENDING</option>
        <option value="PAID">PAID</option>
        <option value="SHIPPED">SHIPPED</option>
        <option value="DELIVERED">DELIVERED</option>
        <option value="CANCELLED">CANCELLED</option>
      </select>
      <span v-if="form.fieldErrors.status" class="text-xs text-red-500">{{
        form.fieldErrors.status
      }}</span>
    </label>

    <div class="flex flex-col gap-3 sm:flex-row sm:justify-end">
      <Button
        type="button"
        text
        severity="secondary"
        :label="t('common.cancel')"
        @click="emit('cancel')"
      />
      <Button
        type="submit"
        :loading="form.submitting.value"
        :label="t('admin.actions.updateOrderStatus')"
      />
    </div>
  </form>
</template>
