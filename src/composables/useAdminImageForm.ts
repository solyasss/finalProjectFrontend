import { reactive, ref } from 'vue'
import { createAdminImage, updateAdminImage, type AdminImage, type AdminImagePayload } from '@/api'
import { i18n } from '@/i18n'

export interface AdminImageDraft {
  variantId: string
  sortOrder: string | number
  isPrimary: boolean
  file: File | null
  notifyResponse: boolean
}

interface UseAdminImageFormOptions {
  mode: 'create' | 'edit'
  image?: AdminImage | null
}

function createDraft(image?: AdminImage | null): AdminImageDraft {
  return {
    variantId: image?.variantId ?? '',
    sortOrder: image?.sortOrder ? String(image.sortOrder) : '',
    isPrimary: Boolean(image?.isPrimary),
    file: null,
    notifyResponse: true,
  }
}

function normalizeSortOrderInput(sortOrder: AdminImageDraft['sortOrder']): string {
  return String(sortOrder).trim()
}

export function useAdminImageForm(options: UseAdminImageFormOptions) {
  const t = i18n.global.t
  const draft = reactive<AdminImageDraft>(createDraft(options.image))
  const fieldErrors = reactive<Partial<Record<'variantId' | 'sortOrder' | 'file', string>>>({})
  const formError = ref<string | null>(null)
  const submitting = ref(false)

  function setFile(file: File | null) {
    draft.file = file
  }

  function validate(): boolean {
    formError.value = null
    Object.keys(fieldErrors).forEach((key) => delete fieldErrors[key as keyof typeof fieldErrors])

    if (!draft.variantId.trim()) {
      fieldErrors.variantId = t('admin.validation.required')
    }

    if (options.mode === 'create' && !draft.file) {
      fieldErrors.file = t('admin.images.validation.fileRequired')
    }

    const normalizedSortOrder = normalizeSortOrderInput(draft.sortOrder)

    if (normalizedSortOrder && !Number.isFinite(Number(normalizedSortOrder))) {
      fieldErrors.sortOrder = t('admin.validation.number')
    }

    return !Object.keys(fieldErrors).length
  }

  function buildPayload(): AdminImagePayload {
    const normalizedSortOrder = normalizeSortOrderInput(draft.sortOrder)

    return {
      file: draft.file,
      variantId: draft.variantId.trim(),
      sortOrder: normalizedSortOrder ? Number(normalizedSortOrder) : undefined,
      isPrimary: draft.isPrimary,
      notifyResponse: draft.notifyResponse,
    }
  }

  async function submit() {
    if (submitting.value || !validate()) {
      return false
    }

    submitting.value = true
    formError.value = null

    const result =
      options.mode === 'create' || !options.image
        ? await createAdminImage(buildPayload())
        : await updateAdminImage(options.image.id, buildPayload())

    submitting.value = false

    if (!result.ok) {
      if (result.error.fields) {
        for (const [field, message] of Object.entries(result.error.fields)) {
          if (field === 'variantId' || field === 'sortOrder' || field === 'file') {
            fieldErrors[field] = message
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

  return {
    draft,
    fieldErrors,
    formError,
    submitting,
    setFile,
    submit,
  }
}
