<script setup lang="ts">
import type { MeResponse } from '@/api'
import AccountAddressForm from '@/components/molecules/AccountAddressForm/AccountAddressForm.vue'
import AccountEmailCard from '@/components/molecules/AccountEmailCard/AccountEmailCard.vue'
import AccountPasswordForm from '@/components/molecules/AccountPasswordForm/AccountPasswordForm.vue'
import AccountPersonalInfoForm from '@/components/molecules/AccountPersonalInfoForm/AccountPersonalInfoForm.vue'
import AccountLogoutCard from '@/components/molecules/AccountLogoutCard/AccountLogoutCard.vue'
import DeleteAccountCard from '@/components/molecules/DeleteAccountCard/DeleteAccountCard.vue'

interface Props {
  user: MeResponse
}

defineProps<Props>()
</script>

<template>
  <div class="grid gap-5">
    <AccountPersonalInfoForm :user="user" />
    <AccountEmailCard :email="user.email" />
    <AccountAddressForm :user="user" />
    <AccountPasswordForm />
    <AccountLogoutCard />
    <DeleteAccountCard />
  </div>
</template>
