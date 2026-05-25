import { reactive, ref } from 'vue'
import { createAdminRoom, updateAdminRoom, type AdminRoom } from '@/api'
import type { AdminRoomPayload } from '@/api/adminTypes'
import { useAdminTempFileUpload } from './useAdminTempFileUpload'
import { i18n } from '@/i18n'

export interface AdminRoomDraft {
  name: string
  slug: string
  description: string
  imageUrl: string
  sortOrder: string
}

interface UseAdminRoomFormOptions {
  mode: 'create' | 'edit'
  room?: AdminRoom | null
}

function createDraft(room?: AdminRoom | null): AdminRoomDraft {
  return {
    name: room?.name ?? '',
    slug: room?.slug ?? '',
    description: room?.description ?? '',
    imageUrl: room?.imageUrl ?? '',
    sortOrder: room?.sortOrder != null ? String(room.sortOrder) : '',
  }
}

export function useAdminRoomForm(options: UseAdminRoomFormOptions) {
  const t = i18n.global.t
  const draft = reactive<AdminRoomDraft>(createDraft(options.room))
  const fieldErrors = reactive<Partial<Record<keyof AdminRoomDraft | 'file', string>>>({})
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

    if (draft.sortOrder.trim() && !Number.isFinite(Number(draft.sortOrder))) {
      fieldErrors.sortOrder = t('admin.validation.number')
    }

    return !Object.keys(fieldErrors).length
  }

  function buildPayload(): AdminRoomPayload {
    return {
      name: draft.name.trim(),
      slug: draft.slug.trim(),
      description: draft.description.trim() || undefined,
      imageUrl: draft.imageUrl.trim() || undefined,
      sortOrder: draft.sortOrder.trim() ? Number(draft.sortOrder) : undefined,
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
      options.mode === 'create' || !options.room
        ? await createAdminRoom(buildPayload())
        : await updateAdminRoom(options.room.id, buildPayload())

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
