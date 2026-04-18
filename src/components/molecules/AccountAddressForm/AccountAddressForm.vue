<script setup lang="ts">
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
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
  addressDraft,
  fieldErrors,
  formError,
  successMessage,
  submitting,
  markTouched,
  submitProfileForm,
} = useAccountProfileForm({
  section: 'address',
  initialUser: props.user,
})

async function handleSubmit() {
  await submitProfileForm()
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <AccountInfoCard
      :title="t('accountPage.addressTitle')"
      :description="t('accountPage.addressDescription')"
      :success-message="successMessage"
      :error-message="formError"
    >
      <div class="grid gap-5 md:grid-cols-2">
        <div class="md:col-span-2">
          <label for="account-street" class="mb-2 block text-sm font-bold text-color">
            {{ t('accountPage.fields.street') }}
          </label>
          <InputText
            id="account-street"
            v-model="addressDraft.street"
            fluid
            :invalid="Boolean(fieldErrors.street)"
            @blur="markTouched('street')"
          />
          <Message v-if="fieldErrors.street" severity="error" size="small" variant="simple">
            {{ fieldErrors.street }}
          </Message>
        </div>

        <div>
          <label for="account-city" class="mb-2 block text-sm font-bold text-color">
            {{ t('accountPage.fields.city') }}
          </label>
          <InputText
            id="account-city"
            v-model="addressDraft.city"
            fluid
            :invalid="Boolean(fieldErrors.city)"
            @blur="markTouched('city')"
          />
          <Message v-if="fieldErrors.city" severity="error" size="small" variant="simple">
            {{ fieldErrors.city }}
          </Message>
        </div>

        <div>
          <label for="account-postal-code" class="mb-2 block text-sm font-bold text-color">
            {{ t('accountPage.fields.postalCode') }}
          </label>
          <InputText
            id="account-postal-code"
            v-model="addressDraft.postalCode"
            fluid
            :invalid="Boolean(fieldErrors.postalCode)"
            @blur="markTouched('postalCode')"
          />
          <Message v-if="fieldErrors.postalCode" severity="error" size="small" variant="simple">
            {{ fieldErrors.postalCode }}
          </Message>
        </div>

        <div class="md:col-span-2">
          <label for="account-region" class="mb-2 block text-sm font-bold text-color">
            {{ t('accountPage.fields.region') }}
          </label>
          <InputText
            id="account-region"
            v-model="addressDraft.region"
            fluid
            :invalid="Boolean(fieldErrors.region)"
            @blur="markTouched('region')"
          />
          <Message v-if="fieldErrors.region" severity="error" size="small" variant="simple">
            {{ fieldErrors.region }}
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
