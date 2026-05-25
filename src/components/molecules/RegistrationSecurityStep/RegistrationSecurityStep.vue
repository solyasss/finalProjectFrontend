<script setup lang="ts">
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import Message from 'primevue/message'
import Password from 'primevue/password'
import { useI18n } from 'vue-i18n'
import type { RegistrationDraft, RegistrationField } from '@/composables/useRegistrationForm'

interface Props {
  errors: Partial<Record<RegistrationField, string>>
  submitting?: boolean
}

defineProps<Props>()

const draft = defineModel<RegistrationDraft>('draft', { required: true })

const emit = defineEmits<{
  (event: 'blur-field', field: RegistrationField): void
  (event: 'submit'): void
}>()

const { t } = useI18n()
</script>

<template>
  <div class="grid gap-5">
    <div>
      <label for="register-password" class="mb-2 block text-sm font-bold text-color">
        {{ t('authRegister.passwordLabel') }}
      </label>
      <Password
        input-id="register-password"
        v-model="draft.password"
        fluid
        toggleMask
        :feedback="false"
        :invalid="Boolean(errors.password)"
        autocomplete="new-password"
        :aria-describedby="errors.password ? 'reg-password-error' : undefined"
        :aria-invalid="Boolean(errors.password) ? 'true' : undefined"
        @blur="emit('blur-field', 'password')"
      />
      <Message
        v-if="errors.password"
        id="reg-password-error"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ errors.password }}
      </Message>
    </div>

    <div>
      <label for="register-confirm-password" class="mb-2 block text-sm font-bold text-color">
        {{ t('authRegister.confirmPasswordLabel') }}
      </label>
      <Password
        input-id="register-confirm-password"
        v-model="draft.confirmPassword"
        fluid
        toggleMask
        :feedback="false"
        :invalid="Boolean(errors.confirmPassword)"
        autocomplete="new-password"
        :aria-describedby="errors.confirmPassword ? 'reg-confirm-password-error' : undefined"
        :aria-invalid="Boolean(errors.confirmPassword) ? 'true' : undefined"
        @blur="emit('blur-field', 'confirmPassword')"
      />
      <Message
        v-if="errors.confirmPassword"
        id="reg-confirm-password-error"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ errors.confirmPassword }}
      </Message>
    </div>

    <div class="space-y-2 rounded-2xl border border-surface bg-surface-50 px-4 py-4">
      <div class="flex items-start gap-3">
        <Checkbox
          input-id="register-terms"
          v-model="draft.acceptTerms"
          binary
          :invalid="Boolean(errors.acceptTerms)"
          :aria-describedby="errors.acceptTerms ? 'reg-terms-error' : undefined"
          :aria-invalid="Boolean(errors.acceptTerms) ? 'true' : undefined"
          @blur="emit('blur-field', 'acceptTerms')"
        />
        <label for="register-terms" class="cursor-pointer text-sm leading-6 text-color">
          {{ t('authRegister.termsLabel') }}
        </label>
      </div>
      <p class="text-sm leading-6 text-muted-color">
        {{ t('authRegister.termsHint') }}
        <RouterLink
          to="/terms-and-conditions"
          target="_blank"
          rel="noopener noreferrer"
          class="ml-1 font-bold text-primary no-underline"
        >
          {{ t('authRegister.termsLinkLabel') }}
        </RouterLink>
      </p>
      <Message
        v-if="errors.acceptTerms"
        id="reg-terms-error"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ errors.acceptTerms }}
      </Message>
    </div>

    <Button
      type="button"
      fluid
      :loading="submitting"
      :label="submitting ? t('common.submitting') : t('common.createAccount')"
      @click="emit('submit')"
    />
  </div>
</template>
