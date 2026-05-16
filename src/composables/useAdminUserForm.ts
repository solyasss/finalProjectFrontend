import { reactive, ref } from 'vue'
import { createAdminUser, updateAdminUser, type AdminUser } from '@/api'
import type { AdminUserCreatePayload, AdminUserUpdatePayload, UserRole } from '@/api/adminTypes'
import { i18n } from '@/i18n'

export interface AdminUserDraft {
  email: string
  password: string
  firstName: string
  lastName: string
  role: UserRole
}

interface UseAdminUserFormOptions {
  mode: 'create' | 'edit'
  user?: AdminUser | null
}

function createDraft(user?: AdminUser | null): AdminUserDraft {
  return {
    email: user?.email ?? '',
    password: '',
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    role: (user?.role as UserRole) ?? 'USER',
  }
}

export function useAdminUserForm(options: UseAdminUserFormOptions) {
  const t = i18n.global.t
  const draft = reactive<AdminUserDraft>(createDraft(options.user))
  const fieldErrors = reactive<Partial<Record<keyof AdminUserDraft, string>>>({})
  const formError = ref<string | null>(null)
  const submitting = ref(false)

  function validate(): boolean {
    formError.value = null
    Object.keys(fieldErrors).forEach((key) => delete fieldErrors[key as keyof AdminUserDraft])

    if (!draft.email.trim()) fieldErrors.email = t('admin.validation.required')
    if (options.mode === 'create' && !draft.password.trim()) {
      fieldErrors.password = t('admin.validation.required')
    }
    if (!draft.firstName.trim()) fieldErrors.firstName = t('admin.validation.required')
    if (!draft.lastName.trim()) fieldErrors.lastName = t('admin.validation.required')

    return !Object.keys(fieldErrors).length
  }

  async function submit() {
    if (submitting.value || !validate()) return false

    submitting.value = true
    formError.value = null

    let result

    if (options.mode === 'create' || !options.user) {
      const payload: AdminUserCreatePayload = {
        email: draft.email.trim(),
        password: draft.password,
        firstName: draft.firstName.trim(),
        lastName: draft.lastName.trim(),
        role: draft.role,
      }
      result = await createAdminUser(payload)
    } else {
      const payload: AdminUserUpdatePayload = {
        email: draft.email.trim(),
        firstName: draft.firstName.trim(),
        lastName: draft.lastName.trim(),
        role: draft.role,
      }
      result = await updateAdminUser(options.user.id, payload)
    }

    submitting.value = false

    if (!result.ok) {
      if (result.error.fields) {
        for (const [field, message] of Object.entries(result.error.fields)) {
          if (field in draft) {
            fieldErrors[field as keyof AdminUserDraft] = message
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
