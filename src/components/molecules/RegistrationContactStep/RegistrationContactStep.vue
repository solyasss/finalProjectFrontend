<script setup lang="ts">
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
      <label for="register-email" class="mb-2 block text-sm font-bold text-color">
        {{ t('authRegister.emailLabel') }}
      </label>
      <InputText
        id="register-email"
        v-model="draft.email"
        fluid
        type="email"
        autocomplete="email"
        :invalid="Boolean(errors.email)"
        :aria-describedby="errors.email ? 'reg-email-error' : undefined"
        :aria-invalid="Boolean(errors.email) ? 'true' : undefined"
        @blur="emit('blur-field', 'email')"
      />
      <Message
        v-if="errors.email"
        id="reg-email-error"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ errors.email }}
      </Message>
    </div>

    <Message severity="secondary" size="small" variant="simple">
      {{ t('authRegister.deferredFieldsNote') }}
    </Message>
  </div>
</template>
