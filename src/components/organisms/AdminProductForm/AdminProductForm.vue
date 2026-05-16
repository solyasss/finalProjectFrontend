<script setup lang="ts">
import Button from 'primevue/button'
import Message from 'primevue/message'
import Textarea from 'primevue/textarea'
import { useI18n } from 'vue-i18n'
import { useAdminProductForm } from '@/composables/useAdminProductForm'
import type { AdminCategory, AdminProduct } from '@/api'

interface Props {
  mode: 'create' | 'edit'
  product?: AdminProduct | null
  categories: AdminCategory[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (event: 'success'): void
  (event: 'cancel'): void
}>()

const { t } = useI18n()
const form = useAdminProductForm({
  mode: props.mode,
  product: props.product,
  categories: props.categories,
})

async function handleSubmit() {
  const succeeded = await form.submit()

  if (succeeded) {
    emit('success')
  }
}
</script>

<template>
  <form class="grid gap-5" @submit.prevent="handleSubmit">
    <Message v-if="form.formError.value" severity="error">{{ form.formError.value }}</Message>

    <div class="grid gap-4 md:grid-cols-2">
      <label class="grid gap-2 text-sm">
        <span class="font-medium text-color">{{ t('admin.products.fields.name') }}</span>
        <input
          v-model="form.draft.name"
          class="rounded-lg border border-surface px-3 py-2"
          type="text"
        />
        <span v-if="form.fieldErrors.name" class="text-xs text-red-500">{{
          form.fieldErrors.name
        }}</span>
      </label>

      <label class="grid gap-2 text-sm">
        <span class="font-medium text-color">{{ t('admin.products.fields.slug') }}</span>
        <input
          v-model="form.draft.slug"
          class="rounded-lg border border-surface px-3 py-2"
          type="text"
        />
        <span v-if="form.fieldErrors.slug" class="text-xs text-red-500">{{
          form.fieldErrors.slug
        }}</span>
      </label>
    </div>

    <label class="grid gap-2 text-sm">
      <span class="font-medium text-color">{{ t('admin.products.fields.description') }}</span>
      <Textarea v-model="form.draft.description" rows="4" auto-resize />
    </label>

    <label class="grid gap-2 text-sm">
      <span class="font-medium text-color">{{ t('admin.products.fields.baseImageUrl') }}</span>
      <input
        v-model="form.draft.baseImageUrl"
        class="rounded-lg border border-surface px-3 py-2"
        type="url"
      />
    </label>

