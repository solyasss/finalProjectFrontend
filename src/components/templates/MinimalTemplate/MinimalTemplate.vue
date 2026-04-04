<script setup lang="ts">
// TODO: implement MinimalTemplate template
// Bare layout with no nav — used for login, account entry, and error pages
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <main class="flex-1">
      <slot />
    </main>
  </div>
</template>
