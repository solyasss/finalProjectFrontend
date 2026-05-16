import { reactive, ref } from 'vue'
import { updateAdminReview, type AdminReview } from '@/api'
import type { AdminReviewPayload, ReviewStatus } from '@/api/adminTypes'
import { i18n } from '@/i18n'

export interface AdminReviewDraft {
  rating: string
  text: string
  status: ReviewStatus
}

interface UseAdminReviewFormOptions {
  review: AdminReview
}

export function useAdminReviewForm(options: UseAdminReviewFormOptions) {
  const t = i18n.global.t
  const draft = reactive<AdminReviewDraft>({
    rating: String(options.review.rating),
    text: options.review.text,
    status: options.review.status,
  })
  const fieldErrors = reactive<Partial<Record<keyof AdminReviewDraft, string>>>({})
  const formError = ref<string | null>(null)
  const submitting = ref(false)

  function validate(): boolean {
    formError.value = null
    Object.keys(fieldErrors).forEach((key) => delete fieldErrors[key as keyof AdminReviewDraft])

    if (draft.rating.trim()) {
      const num = Number(draft.rating)
      if (!Number.isFinite(num) || num < 1 || num > 5) {
        fieldErrors.rating = t('admin.validation.number')
      }
    }

    return !Object.keys(fieldErrors).length
  }

  function buildPayload(): AdminReviewPayload {
    return {
      rating: draft.rating.trim() ? Number(draft.rating) : undefined,
      text: draft.text.trim() || undefined,
      status: draft.status,
    }
  }

  async function submit() {
    if (submitting.value || !validate()) return false

    submitting.value = true
    formError.value = null

    const result = await updateAdminReview(options.review.id, buildPayload())

    submitting.value = false

    if (!result.ok) {
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
