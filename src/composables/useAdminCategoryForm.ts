import { reactive, ref } from 'vue'
import { createAdminCategory, updateAdminCategory, type AdminCategory } from '@/api'
import type { AdminCategoryPayload } from '@/api/adminTypes'
import { i18n } from '@/i18n'

export interface AdminCategoryDraft {
  name: string
  slug: string
  description: string
  imageUrl: string
  sortOrder: string
  parentId: string
}

interface UseAdminCategoryFormOptions {
  mode: 'create' | 'edit'
  category?: AdminCategory | null
}

function createDraft(category?: AdminCategory | null): AdminCategoryDraft {
  return {
    name: category?.name ?? '',
    slug: category?.slug ?? '',
    description: category?.description ?? '',
    imageUrl: category?.imageUrl ?? '',
    sortOrder: category?.sortOrder ? String(category.sortOrder) : '',
    parentId: category?.parentId ? String(category.parentId) : '',
  }
}

export function useAdminCategoryForm(options: UseAdminCategoryFormOptions) {
  const t = i18n.global.t
  const draft = reactive<AdminCategoryDraft>(createDraft(options.category))
  const fieldErrors = reactive<Partial<Record<keyof AdminCategoryDraft, string>>>({})
  const formError = ref<string | null>(null)
  const submitting = ref(false)

  function validate(): boolean {
    formError.value = null
    Object.keys(fieldErrors).forEach((key) => delete fieldErrors[key as keyof AdminCategoryDraft])

    if (!draft.name.trim()) {
      fieldErrors.name = t('admin.validation.required')
    }

    if (!draft.slug.trim()) {
      fieldErrors.slug = t('admin.validation.required')
    }

    if (draft.sortOrder.trim() && !Number.isFinite(Number(draft.sortOrder))) {
      fieldErrors.sortOrder = t('admin.validation.number')
    }

    if (draft.parentId.trim() && !Number.isFinite(Number(draft.parentId))) {
      fieldErrors.parentId = t('admin.validation.number')
    }

    return !Object.keys(fieldErrors).length
  }

  function buildPayload(): AdminCategoryPayload {
    return {
      name: draft.name.trim(),
      slug: draft.slug.trim(),
      description: draft.description.trim() || undefined,
      imageUrl: draft.imageUrl.trim() || undefined,
      sortOrder: draft.sortOrder.trim() ? Number(draft.sortOrder) : undefined,
      parentId: draft.parentId.trim() ? Number(draft.parentId) : undefined,
    }
  }

  async function submit() {
    if (submitting.value || !validate()) {
      return false
    }

    submitting.value = true
    formError.value = null

    const result =
      options.mode === 'create' || !options.category
        ? await createAdminCategory(buildPayload())
        : await updateAdminCategory(options.category.id, buildPayload())

    submitting.value = false

    if (!result.ok) {
      if (result.error.fields) {
        for (const [field, message] of Object.entries(result.error.fields)) {
          if (field in draft) {
            fieldErrors[field as keyof AdminCategoryDraft] = message
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
    submit,
  }
}
