<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AccountInfoCard from '@/components/molecules/AccountInfoCard/AccountInfoCard.vue'

interface Props {
  email: string
}

defineProps<Props>()

const { t } = useI18n()
</script>

<template>
  <AccountInfoCard
    :title="t('accountPage.emailTitle')"
    :description="t('accountPage.emailDescription')"
  >
    <!-- TODO: replace readonly email display with edit flow when backend email-update endpoint exists. -->
    <div class="grid gap-3">
      <div class="rounded-lg border border-surface bg-surface-100 px-4 py-3 text-sm text-color">
        {{ email }}
      </div>
    </div>
  </AccountInfoCard>
</template>
