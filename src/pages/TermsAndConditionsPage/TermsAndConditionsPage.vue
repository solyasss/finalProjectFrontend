<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <!-- TODO: Create better terms and conditions -->
  <section class="bg-surface-0 px-5 py-10 text-color sm:px-8 lg:px-10 lg:py-14">
    <div class="mx-auto grid max-w-4xl gap-8">
      <div class="space-y-3">
        <p class="text-sm font-bold uppercase tracking-[0.18em] text-muted-color">
          {{ t('terms.eyebrow') }}
        </p>
        <h1 class="text-3xl font-bold leading-tight sm:text-4xl">
          {{ t('terms.title') }}
        </h1>
        <p class="max-w-2xl text-sm leading-6 text-muted-color md:text-base">
          {{ t('terms.description') }}
        </p>
      </div>

      <div
        class="grid gap-6 rounded-3xl border border-surface bg-surface-50 px-5 py-6 shadow-sm sm:px-8 sm:py-8"
      >
        <section class="space-y-3">
          <h2 class="text-xl font-bold leading-tight">{{ t('terms.sections.acceptanceTitle') }}</h2>
          <p class="text-sm leading-7 text-muted-color md:text-base">
            {{ t('terms.sections.acceptanceBody') }}
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-xl font-bold leading-tight">{{ t('terms.sections.usageTitle') }}</h2>
          <p class="text-sm leading-7 text-muted-color md:text-base">
            {{ t('terms.sections.usageBody') }}
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-xl font-bold leading-tight">{{ t('terms.sections.liabilityTitle') }}</h2>
          <p class="text-sm leading-7 text-muted-color md:text-base">
            {{ t('terms.sections.liabilityBody') }}
          </p>
        </section>
      </div>
    </div>
  </section>
</template>
