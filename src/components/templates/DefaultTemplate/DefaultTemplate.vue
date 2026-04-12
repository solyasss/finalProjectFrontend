<script setup lang="ts">
import AppHeader from '@/components/organisms/AppHeader/AppHeader.vue'
import AppFooter from '@/components/organisms/AppFooter/AppFooter.vue'
</script>

<template>
  <div class="flex min-h-screen w-full flex-col">
    <AppHeader />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
