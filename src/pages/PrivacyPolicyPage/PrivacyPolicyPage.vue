<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import BackButton from '@/components/atoms/BackButton/BackButton.vue'
import DefaultTemplate from '@/components/templates/DefaultTemplate/DefaultTemplate.vue'

const { t } = useI18n()

const backToHomeRoute = { name: 'home' } as const
</script>

<template>
  <DefaultTemplate>
    <section class="bg-surface-0 px-5 py-10 text-color sm:px-8 lg:px-10 lg:py-14">
      <div class="mx-auto grid max-w-4xl gap-8">
        <div class="flex justify-start">
          <BackButton :label="t('common.back')" :to="backToHomeRoute" variant="link" />
        </div>

        <div class="space-y-3">
          <p class="text-sm font-bold uppercase tracking-[0.18em] text-muted-color">
            {{ t('privacyPolicyPage.eyebrow') }}
          </p>
          <h1 class="text-3xl font-bold leading-tight sm:text-4xl">
            {{ t('privacyPolicyPage.title') }}
          </h1>
          <p class="max-w-2xl text-sm leading-6 text-muted-color md:text-base">
            {{ t('privacyPolicyPage.description') }}
          </p>
        </div>

        <div
          class="grid gap-6 rounded-3xl border border-surface bg-surface-50 px-5 py-6 shadow-sm sm:px-8 sm:py-8"
        >
          <section class="space-y-3">
            <h2 class="text-xl font-bold leading-tight">
              {{ t('privacyPolicyPage.sections.collectionTitle') }}
            </h2>
            <p class="text-sm leading-7 text-muted-color md:text-base">
              {{ t('privacyPolicyPage.sections.collectionBody') }}
            </p>
          </section>

          <section class="space-y-3">
            <h2 class="text-xl font-bold leading-tight">
              {{ t('privacyPolicyPage.sections.usageTitle') }}
            </h2>
            <p class="text-sm leading-7 text-muted-color md:text-base">
              {{ t('privacyPolicyPage.sections.usageBody') }}
            </p>
          </section>

          <section class="space-y-3">
            <h2 class="text-xl font-bold leading-tight">
              {{ t('privacyPolicyPage.sections.controlTitle') }}
            </h2>
            <p class="text-sm leading-7 text-muted-color md:text-base">
              {{ t('privacyPolicyPage.sections.controlBody') }}
            </p>
          </section>
        </div>
      </div>
    </section>
  </DefaultTemplate>
</template>
