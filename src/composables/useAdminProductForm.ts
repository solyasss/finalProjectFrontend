import { reactive, ref } from 'vue'
import {
  createAdminProduct,
  updateAdminProduct,
  type AdminCategory,
  type AdminProduct,
  type AdminProductPayload,
  type AdminProductVariantPayload,
} from '@/api'
import { i18n } from '@/i18n'
import { normalizeImageUrls } from '@/utils/image'

export interface AdminProductVariantDraft {
  sku: string
  color: string
  price: string
  stock: string
  images: string
  weightKg: string
  widthCm: string
  heightCm: string
  depthCm: string
  attributes: string
}

export interface AdminProductDraft {
  name: string
  slug: string
  description: string
  baseImageUrl: string
  categoryIds: number[]
  variants: AdminProductVariantDraft[]
}

type AdminProductField = 'name' | 'slug' | 'categoryIds' | 'variants'

interface UseAdminProductFormOptions {
  mode: 'create' | 'edit'
  product?: AdminProduct | null
  categories: AdminCategory[]
}

function createVariantDraft(variant?: AdminProduct['variants'][number]): AdminProductVariantDraft {
  return {
    sku: variant?.sku ?? '',
    color: variant?.color ?? '',
    price: variant?.price ? String(variant.price) : '',
    stock: variant ? String(variant.stock) : '',
    images: variant?.images ? normalizeImageUrls(variant.images).join('\n') : '',
    weightKg: variant?.weightKg ? String(variant.weightKg) : '',
    widthCm: variant?.widthCm ? String(variant.widthCm) : '',
    heightCm: variant?.heightCm ? String(variant.heightCm) : '',
    depthCm: variant?.depthCm ? String(variant.depthCm) : '',
    attributes: variant?.attributes ? JSON.stringify(variant.attributes, null, 2) : '',
  }
}

function createProductDraft(product?: AdminProduct | null): AdminProductDraft {
  return {
    name: product?.name ?? '',
    slug: product?.slug ?? '',
    description: product?.description ?? '',
    baseImageUrl: product?.baseImageUrl ?? '',
    categoryIds: product?.categories.map((category) => category.id) ?? [],
    variants: product?.variants.length
      ? product.variants.map(createVariantDraft)
      : [createVariantDraft()],
  }
}

function toOptionalNumber(value: string): number | undefined {
  if (!value.trim()) {
    return undefined
  }

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

export function useAdminProductForm(options: UseAdminProductFormOptions) {
  const t = i18n.global.t
  const draft = reactive<AdminProductDraft>(createProductDraft(options.product))
  const fieldErrors = reactive<Partial<Record<AdminProductField, string>>>({})
  const variantErrors = reactive<Record<string, string>>({})
  const formError = ref<string | null>(null)
  const submitting = ref(false)

  const categoryOptions = options.categories

  function addVariant() {
    draft.variants.push(createVariantDraft())
  }

  function removeVariant(index: number) {
    if (draft.variants.length === 1) {
      return
    }

    draft.variants.splice(index, 1)

    for (const key of Object.keys(variantErrors)) {
      if (key.startsWith(`${index}.`)) {
        delete variantErrors[key]
      }
    }
  }

  function validate(): boolean {
    formError.value = null
    Object.keys(fieldErrors).forEach((key) => delete fieldErrors[key as AdminProductField])
    Object.keys(variantErrors).forEach((key) => delete variantErrors[key])

    if (!draft.name.trim()) {
      fieldErrors.name = t('admin.validation.required')
    }

    if (!draft.slug.trim()) {
      fieldErrors.slug = t('admin.validation.required')
    }

    if (!draft.categoryIds.length) {
      fieldErrors.categoryIds = t('admin.validation.selectCategory')
    }

    if (!draft.variants.length) {
      fieldErrors.variants = t('admin.validation.variantRequired')
    }

    draft.variants.forEach((variant, index) => {
      if (!variant.sku.trim()) {
        variantErrors[`${index}.sku`] = t('admin.validation.required')
      }

      const price = Number(variant.price)
      if (!variant.price.trim() || !Number.isFinite(price) || price < 0) {
        variantErrors[`${index}.price`] = t('admin.validation.number')
      }

      const stock = Number(variant.stock)
      if (!variant.stock.trim() || !Number.isFinite(stock) || stock < 0) {
        variantErrors[`${index}.stock`] = t('admin.validation.number')
      }

      if (variant.attributes.trim()) {
        try {
          JSON.parse(variant.attributes)
        } catch {
          variantErrors[`${index}.attributes`] = t('admin.validation.json')
        }
      }
    })

    return !Object.keys(fieldErrors).length && !Object.keys(variantErrors).length
  }

  function buildVariantPayload(variant: AdminProductVariantDraft): AdminProductVariantPayload {
    const payload: AdminProductVariantPayload = {
      sku: variant.sku.trim(),
      price: Number(variant.price),
      stock: Number(variant.stock),
    }

    if (variant.color.trim()) {
      payload.color = variant.color.trim()
    }

    const images = variant.images
      .split('\n')
      .map((entry) => entry.trim())
      .filter(Boolean)

    if (images.length) {
      payload.images = images
    }

    payload.weightKg = toOptionalNumber(variant.weightKg)
    payload.widthCm = toOptionalNumber(variant.widthCm)
    payload.heightCm = toOptionalNumber(variant.heightCm)
    payload.depthCm = toOptionalNumber(variant.depthCm)

    if (variant.attributes.trim()) {
      payload.attributes = JSON.parse(variant.attributes) as Record<
        string,
        string | number | boolean | null
      >
    }

    return payload
  }

  function buildPayload(): AdminProductPayload {
    const payload: AdminProductPayload = {
      name: draft.name.trim(),
      slug: draft.slug.trim(),
      categoryIds: [...draft.categoryIds],
      variants: draft.variants.map(buildVariantPayload),
    }

    if (draft.description.trim()) {
      payload.description = draft.description.trim()
    }

    if (draft.baseImageUrl.trim()) {
      payload.baseImageUrl = draft.baseImageUrl.trim()
    }

    return payload
  }

  function applyServerErrors(fields?: Record<string, string> | null) {
    if (!fields) {
      return
    }

    for (const [field, message] of Object.entries(fields)) {
      if (field === 'name' || field === 'slug' || field === 'categoryIds' || field === 'variants') {
        fieldErrors[field] = message
        continue
      }

      if (field.startsWith('variants.')) {
        variantErrors[field.replace('variants.', '')] = message
      }
    }
  }

  async function submit() {
    if (submitting.value || !validate()) {
      return false
    }

    submitting.value = true
    formError.value = null

    const payload = buildPayload()
    const result =
      options.mode === 'create' || !options.product
        ? await createAdminProduct(payload)
        : await updateAdminProduct(options.product.id, payload)

    submitting.value = false

    if (!result.ok) {
      applyServerErrors(result.error.fields)
      formError.value =
        result.error.code === 'FORBIDDEN'
          ? t('admin.messages.forbidden')
          : result.error.message || t('admin.messages.saveFailed')
      return false
    }

    return true
  }

  return {
    draft,
    fieldErrors,
    variantErrors,
    formError,
    submitting,
    categoryOptions,
    addVariant,
    removeVariant,
    submit,
  }
}
