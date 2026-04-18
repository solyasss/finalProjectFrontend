<script setup lang="ts">
import Message from 'primevue/message'
import AccountInfoCard from '@/components/molecules/AccountInfoCard/AccountInfoCard.vue'

interface Props {
  title: string
  description: string
  message: string
}

defineProps<Props>()
</script>

<template>
  <AccountInfoCard :title="title" :description="description">
    <Message severity="secondary">{{ message }}</Message>
  </AccountInfoCard>
</template>
