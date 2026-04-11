<script setup lang="ts">
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import Password from 'primevue/password'
import { useI18n } from 'vue-i18n'
import { useLoginForm, type LoginDraft, type LoginField } from '@/composables/useLoginForm'
import type { ApiResult, LoginRequest, LoginResponse } from '@/api'

interface Props {
  initialDraft?: Partial<LoginDraft>
  submitSignIn?: (payload: LoginRequest) => Promise<ApiResult<LoginResponse>>
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (event: 'success'): void
}>()

const { t } = useI18n()

const { draft, fieldErrors, formError, submitting, markTouched, submitLogin } = useLoginForm({
  initialDraft: props.initialDraft,
  submitSignIn: props.submitSignIn,
})

function handleBlur(field: LoginField) {
  markTouched(field)
}

async function handleSubmit() {
  const success = await submitLogin()

  if (success) {
    emit('success')
  }
}
</script>

<template>
  <div
    class="overflow-hidden h-full border border-surface bg-surface-0 shadow-2xl md:h-fit md:rounded-4xl"
  >
    <form class="grid gap-6 px-5 py-6 sm:px-8 sm:py-8" @submit.prevent="handleSubmit">
      <div class="space-y-3">
        <p class="text-sm font-bold uppercase tracking-[0.18em] text-muted-color">
          {{ t('authLogin.eyebrow') }}
        </p>
        <h1 class="text-3xl font-bold leading-tight text-color">
          {{ t('authLogin.pageTitle') }}
        </h1>
        <p class="max-w-xl text-sm leading-6 text-muted-color md:text-base">
          {{ t('authLogin.pageDescription') }}
        </p>
      </div>

      <Message v-if="formError" severity="error">{{ formError }}</Message>

      <div class="grid gap-5">
        <div>
          <label for="login-email" class="mb-2 block text-sm font-bold text-color">
            {{ t('authLogin.emailLabel') }}
          </label>
          <InputText
            id="login-email"
            v-model="draft.email"
            fluid
            type="email"
            autocomplete="email"
            :invalid="Boolean(fieldErrors.email)"
            @blur="handleBlur('email')"
          />
          <Message v-if="fieldErrors.email" severity="error" size="small" variant="simple">
            {{ fieldErrors.email }}
          </Message>
        </div>

        <div>
          <label for="login-password" class="mb-2 block text-sm font-bold text-color">
            {{ t('authLogin.passwordLabel') }}
          </label>
          <Password
            input-id="login-password"
            v-model="draft.password"
            fluid
            toggleMask
            :feedback="false"
            autocomplete="current-password"
            :invalid="Boolean(fieldErrors.password)"
            @blur="handleBlur('password')"
          />
          <Message v-if="fieldErrors.password" severity="error" size="small" variant="simple">
            {{ fieldErrors.password }}
          </Message>
        </div>
      </div>

      <Button
        type="submit"
        fluid
        :loading="submitting"
        :label="submitting ? t('authLogin.submittingLabel') : t('authLogin.submitLabel')"
      />

      <div
        class="flex flex-wrap items-center justify-center gap-2 text-sm leading-6 text-muted-color sm:justify-start"
      >
        <span>{{ t('authLogin.noAccountPrompt') }}</span>
        <RouterLink to="/register" class="font-bold text-primary no-underline">
          {{ t('authLogin.registerLinkLabel') }}
        </RouterLink>
      </div>
    </form>
  </div>
</template>
