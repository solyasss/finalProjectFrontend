<script setup lang="ts">
import Message from 'primevue/message'
import { useI18n } from 'vue-i18n'
import AccountDeferredPanel from '@/components/molecules/AccountDeferredPanel/AccountDeferredPanel.vue'
import AccountDetailsPanel from '@/components/organisms/AccountDetailsPanel/AccountDetailsPanel.vue'
import AccountShell from '@/components/organisms/AccountShell/AccountShell.vue'
import DefaultTemplate from '@/components/templates/DefaultTemplate/DefaultTemplate.vue'
import { useAccountSections } from '@/composables/useAccountSections'
import { useAuthStore } from '@/stores'

const { t } = useI18n()
const authStore = useAuthStore()
const { items, activeNavItemId, activeSection, handleItemSelect } = useAccountSections()
</script>

<template>
  <DefaultTemplate>
    <AccountShell
      :eyebrow="t('accountPage.eyebrow')"
      :title="t('accountPage.title')"
      :description="t('accountPage.description')"
      :items="items"
      :active-item-id="activeNavItemId"
      @select="handleItemSelect"
    >
      <Message v-if="!authStore.user" severity="secondary" variant="simple">
        {{ t('accountPage.emptyState') }}
      </Message>

      <AccountDetailsPanel v-else-if="activeSection === 'accountDetails'" :user="authStore.user" />

      <AccountDeferredPanel
        v-else
        :title="t('accountPage.dataPrivacy.title')"
        :description="t('accountPage.dataPrivacy.description')"
        :message="t('accountPage.dataPrivacy.message')"
      />
    </AccountShell>
  </DefaultTemplate>
</template>
