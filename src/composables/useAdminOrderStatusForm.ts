import { reactive, ref } from 'vue'
import { updateAdminOrderStatus, type AdminOrder } from '@/api'
import type { AdminOrderStatus } from '@/api/adminTypes'
import { i18n } from '@/i18n'

export interface AdminOrderStatusDraft {
  status: AdminOrderStatus
}

interface UseAdminOrderStatusFormOptions {
  order: AdminOrder
}

export function useAdminOrderStatusForm(options: UseAdminOrderStatusFormOptions) {
  const t = i18n.global.t
  const draft = reactive<AdminOrderStatusDraft>({ status: options.order.status })
  const fieldErrors = reactive<Partial<Record<keyof AdminOrderStatusDraft, string>>>({})
  const formError = ref<string | null>(null)
  const submitting = ref(false)

  function validate(): boolean {
    formError.value = null
    Object.keys(fieldErrors).forEach(
      (key) => delete fieldErrors[key as keyof AdminOrderStatusDraft],
    )

    if (!draft.status) {
      fieldErrors.status = t('admin.validation.required')
    }

    return !Object.keys(fieldErrors).length
  }

  async function submit() {
    if (submitting.value || !validate()) return false

    submitting.value = true
    formError.value = null

    const result = await updateAdminOrderStatus(options.order.id, draft.status)

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
