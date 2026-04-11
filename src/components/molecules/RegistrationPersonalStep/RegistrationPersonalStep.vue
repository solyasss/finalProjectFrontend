<script setup lang="ts">
import DatePicker from 'primevue/datepicker'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import { useI18n } from 'vue-i18n'
import type { RegistrationDraft, RegistrationField } from '@/composables/useRegistrationForm'

interface Props {
  errors: Partial<Record<RegistrationField, string>>
}

defineProps<Props>()

const draft = defineModel<RegistrationDraft>('draft', { required: true })

const emit = defineEmits<{
  (event: 'blur-field', field: RegistrationField): void
}>()

const { t } = useI18n()
</script>

<template>
  <div class="grid gap-5">
    <div>
      <label for="register-first-name" class="mb-2 block text-sm font-bold text-color">
        {{ t('authRegister.firstNameLabel') }}
      </label>
      <InputText
        id="register-first-name"
        v-model="draft.firstName"
        fluid
        :invalid="Boolean(errors.firstName)"
        @blur="emit('blur-field', 'firstName')"
      />
      <Message v-if="errors.firstName" severity="error" size="small" variant="simple">
        {{ errors.firstName }}
      </Message>
    </div>

    <div>
      <label for="register-last-name" class="mb-2 block text-sm font-bold text-color">
        {{ t('authRegister.lastNameLabel') }}
      </label>
      <InputText
        id="register-last-name"
        v-model="draft.lastName"
        fluid
        :invalid="Boolean(errors.lastName)"
        @blur="emit('blur-field', 'lastName')"
      />
      <Message v-if="errors.lastName" severity="error" size="small" variant="simple">
        {{ errors.lastName }}
      </Message>
    </div>

    <div>
      <label for="register-date-of-birth" class="mb-2 block text-sm font-bold text-color">
        {{ t('authRegister.dateOfBirthLabel') }}
      </label>
      <DatePicker
        input-id="register-date-of-birth"
        v-model="draft.dateOfBirth"
        fluid
        showIcon
        iconDisplay="input"
        dateFormat="dd.mm.yy"
        :manual-input="false"
        :max-date="new Date()"
        :invalid="Boolean(errors.dateOfBirth)"
        @blur="emit('blur-field', 'dateOfBirth')"
      />
      <Message v-if="errors.dateOfBirth" severity="error" size="small" variant="simple">
        {{ errors.dateOfBirth }}
      </Message>
    </div>

    <div class="flex justify-center pt-2 sm:justify-start">
      <RouterLink to="/login" class="text-sm font-bold text-primary no-underline">
        {{ t('authRegister.alreadyUserLinkLabel') }}
      </RouterLink>
    </div>
  </div>
</template>
