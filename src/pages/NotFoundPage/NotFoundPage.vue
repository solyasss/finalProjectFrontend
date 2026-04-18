<script setup lang="ts">
import Button from 'primevue/button'
import { useI18n } from 'vue-i18n'
import DefaultTemplate from '@/components/templates/DefaultTemplate/DefaultTemplate.vue'

const { t } = useI18n()
</script>

<template>
  <DefaultTemplate>
    <section class="bg-surface-0 px-4 py-12 md:px-6 md:py-16">
      <div class="mx-auto grid max-w-[1440px] place-items-center">
        <div
          class="grid max-w-2xl gap-6 rounded-3xl border border-surface bg-surface-50 px-6 py-10 text-center shadow-sm sm:px-10 sm:py-14"
        >
          <p class="text-sm font-bold uppercase tracking-[0.18em] text-muted-color">
            {{ t('notFound.eyebrow') }}
          </p>
          <div class="space-y-3">
            <h1 class="text-4xl font-bold leading-tight text-color sm:text-5xl">404</h1>
            <h2 class="text-2xl font-bold leading-tight text-color sm:text-3xl">
              {{ t('notFound.title') }}
            </h2>
            <p class="text-sm leading-7 text-muted-color md:text-base">
              {{ t('notFound.description') }}
            </p>
          </div>

          <div class="flex justify-center">
            <RouterLink to="/" class="no-underline">
              <Button :label="t('notFound.primaryAction')" />
            </RouterLink>
          </div>
        </div>
      </div>
    </section>
  </DefaultTemplate>
</template>
