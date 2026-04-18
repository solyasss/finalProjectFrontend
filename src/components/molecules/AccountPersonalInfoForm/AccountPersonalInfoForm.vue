<script setup lang="ts">
import Button from 'primevue/button'
import DatePicker from 'primevue/datepicker'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { MeResponse } from '@/api'
import AccountInfoCard from '@/components/molecules/AccountInfoCard/AccountInfoCard.vue'
import { useAccountProfileForm } from '@/composables/useAccountProfileForm'

interface Props {
  user: MeResponse
}

const props = defineProps<Props>()
const { t } = useI18n()
const {
  personalDraft,
  fieldErrors,
  formError,
  successMessage,
  submitting,
  markTouched,
  submitProfileForm,
} = useAccountProfileForm({
  section: 'personalInfo',
  initialUser: props.user,
})

async function handleSubmit() {
  await submitProfileForm()
}

const dateOfBirthValue = computed<Date | null>({
  get() {
    if (!personalDraft.dateOfBirth) {
      return null
    }

    const [year, month, day] = personalDraft.dateOfBirth.split('-').map(Number)

    if (!year || !month || !day) {
      return null
    }

    return new Date(year, month - 1, day)
  },
  set(value) {
    if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
      personalDraft.dateOfBirth = ''
      return
    }

    const year = value.getFullYear()
    const month = String(value.getMonth() + 1).padStart(2, '0')
    const day = String(value.getDate()).padStart(2, '0')

    personalDraft.dateOfBirth = `${year}-${month}-${day}`
  },
})
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <AccountInfoCard
      :title="t('accountPage.personalInfoTitle')"
      :description="t('accountPage.personalInfoDescription')"
      :success-message="successMessage"
      :error-message="formError"
    >
      <div class="grid gap-5 md:grid-cols-2">
        <div>
          <label for="account-first-name" class="mb-2 block text-sm font-bold text-color">
            {{ t('accountPage.fields.firstName') }}
          </label>
          <InputText
            id="account-first-name"
            v-model="personalDraft.firstName"
            fluid
            :invalid="Boolean(fieldErrors.firstName)"
            @blur="markTouched('firstName')"
          />
          <Message v-if="fieldErrors.firstName" severity="error" size="small" variant="simple">
            {{ fieldErrors.firstName }}
          </Message>
        </div>

        <div>
          <label for="account-last-name" class="mb-2 block text-sm font-bold text-color">
            {{ t('accountPage.fields.lastName') }}
          </label>
          <InputText
            id="account-last-name"
            v-model="personalDraft.lastName"
            fluid
            :invalid="Boolean(fieldErrors.lastName)"
            @blur="markTouched('lastName')"
          />
          <Message v-if="fieldErrors.lastName" severity="error" size="small" variant="simple">
            {{ fieldErrors.lastName }}
          </Message>
        </div>

        <div class="md:col-span-2">
          <label for="account-date-of-birth" class="mb-2 block text-sm font-bold text-color">
            {{ t('accountPage.fields.dateOfBirth') }}
          </label>
          <DatePicker
            input-id="account-date-of-birth"
            v-model="dateOfBirthValue"
            showIcon
            iconDisplay="input"
            dateFormat="dd.mm.yy"
            :manual-input="false"
            :max-date="new Date()"
            :invalid="Boolean(fieldErrors.dateOfBirth)"
            @blur="markTouched('dateOfBirth')"
          />
          <Message v-if="fieldErrors.dateOfBirth" severity="error" size="small" variant="simple">
            {{ fieldErrors.dateOfBirth }}
          </Message>
        </div>
      </div>

      <template #footer>
        <Button
          type="submit"
          :loading="submitting"
          :label="submitting ? t('common.submitting') : t('accountPage.cardSave')"
        />
      </template>
    </AccountInfoCard>
  </form>
</template>
