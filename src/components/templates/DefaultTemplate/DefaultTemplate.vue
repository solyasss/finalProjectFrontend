<script setup lang="ts">
import AppHeader from '@/components/organisms/AppHeader/AppHeader.vue'
import AppFooter from '@/components/organisms/AppFooter/AppFooter.vue'
import SkipLink from '@/components/atoms/SkipLink/SkipLink.vue'
</script>

<template>
  <div class="flex min-h-screen w-full flex-col">
    <SkipLink target-id="main-content" />
    <AppHeader />
    <main id="main-content" class="flex-1" tabindex="-1">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
