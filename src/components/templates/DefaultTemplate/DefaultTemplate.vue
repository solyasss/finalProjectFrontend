<script setup lang="ts">
// TODO: implement DefaultTemplate template
// Full-page layout: AppHeader + AppNav at top, main content slot, AppFooter at bottom
// Used by all main shopping pages (Home, PLP, PDP, Cart, etc.)
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <AppHeader />
    <AppNav />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<script lang="ts">
import AppHeader from '@/components/organisms/AppHeader/AppHeader.vue'
import AppNav from '@/components/organisms/AppNav/AppNav.vue'
import AppFooter from '@/components/organisms/AppFooter/AppFooter.vue'
</script>
