<template>
  <div
    class="flex flex-col gap-3 rounded-2xl border border-surface bg-surface-0 p-5 md:flex-row md:items-end md:justify-between"
  >
    <div class="flex flex-col gap-3 md:flex-row md:items-end">
      <slot />
    </div>
    <div class="flex flex-wrap gap-2">
      <slot name="actions" />
    </div>
  </div>
</template>
