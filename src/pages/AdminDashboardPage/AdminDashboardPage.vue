<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'
import { useI18n } from 'vue-i18n'
import { useAdminNavigation } from '@/composables/useAdminNavigation'

const { t } = useI18n()
const { items } = useAdminNavigation()

const featuredItems = computed(() =>
  items.value.filter((item) => item.availability === 'available'),
)
</script>

<template>
  <div class="grid gap-6">
    <section class="grid gap-4 rounded-3xl border border-surface bg-surface-0 p-6 shadow-sm">
      <div class="space-y-2">
        <h2 class="text-xl font-bold text-color md:text-2xl">
          {{ t('admin.dashboard.heroTitle') }}
        </h2>
        <p class="max-w-3xl text-sm leading-6 text-muted-color md:text-base">
          {{ t('admin.dashboard.heroDescription') }}
        </p>
      </div>
    </section>

    <section class="grid gap-4 md:grid-cols-3">
      <RouterLink
        v-for="item in featuredItems"
        :key="item.id"
        :to="{ name: item.routeName }"
        class="grid gap-4 rounded-2xl border border-surface bg-surface-0 p-5 no-underline shadow-sm transition-transform hover:-translate-y-1"
      >
        <div class="space-y-2">
          <h3 class="text-lg font-semibold text-color">{{ item.label }}</h3>
          <p class="text-sm leading-6 text-muted-color">{{ item.description }}</p>
        </div>

        <div>
          <Button
            :label="t('admin.dashboard.openSection')"
            icon="pi pi-arrow-right"
            icon-pos="right"
          />
        </div>
      </RouterLink>
    </section>
  </div>
</template>
