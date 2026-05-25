import { reactive, ref } from 'vue'
import { createAdminProductSet, updateAdminProductSet, type AdminProductSet } from '@/api'
import type { AdminProductSetPayload } from '@/api/adminTypes'
import { useAdminTempFileUpload } from './useAdminTempFileUpload'
import { i18n } from '@/i18n'

export interface AdminProductSetDraft {
  name: string
  slug: string
  imageUrl: string
  roomId: string
  variantIds: string
}

interface UseAdminProductSetFormOptions {
  mode: 'create' | 'edit'
  productSet?: AdminProductSet | null
}

function createDraft(productSet?: AdminProductSet | null): AdminProductSetDraft {
  return {
    name: productSet?.name ?? '',
    slug: productSet?.slug ?? '',
    imageUrl: productSet?.imageUrl ?? '',
    roomId: productSet?.roomId != null ? String(productSet.roomId) : '',
    variantIds: productSet?.variantIds?.join('\n') ?? '',
  }
}

export function useAdminProductSetForm(options: UseAdminProductSetFormOptions) {
  const t = i18n.global.t
  const draft = reactive<AdminProductSetDraft>(createDraft(options.productSet))
  const fieldErrors = reactive<Partial<Record<keyof AdminProductSetDraft | 'file', string>>>({})
  const formError = ref<string | null>(null)
  const submitting = ref(false)

  const { selectedFile, selectFile, clearFile, uploadIfSelected } = useAdminTempFileUpload()

  function validate(): boolean {
    formError.value = null
    Object.keys(fieldErrors).forEach((key) => delete fieldErrors[key as keyof typeof fieldErrors])

    if (!draft.name.trim()) {
      fieldErrors.name = t('admin.validation.required')
    }

    if (!draft.slug.trim()) {
      fieldErrors.slug = t('admin.validation.required')
    }

    if (!draft.roomId.trim()) {
      fieldErrors.roomId = t('admin.validation.required')
    } else if (!Number.isFinite(Number(draft.roomId))) {
      fieldErrors.roomId = t('admin.validation.number')
    }

    return !Object.keys(fieldErrors).length
  }

  function buildPayload(): AdminProductSetPayload {
    const variantIds = draft.variantIds
      .split('\n')
      .map((id) => id.trim())
      .filter(Boolean)

    return {
      name: draft.name.trim(),
      slug: draft.slug.trim(),
      imageUrl: draft.imageUrl.trim() || undefined,
      roomId: draft.roomId.trim() ? Number(draft.roomId) : undefined,
      variantIds: variantIds.length ? variantIds : undefined,
    }
  }

  async function submit() {
    if (submitting.value || !validate()) return false

    submitting.value = true
    formError.value = null

    if (selectedFile.value) {
      const tempUrl = await uploadIfSelected(
        (key, msg) => {
          fieldErrors[key as keyof typeof fieldErrors] = msg
        },
        (msg) => {
          formError.value = msg
        },
        t,
      )
      if (tempUrl === null) {
        submitting.value = false
        return false
      }
      draft.imageUrl = tempUrl
    }

    const result =
      options.mode === 'create' || !options.productSet
        ? await createAdminProductSet(buildPayload())
        : await updateAdminProductSet(options.productSet.id, buildPayload())

    submitting.value = false

    if (!result.ok) {
      if (result.error.fields) {
        for (const [field, message] of Object.entries(result.error.fields)) {
          if (field in draft || field === 'file') {
            fieldErrors[field as keyof typeof fieldErrors] = message
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

  return { draft, fieldErrors, formError, submitting, selectedFile, selectFile, clearFile, submit }
}
