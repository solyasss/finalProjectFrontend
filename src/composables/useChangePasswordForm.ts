import { reactive, ref } from 'vue'
import { changePassword } from '@/api'
import type { ApiResult, ChangePasswordRequest } from '@/api'
import { i18n } from '@/i18n'

export interface ChangePasswordDraft {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export type ChangePasswordField = keyof ChangePasswordDraft

interface ChangePasswordOptions {
  submitChangePassword?: (payload: ChangePasswordRequest) => Promise<ApiResult<void>>
}

const DEFAULT_DRAFT: ChangePasswordDraft = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
}

export function useChangePasswordForm(options: ChangePasswordOptions = {}) {
  const t = i18n.global.t

  const draft = reactive<ChangePasswordDraft>({ ...DEFAULT_DRAFT })
  const touched = reactive<Partial<Record<ChangePasswordField, boolean>>>({})
  const fieldErrors = reactive<Partial<Record<ChangePasswordField, string>>>({})
  const formError = ref<string | null>(null)
  const successMessage = ref<string | null>(null)
  const submitting = ref(false)

  function getFieldError(field: ChangePasswordField): string | undefined {
    switch (field) {
      case 'currentPassword':
        return draft.currentPassword ? undefined : t('accountPage.errors.required')
      case 'newPassword':
        if (!draft.newPassword) {
          return t('accountPage.errors.required')
        }

        return draft.newPassword.length >= 8 ? undefined : t('accountPage.errors.passwordLength')
      case 'confirmPassword':
        if (!draft.confirmPassword) {
          return t('accountPage.errors.required')
        }

        return draft.confirmPassword === draft.newPassword
          ? undefined
          : t('accountPage.errors.passwordMismatch')
    }
  }

  function validateField(field: ChangePasswordField): boolean {
    const error = getFieldError(field)

    if (error) {
      fieldErrors[field] = error
      return false
    }

    delete fieldErrors[field]
    return true
  }

  function markTouched(field: ChangePasswordField) {
    touched[field] = true
    validateField(field)
  }

  function validateForm(): boolean {
    formError.value = null

    const results = (Object.keys(DEFAULT_DRAFT) as ChangePasswordField[]).map((field) => {
      touched[field] = true
      return validateField(field)
    })

    return results.every(Boolean)
  }

  function applyServerErrors(fields?: Record<string, string> | null) {
    if (!fields) {
      return
    }

    const fieldMap: Partial<Record<string, ChangePasswordField>> = {
      currentPassword: 'currentPassword',
      newPassword: 'newPassword',
      confirmPassword: 'confirmPassword',
    }

    for (const [serverField, message] of Object.entries(fields)) {
      const localField = fieldMap[serverField]
      if (!localField) {
        continue
      }

      touched[localField] = true
      fieldErrors[localField] = message
    }
  }

  function resetDraft() {
    Object.assign(draft, DEFAULT_DRAFT)
  }

  async function submitChangePassword() {
    if (submitting.value) {
      return false
    }

    successMessage.value = null

    if (!validateForm()) {
      return false
    }

    submitting.value = true
    formError.value = null

    const submitPasswordChange = options.submitChangePassword ?? changePassword
    const result = await submitPasswordChange({
      currentPassword: draft.currentPassword,
      newPassword: draft.newPassword,
    })

    submitting.value = false

    if (result.ok) {
      resetDraft()
      successMessage.value = t('accountPage.passwordSuccess')
      return true
    }

    applyServerErrors(result.error.fields)
    formError.value = result.error.message || t('accountPage.errors.generic')
    return false
  }

  return {
    draft,
    fieldErrors,
    formError,
    successMessage,
    submitting,
    markTouched,
    submitChangePassword,
    validateField,
    validateForm,
  }
}