    <label class="grid gap-2 text-sm">
      <span class="font-medium text-color">{{ t('admin.products.fields.categories') }}</span>
      <select
        v-model="form.draft.categoryIds"
        multiple
        class="min-h-32 rounded-lg border border-surface px-3 py-2"
      >
        <option v-for="category in form.categoryOptions" :key="category.id" :value="category.id">
          {{ category.name }} (#{{ category.id }})
        </option>
      </select>
      <span v-if="form.fieldErrors.categoryIds" class="text-xs text-red-500">{{
        form.fieldErrors.categoryIds
      }}</span>
    </label>

    <section class="grid gap-4 rounded-2xl border border-surface p-4">
      <div class="flex items-center justify-between gap-3">
        <div>
          <h3 class="text-base font-semibold text-color">
            {{ t('admin.products.variantsTitle') }}
          </h3>
          <p class="text-sm text-muted-color">{{ t('admin.products.variantsDescription') }}</p>
        </div>
        <Button
          type="button"
          outlined
          severity="secondary"
          icon="pi pi-plus"
          :label="t('admin.actions.addVariant')"
          @click="form.addVariant"
        />
      </div>

      <span v-if="form.fieldErrors.variants" class="text-xs text-red-500">{{
        form.fieldErrors.variants
      }}</span>

      <article
        v-for="(variant, index) in form.draft.variants"
        :key="index"
        class="grid gap-4 rounded-xl border border-surface bg-surface-0 p-4"
      >
        <div class="flex items-center justify-between gap-3">
          <h4 class="text-sm font-semibold text-color">
            {{ t('admin.products.variantLabel', { index: index + 1 }) }}
          </h4>
          <Button
            v-if="form.draft.variants.length > 1"
            type="button"
            text
            severity="danger"
            icon="pi pi-trash"
            :label="t('admin.actions.removeVariant')"
            @click="form.removeVariant(index)"
          />
        </div>

        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <label class="grid gap-2 text-sm">
            <span class="font-medium text-color">{{ t('admin.products.fields.sku') }}</span>
            <input
              v-model="variant.sku"
              class="rounded-lg border border-surface px-3 py-2"
              type="text"
            />
            <span v-if="form.variantErrors[`${index}.sku`]" class="text-xs text-red-500">{{
              form.variantErrors[`${index}.sku`]
            }}</span>
          </label>

          <label class="grid gap-2 text-sm">
            <span class="font-medium text-color">{{ t('admin.products.fields.color') }}</span>
            <input
              v-model="variant.color"
              class="rounded-lg border border-surface px-3 py-2"
              type="text"
            />
          </label>

          <label class="grid gap-2 text-sm">
            <span class="font-medium text-color">{{ t('admin.products.fields.price') }}</span>
            <input
              v-model="variant.price"
              class="rounded-lg border border-surface px-3 py-2"
              inputmode="decimal"
              type="text"
            />
            <span v-if="form.variantErrors[`${index}.price`]" class="text-xs text-red-500">{{
              form.variantErrors[`${index}.price`]
            }}</span>
          </label>

          <label class="grid gap-2 text-sm">
            <span class="font-medium text-color">{{ t('admin.products.fields.stock') }}</span>
            <input
              v-model="variant.stock"
              class="rounded-lg border border-surface px-3 py-2"
              inputmode="numeric"
              type="text"
            />
            <span v-if="form.variantErrors[`${index}.stock`]" class="text-xs text-red-500">{{
              form.variantErrors[`${index}.stock`]
            }}</span>
          </label>

          <label class="grid gap-2 text-sm">
            <span class="font-medium text-color">{{ t('admin.products.fields.weightKg') }}</span>
            <input
              v-model="variant.weightKg"
              class="rounded-lg border border-surface px-3 py-2"
              inputmode="decimal"
              type="text"
            />
          </label>

          <label class="grid gap-2 text-sm">
            <span class="font-medium text-color">{{ t('admin.products.fields.widthCm') }}</span>
            <input
              v-model="variant.widthCm"
              class="rounded-lg border border-surface px-3 py-2"
              inputmode="decimal"
              type="text"
            />
          </label>

          <label class="grid gap-2 text-sm">
            <span class="font-medium text-color">{{ t('admin.products.fields.heightCm') }}</span>
            <input
              v-model="variant.heightCm"
              class="rounded-lg border border-surface px-3 py-2"
              inputmode="decimal"
              type="text"
            />
          </label>

          <label class="grid gap-2 text-sm">
            <span class="font-medium text-color">{{ t('admin.products.fields.depthCm') }}</span>
            <input
              v-model="variant.depthCm"
              class="rounded-lg border border-surface px-3 py-2"
              inputmode="decimal"
              type="text"
            />
          </label>
        </div>

        <label class="grid gap-2 text-sm">
          <span class="font-medium text-color">{{ t('admin.products.fields.images') }}</span>
          <Textarea v-model="variant.images" rows="3" auto-resize />
          <span class="text-xs text-muted-color">{{ t('admin.products.imagesHint') }}</span>
        </label>

        <label class="grid gap-2 text-sm">
          <span class="font-medium text-color">{{ t('admin.products.fields.attributes') }}</span>
          <Textarea v-model="variant.attributes" rows="5" auto-resize />
          <span v-if="form.variantErrors[`${index}.attributes`]" class="text-xs text-red-500">{{
            form.variantErrors[`${index}.attributes`]
          }}</span>
        </label>
      </article>
    </section>

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
        :label="
          props.mode === 'create'
            ? t('admin.actions.createProduct')
            : t('admin.actions.saveProduct')
        "
      />
    </div>
  </form>
</template>
