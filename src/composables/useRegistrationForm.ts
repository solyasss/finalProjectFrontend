import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { register } from '@/api'
import type { ApiResult, MessageResponse, RegisterRequest } from '@/api'

export type RegistrationStep = '1' | '2' | '3'

export interface RegistrationDraft {
  firstName: string
  lastName: string
  dateOfBirth: Date | null
  email: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
}

export type RegistrationField = keyof RegistrationDraft

interface RegistrationOptions {
  initialStep?: RegistrationStep
  initialDraft?: Partial<RegistrationDraft>
  submitRegister?: (payload: RegisterRequest) => Promise<ApiResult<MessageResponse>>
}

const DEFAULT_DRAFT: RegistrationDraft = {
  firstName: '',
  lastName: '',
  dateOfBirth: null,
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
}

const STEP_FIELDS: Record<RegistrationStep, RegistrationField[]> = {
  '1': ['firstName', 'lastName', 'dateOfBirth'],
  '2': ['email'],
  '3': ['password', 'confirmPassword', 'acceptTerms'],
}

export function useRegistrationForm(options: RegistrationOptions = {}) {
  const { t } = useI18n()

  const draft = reactive<RegistrationDraft>({
    ...DEFAULT_DRAFT,
    ...options.initialDraft,
  })

  const activeStep = ref<RegistrationStep>(options.initialStep ?? '1')
  const touched = reactive<Partial<Record<RegistrationField, boolean>>>({})
  const fieldErrors = reactive<Partial<Record<RegistrationField, string>>>({})
  const formError = ref<string | null>(null)
  const successMessage = ref<string | null>(null)
  const submitting = ref(false)

  const stepItems = computed(() => [
    { value: '1' as RegistrationStep, label: t('authRegister.stepPersonal') },
    { value: '2' as RegistrationStep, label: t('authRegister.stepContact') },
    { value: '3' as RegistrationStep, label: t('authRegister.stepSecurity') },
  ])

  const isSuccess = computed(() => successMessage.value !== null)
  const canGoBack = computed(() => activeStep.value !== '1' && !submitting.value)

  function setDraftValue<K extends RegistrationField>(field: K, value: RegistrationDraft[K]) {
    draft[field] = value
    if (touched[field]) {
      validateField(field)
    }
  }

  function markTouched(field: RegistrationField) {
    touched[field] = true
    validateField(field)
  }

  function getTodayStart(): Date {
    const today = new Date()
    return new Date(today.getFullYear(), today.getMonth(), today.getDate())
  }

  function getMinimumBirthDate(): Date {
    const today = getTodayStart()
    return new Date(today.getFullYear() - 16, today.getMonth(), today.getDate())
  }

  function getFieldError(field: RegistrationField): string | undefined {
    switch (field) {
      case 'firstName':
      case 'lastName':
        return draft[field].trim() ? undefined : t('authRegister.errors.required')
      case 'dateOfBirth':
        if (draft.dateOfBirth === null) {
          return t('authRegister.errors.required')
        }

        if (draft.dateOfBirth >= getTodayStart()) {
          return t('authRegister.errors.futureDate')
        }

        return draft.dateOfBirth > getMinimumBirthDate()
          ? t('authRegister.errors.minimumAge')
          : undefined
      case 'email':
        if (!draft.email.trim()) {
          return t('authRegister.errors.required')
        }

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())
          ? undefined
          : t('authRegister.errors.email')
      case 'password':
        if (!draft.password) {
          return t('authRegister.errors.required')
        }

        return draft.password.length >= 8 ? undefined : t('authRegister.errors.passwordLength')
      case 'confirmPassword':
        if (!draft.confirmPassword) {
          return t('authRegister.errors.required')
        }

        return draft.confirmPassword === draft.password
          ? undefined
          : t('authRegister.errors.passwordMismatch')
      case 'acceptTerms':
        return draft.acceptTerms ? undefined : t('authRegister.errors.termsRequired')
    }
  }

  function validateField(field: RegistrationField): boolean {
    const error = getFieldError(field)

    if (error) {
      fieldErrors[field] = error
      return false
    }

    delete fieldErrors[field]
    return true
  }

  function validateStep(step: RegistrationStep): boolean {
    formError.value = null

    return STEP_FIELDS[step].every((field) => {
      touched[field] = true
      return validateField(field)
    })
  }

  function goToStep(step: RegistrationStep) {
    activeStep.value = step
  }

  function prevStep() {
    if (activeStep.value === '3') {
      activeStep.value = '2'
    } else if (activeStep.value === '2') {
      activeStep.value = '1'
    }
  }

  function toApiPayload(): RegisterRequest {
    // TODO: Frontend currently requires `dateOfBirth`, but the backend OpenAPI RegisterDto
    // does not document it. Keep sending it while the frontend stays stricter, then align
    // the final register contract with the backend team before changing UX validation.
    return {
      firstName: draft.firstName.trim(),
      lastName: draft.lastName.trim(),
      email: draft.email.trim(),
      password: draft.password,
      dateOfBirth: draft.dateOfBirth ? formatDateOnly(draft.dateOfBirth) : '',
    }
  }

  function formatDateOnly(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  function applyServerErrors(fields?: Record<string, string> | null) {
    if (!fields) {
      return
    }

    const fieldMap: Partial<Record<string, RegistrationField>> = {
      firstName: 'firstName',
      lastName: 'lastName',
      dateOfBirth: 'dateOfBirth',
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

  async function submitRegistration() {
    // TODO: Double check which errors api can return
    const steps: RegistrationStep[] = ['1', '2', '3']
    const isValid = steps.every((step) => validateStep(step))

    if (!isValid) {
      const firstInvalidStep = steps.find((step) =>
        STEP_FIELDS[step].some((field) => fieldErrors[field]),
      )
      if (firstInvalidStep) {
        activeStep.value = firstInvalidStep
      }
      return false
    }

    submitting.value = true
    formError.value = null

    const submitRegister = options.submitRegister ?? register
    const result = await submitRegister(toApiPayload())

    submitting.value = false

    if (result.ok) {
      successMessage.value = result.data.message || t('authRegister.successMessageFallback')
      return true
    }

    applyServerErrors(result.error.fields)

    if (result.error.code === 'CONFLICT') {
      fieldErrors.email = t('authRegister.errors.conflict')
      touched.email = true
      activeStep.value = '2'
      return false
    }

    const firstInvalidStep = (Object.keys(STEP_FIELDS) as RegistrationStep[]).find((step) =>
      STEP_FIELDS[step].some((field) => fieldErrors[field]),
    )

    if (firstInvalidStep) {
      activeStep.value = firstInvalidStep
    }

    formError.value = result.error.message || t('authRegister.errors.generic')
    return false
  }

  return {
    draft,
    activeStep,
    canGoBack,
    fieldErrors,
    formError,
    isSuccess,
    stepItems,
    submitting,
    successMessage,
    goToStep,
    markTouched,
    prevStep,
    setDraftValue,
    submitRegistration,
    validateField,
    validateStep,
  }
}
