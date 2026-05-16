<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AuthVisualPanel from '@/components/organisms/AuthVisualPanel/AuthVisualPanel.vue'
import RegistrationStepperForm from '@/components/organisms/RegistrationStepperForm/RegistrationStepperForm.vue'
import AuthSplitTemplate from '@/components/templates/AuthSplitTemplate/AuthSplitTemplate.vue'

const { t } = useI18n()
// TODO: Replace with a more relevant image
</script>

<template>
  <AuthSplitTemplate>
    <template #visual>
      <AuthVisualPanel
        :eyebrow="t('authRegister.eyebrow')"
        :title="t('authRegister.visualTitle')"
        :description="t('authRegister.visualDescription')"
        :image-src="'/Auth.jpg'"
      />
    </template>

    <RegistrationStepperForm />
  </AuthSplitTemplate>
</template>
