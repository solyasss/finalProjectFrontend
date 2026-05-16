import { reactive, ref } from 'vue'
import { createAdminPromotion, updateAdminPromotion, type AdminPromotion } from '@/api'
import type {
  AdminPromotionPayload,
  PromotionDiscountType,
  PromotionTargetType,
} from '@/api/adminTypes'
import { i18n } from '@/i18n'

export interface AdminPromotionDraft {
  name: string
  slug: string
  description: string
  discountType: PromotionDiscountType
  discountValue: string
  targetType: PromotionTargetType
  targetIds: string
  startDate: string
  endDate: string
  isActive: boolean
}

interface UseAdminPromotionFormOptions {
  mode: 'create' | 'edit'
  promotion?: AdminPromotion | null
}

function toDateInput(dateStr: string | undefined): string {
  if (!dateStr) return ''
  return dateStr.slice(0, 10)
}

function createDraft(promotion?: AdminPromotion | null): AdminPromotionDraft {
  return {
    name: promotion?.name ?? '',
    slug: promotion?.slug ?? '',
    description: promotion?.description ?? '',
    discountType: promotion?.discountType ?? 'PERCENTAGE',
    discountValue: promotion?.discountValue != null ? String(promotion.discountValue) : '',
    targetType: promotion?.targetType ?? 'GLOBAL',
    targetIds: promotion?.targetIds?.map(String).join('\n') ?? '',
    startDate: toDateInput(promotion?.startDate),
    endDate: toDateInput(promotion?.endDate),
    isActive: promotion?.isActive ?? true,
  }
}

export function useAdminPromotionForm(options: UseAdminPromotionFormOptions) {
  const t = i18n.global.t
  const draft = reactive<AdminPromotionDraft>(createDraft(options.promotion))
  const fieldErrors = reactive<Partial<Record<keyof AdminPromotionDraft, string>>>({})
  const formError = ref<string | null>(null)
  const submitting = ref(false)

  function validate(): boolean {
    formError.value = null
    Object.keys(fieldErrors).forEach((key) => delete fieldErrors[key as keyof AdminPromotionDraft])

    if (!draft.name.trim()) fieldErrors.name = t('admin.validation.required')
    if (!draft.slug.trim()) fieldErrors.slug = t('admin.validation.required')
    if (!draft.discountValue.trim()) fieldErrors.discountValue = t('admin.validation.required')
    else if (!Number.isFinite(Number(draft.discountValue)))
      fieldErrors.discountValue = t('admin.validation.number')
    if (!draft.startDate) fieldErrors.startDate = t('admin.validation.required')
    if (!draft.endDate) fieldErrors.endDate = t('admin.validation.required')

    return !Object.keys(fieldErrors).length
  }

  function buildPayload(): AdminPromotionPayload {
    const targetIds = draft.targetIds
      .split('\n')
      .map((id) => id.trim())
      .filter(Boolean)

    return {
      name: draft.name.trim(),
      slug: draft.slug.trim(),
      description: draft.description.trim() || undefined,
      discountType: draft.discountType,
      discountValue: Number(draft.discountValue),
      targetType: draft.targetType,
      targetIds: targetIds.length ? targetIds : undefined,
      startDate: draft.startDate ? new Date(draft.startDate).toISOString() : undefined,
      endDate: draft.endDate ? new Date(draft.endDate).toISOString() : undefined,
      isActive: draft.isActive,
    }
  }

  async function submit() {
    if (submitting.value || !validate()) return false

    submitting.value = true
    formError.value = null

    const result =
      options.mode === 'create' || !options.promotion
        ? await createAdminPromotion(buildPayload())
        : await updateAdminPromotion(options.promotion.id, buildPayload())

    submitting.value = false

    if (!result.ok) {
      if (result.error.fields) {
        for (const [field, message] of Object.entries(result.error.fields)) {
          if (field in draft) {
            fieldErrors[field as keyof AdminPromotionDraft] = message
          }
        }
      }

      formError.value =
        result.error.code === 'FORBIDDEN'
          ? t('admin.messages.forbidden')
          : result.error.message || t('admin.messages.saveFailed')
      return false
    }

    return true
  }

  return { draft, fieldErrors, formError, submitting, submit }
}
