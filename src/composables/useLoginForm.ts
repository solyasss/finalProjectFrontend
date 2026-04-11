import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores'
import type { ApiResult, LoginRequest, LoginResponse } from '@/api'

export interface LoginDraft {
  email: string
  password: string
}

export type LoginField = keyof LoginDraft

interface LoginOptions {
  initialDraft?: Partial<LoginDraft>
  submitSignIn?: (payload: LoginRequest) => Promise<ApiResult<LoginResponse>>
}

const DEFAULT_DRAFT: LoginDraft = {
  email: '',
  password: '',
}

export function useLoginForm(options: LoginOptions = {}) {
  const { t } = useI18n()

  const draft = reactive<LoginDraft>({
    ...DEFAULT_DRAFT,
    ...options.initialDraft,
  })

  const touched = reactive<Partial<Record<LoginField, boolean>>>({})
  const fieldErrors = reactive<Partial<Record<LoginField, string>>>({})
  const formError = ref<string | null>(null)
  const submitting = ref(false)

  function markTouched(field: LoginField) {
    touched[field] = true
    validateField(field)
  }

  function getFieldError(field: LoginField): string | undefined {
    switch (field) {
      case 'email':
        if (!draft.email.trim()) {
          return t('authLogin.errors.required')
        }

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())
          ? undefined
          : t('authLogin.errors.email')
      case 'password':
        return draft.password ? undefined : t('authLogin.errors.required')
    }
  }

  function validateField(field: LoginField): boolean {
    const error = getFieldError(field)

    if (error) {
      fieldErrors[field] = error
      return false
    }

    delete fieldErrors[field]
    return true
  }

  function validateForm(): boolean {
    formError.value = null

    return (Object.keys(DEFAULT_DRAFT) as LoginField[]).every((field) => {
      touched[field] = true
      return validateField(field)
    })
  }

  function applyServerErrors(fields?: Record<string, string> | null) {
    if (!fields) {
      return
    }

    const fieldMap: Partial<Record<string, LoginField>> = {
      email: 'email',
      password: 'password',
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

  async function submitLogin() {
    if (submitting.value) {
      return false
    }

    const isValid = validateForm()

    if (!isValid) {
      return false
    }

    submitting.value = true
    formError.value = null

    const submitSignIn =
      options.submitSignIn ?? ((payload: LoginRequest) => useAuthStore().signIn(payload))
    const result = await submitSignIn({
      email: draft.email.trim(),
      password: draft.password,
    })

    submitting.value = false

    if (result.ok) {
      return true
    }

    applyServerErrors(result.error.fields)

    if (result.error.code === 'UNAUTHORIZED') {
      formError.value = t('authLogin.errors.invalidCredentials')
      return false
    }

    formError.value = result.error.message || t('authLogin.errors.generic')
    return false
  }

  return {
    draft,
    fieldErrors,
    formError,
    submitting,
    markTouched,
    submitLogin,
    validateField,
    validateForm,
  }
}
