<script setup lang="ts">
import Button from 'primevue/button'
import Message from 'primevue/message'
import Step from 'primevue/step'
import StepList from 'primevue/steplist'
import StepPanel from 'primevue/steppanel'
import StepPanels from 'primevue/steppanels'
import Stepper from 'primevue/stepper'
import { useI18n } from 'vue-i18n'
import RegistrationContactStep from '@/components/molecules/RegistrationContactStep/RegistrationContactStep.vue'
import RegistrationPersonalStep from '@/components/molecules/RegistrationPersonalStep/RegistrationPersonalStep.vue'
import RegistrationSecurityStep from '@/components/molecules/RegistrationSecurityStep/RegistrationSecurityStep.vue'
import {
  useRegistrationForm,
  type RegistrationDraft,
  type RegistrationField,
  type RegistrationStep,
} from '@/composables/useRegistrationForm'
import type { ApiResult, MessageResponse, RegisterRequest } from '@/api'

interface Props {
  initialStep?: RegistrationStep
  initialDraft?: Partial<RegistrationDraft>
  submitRegister?: (payload: RegisterRequest) => Promise<ApiResult<MessageResponse>>
}

const props = defineProps<Props>()

const { t } = useI18n()

const {
  draft,
  activeStep,
  canGoBack,
  fieldErrors,
  formError,
  isSuccess,
  stepItems,
  submitting,
  successMessage,
  markTouched,
  prevStep,
  submitRegistration,
  validateStep,
} = useRegistrationForm({
  initialDraft: props.initialDraft,
  initialStep: props.initialStep,
  submitRegister: props.submitRegister,
})

function getStepMeta(step: RegistrationStep) {
  switch (step) {
    case '1':
      return {
        title: t('authRegister.personalTitle'),
        description: t('authRegister.personalDescription'),
      }
    case '2':
      return {
        title: t('authRegister.contactTitle'),
        description: t('authRegister.contactDescription'),
      }
    case '3':
      return {
        title: t('authRegister.securityTitle'),
        description: t('authRegister.securityDescription'),
      }
  }
}

function handleBlur(field: RegistrationField) {
  markTouched(field)
}

function handleNextStep(nextStep: RegistrationStep, activateCallback: (value: string) => void) {
  if (!validateStep(activeStep.value)) {
    return
  }

  activateCallback(nextStep)
}

function handlePrevStep(previousStep: RegistrationStep, activateCallback: (value: string) => void) {
  prevStep()
  activateCallback(previousStep)
}
</script>

<template>
  <div
    class="overflow-hidden h-full md:rounded-4xl border border-surface bg-surface-0 shadow-2xl"
  >
    <div v-if="isSuccess" class="grid gap-5 px-5 py-6 sm:px-8 sm:py-8">
      <div class="space-y-3">
        <p class="text-sm font-bold uppercase tracking-[0.18em] text-muted-color">
          {{ t('authRegister.eyebrow') }}
        </p>
        <h2 class="text-3xl font-bold leading-tight text-color">
          {{ t('authRegister.successTitle') }}
        </h2>
        <p class="max-w-xl text-sm leading-6 text-muted-color md:text-base">
          {{ t('authRegister.successDescription') }}
        </p>
      </div>

      <Message severity="success">{{ successMessage }}</Message>

      <RouterLink
        to="/"
        class="inline-flex w-fit items-center text-sm font-bold text-primary no-underline"
      >
        {{ t('common.home') }}
      </RouterLink>
    </div>

    <div v-else class="grid gap-6 px-5 py-6 sm:px-8 sm:py-8">
      <div class="space-y-3">
        <p class="text-sm font-bold uppercase tracking-[0.18em] text-muted-color">
          {{ t('authRegister.eyebrow') }}
        </p>
        <h2 class="text-3xl font-bold leading-tight text-color">
          {{ t('authRegister.pageTitle') }}
        </h2>
        <p class="max-w-xl text-sm leading-6 text-muted-color md:text-base">
          {{ t('authRegister.pageDescription') }}
        </p>
      </div>

      <Message v-if="formError" severity="error">{{ formError }}</Message>

      <Stepper v-model:value="activeStep" linear class="registration-stepper">
        <StepList>
          <Step v-for="step in stepItems" :key="step.value" :value="step.value">
            {{ step.label }}
          </Step>
        </StepList>

        <StepPanels>
          <StepPanel
            v-for="step in stepItems"
            :key="step.value"
            :value="step.value"
            v-slot="{ activateCallback }"
          >
            <div class="space-y-6 pt-6">
              <div class="space-y-2">
                <h3 class="text-2xl font-bold leading-tight text-color">
                  {{ getStepMeta(step.value).title }}
                </h3>
                <p class="text-sm leading-6 text-muted-color">
                  {{ getStepMeta(step.value).description }}
                </p>
              </div>

              <RegistrationPersonalStep
                v-if="step.value === '1'"
                v-model:draft="draft"
                :errors="fieldErrors"
                @blur-field="handleBlur"
              />

              <RegistrationContactStep
                v-else-if="step.value === '2'"
                v-model:draft="draft"
                :errors="fieldErrors"
                @blur-field="handleBlur"
              />

              <RegistrationSecurityStep
                v-else
                v-model:draft="draft"
                :errors="fieldErrors"
                :submitting="submitting"
                @blur-field="handleBlur"
                @submit="submitRegistration"
              />

              <div
                class="flex flex-col gap-3 border-t border-surface pt-5 sm:flex-row sm:justify-between"
              >
                <Button
                  type="button"
                  text
                  severity="secondary"
                  :disabled="!canGoBack"
                  :label="t('common.back')"
                  @click="handlePrevStep(step.value === '3' ? '2' : '1', activateCallback)"
                />

                <Button
                  v-if="step.value !== '3'"
                  type="button"
                  :label="t('common.continue')"
                  @click="handleNextStep(step.value === '1' ? '2' : '3', activateCallback)"
                />
              </div>
            </div>
          </StepPanel>
        </StepPanels>
      </Stepper>
    </div>
  </div>
</template>
