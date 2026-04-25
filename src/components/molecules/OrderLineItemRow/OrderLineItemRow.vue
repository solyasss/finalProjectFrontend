<script setup lang="ts">
import Image from 'primevue/image'
import { useI18n } from 'vue-i18n'
import type { CartLine } from '@/api'

interface Props {
  line: CartLine
}

defineProps<Props>()

const { t } = useI18n()
</script>

<template>
  <article
    class="grid gap-4 rounded-lg border border-surface bg-surface-0 p-4 sm:grid-cols-[5rem_minmax(0,1fr)]"
  >
    <div class="overflow-hidden rounded-lg bg-surface-100">
      <Image
        :src="line.image?.url"
        :alt="line.image?.alt ?? line.name"
        :pt="{
          root: { style: { display: 'block', width: '100%', height: '100%' } },
          image: {
            style: {
              display: 'block',
              width: '100%',
              height: '5rem',
              objectFit: 'cover',
            },
          },
        }"
      />
    </div>

    <div class="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
      <div class="space-y-2">
        <h3 class="text-sm font-bold leading-6 text-color sm:text-base">
          {{ line.name }}
        </h3>
        <p class="text-sm text-muted-color">
          {{ t('orderDetailPage.quantityValue', { quantity: line.quantity }) }}
        </p>
      </div>

      <dl class="grid gap-2 text-sm sm:text-right">
        <div>
          <dt class="text-muted-color">{{ t('orderDetailPage.unitPrice') }}</dt>
          <dd class="font-medium text-color">{{ line.unitPrice.formatted }}</dd>
        </div>
        <div>
          <dt class="text-muted-color">{{ t('orderDetailPage.lineTotal') }}</dt>
          <dd class="font-bold text-color">{{ line.lineTotal.formatted }}</dd>
        </div>
      </dl>
    </div>
  </article>
</template>
