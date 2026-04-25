import { computed, reactive, ref } from 'vue'
import { updateProfile } from '@/api'
import type { ApiResult, MeResponse, UpdateProfileRequest, UserAddress } from '@/api'
import { i18n } from '@/i18n'
import { useAuthStore } from '@/stores'

export type AccountProfileSection = 'personalInfo' | 'address'

export interface PersonalInfoDraft {
  firstName: string
  lastName: string
  dateOfBirth: string
}

export interface AddressDraft {
  street: string
  city: string
  postalCode: string
  region: string
}

export type AccountProfileField = keyof PersonalInfoDraft | keyof AddressDraft

interface AccountProfileFormOptions {
  section: AccountProfileSection
  initialUser?: MeResponse | null
  submitProfileUpdate?: (payload: UpdateProfileRequest) => Promise<ApiResult<MeResponse>>
}

function createPersonalDraft(user?: MeResponse | null): PersonalInfoDraft {
  return {
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    dateOfBirth: user?.dateOfBirth ?? '',
  }
}

function createAddressDraft(user?: MeResponse | null): AddressDraft {
  return {
    street: user?.address?.street ?? '',
    city: user?.address?.city ?? '',
    postalCode: user?.address?.postalCode ?? '',
    region: user?.address?.region ?? '',
  }
}

function isValidDateOnly(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false
  }

  const date = new Date(`${value}T00:00:00.000Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

export function useAccountProfileForm(options: AccountProfileFormOptions) {
  const t = i18n.global.t
  const authStore = useAuthStore()

  const personalDraft = reactive<PersonalInfoDraft>(createPersonalDraft(options.initialUser))
  const addressDraft = reactive<AddressDraft>(createAddressDraft(options.initialUser))
  const touched = reactive<Partial<Record<AccountProfileField, boolean>>>({})
  const fieldErrors = reactive<Partial<Record<AccountProfileField, string>>>({})
  const formError = ref<string | null>(null)
  const successMessage = ref<string | null>(null)
  const submitting = ref(false)

  const fields = computed<AccountProfileField[]>(() =>
    options.section === 'personalInfo'
      ? ['firstName', 'lastName', 'dateOfBirth']
      : ['street', 'city', 'postalCode', 'region'],
  )

  function getFieldError(field: AccountProfileField): string | undefined {
    switch (field) {
      case 'firstName':
      case 'lastName':
      case 'street':
      case 'city':
      case 'postalCode': {
        const source =
          field in personalDraft
            ? personalDraft[field as keyof PersonalInfoDraft]
            : addressDraft[field as keyof AddressDraft]

        return source.trim() ? undefined : t('accountPage.errors.required')
      }
      case 'dateOfBirth':
        // TODO: Frontend currently requires `dateOfBirth`, but the backend OpenAPI profile
        // contract does not clearly guarantee it. Keep existing validation for now and align
        // with the backend team before relaxing the field in account UX.
        if (!personalDraft.dateOfBirth.trim()) {
          return t('accountPage.errors.required')
        }

        return isValidDateOnly(personalDraft.dateOfBirth.trim())
          ? undefined
          : t('accountPage.errors.date')
      case 'region':
        return undefined
    }
  }

  function validateField(field: AccountProfileField): boolean {
    const error = getFieldError(field)

    if (error) {
      fieldErrors[field] = error
      return false
    }

    delete fieldErrors[field]
    return true
  }

  function markTouched(field: AccountProfileField) {
    touched[field] = true
    validateField(field)
  }

  function validateForm(): boolean {
    formError.value = null

    const results = fields.value.map((field) => {
      touched[field] = true
      return validateField(field)
    })

    return results.every(Boolean)
  }

  function buildPayload(): UpdateProfileRequest {
    if (options.section === 'personalInfo') {
      return {
        firstName: personalDraft.firstName.trim(),
        lastName: personalDraft.lastName.trim(),
        dateOfBirth: personalDraft.dateOfBirth.trim(),
      }
    }

    const address: UserAddress = {
      street: addressDraft.street.trim(),
      city: addressDraft.city.trim(),
      postalCode: addressDraft.postalCode.trim(),
    }

    if (addressDraft.region.trim()) {
      address.region = addressDraft.region.trim()
    }

    return { address }
  }

  function applyServerErrors(fields?: Record<string, string> | null) {
    if (!fields) {
      return
    }

    const fieldMap: Partial<Record<string, AccountProfileField>> = {
      firstName: 'firstName',
      lastName: 'lastName',
      dateOfBirth: 'dateOfBirth',
      street: 'street',
      city: 'city',
      postalCode: 'postalCode',
      region: 'region',
      'address.street': 'street',
      'address.city': 'city',
      'address.postalCode': 'postalCode',
      'address.region': 'region',
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

  function syncDrafts(user: MeResponse) {
    Object.assign(personalDraft, createPersonalDraft(user))
    Object.assign(addressDraft, createAddressDraft(user))
  }

  async function submitProfileForm() {
    if (submitting.value) {
      return false
    }

    successMessage.value = null

    if (!validateForm()) {
      return false
    }

    submitting.value = true
    formError.value = null

    const submitProfileUpdate = options.submitProfileUpdate ?? updateProfile
    const result = await submitProfileUpdate(buildPayload())

    submitting.value = false

    if (result.ok) {
      authStore.applyProfileUpdate(result.data)
      syncDrafts(result.data)
      successMessage.value =
        options.section === 'personalInfo'
          ? t('accountPage.personalInfoSuccess')
          : t('accountPage.addressSuccess')
      return true
    }

    applyServerErrors(result.error.fields)
    formError.value = result.error.message || t('accountPage.errors.generic')
    return false
  }

  return {
    personalDraft,
    addressDraft,
    fieldErrors,
    formError,
    successMessage,
    submitting,
    markTouched,
    submitProfileForm,
    validateField,
    validateForm,
  }
}
