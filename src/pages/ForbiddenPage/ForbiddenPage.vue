<script setup lang="ts">
import Button from 'primevue/button'
import Message from 'primevue/message'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import DefaultTemplate from '@/components/templates/DefaultTemplate/DefaultTemplate.vue'

const { t } = useI18n()
const route = useRoute()

const deniedFrom = typeof route.query.from === 'string' ? route.query.from : null
</script>

<template>
  <DefaultTemplate>
    <section class="mx-auto grid max-w-3xl gap-6 px-4 py-10 md:px-6 md:py-16">
      <header class="space-y-3">
        <p class="text-sm font-bold uppercase tracking-[0.16em] text-muted-color">
          {{ t('forbiddenPage.eyebrow') }}
        </p>
        <div class="space-y-2">
          <h1 class="text-3xl font-bold text-color md:text-4xl">
            {{ t('forbiddenPage.title') }}
          </h1>
          <p class="max-w-2xl text-sm leading-6 text-muted-color md:text-base">
            {{ t('forbiddenPage.description') }}
          </p>
        </div>
      </header>

      <Message severity="warn">
        {{
          deniedFrom
            ? t('forbiddenPage.deniedFrom', { path: deniedFrom })
            : t('forbiddenPage.generic')
        }}
      </Message>

      <div class="grid gap-4 rounded-2xl border border-surface bg-surface-0 p-6 shadow-sm">
        <p class="text-sm leading-6 text-muted-color">
          {{ t('forbiddenPage.nextSteps') }}
        </p>

        <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <RouterLink class="no-underline" :to="{ name: 'home' }">
            <Button :label="t('forbiddenPage.homeCta')" />
          </RouterLink>

          <RouterLink class="no-underline" :to="{ name: 'account' }">
            <Button outlined severity="secondary" :label="t('forbiddenPage.accountCta')" />
          </RouterLink>
        </div>
      </div>
    </section>
  </DefaultTemplate>
</template>
