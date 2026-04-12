<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import TopPromoStripItem from '@/components/molecules/TopPromoStripItem/TopPromoStripItem.vue'

interface Props {
  items?: string[]
  href?: string
}

const props = defineProps<Props>()
const { t } = useI18n()

const href = computed(() => props.href ?? '#')
const items = computed(
  () => props.items ?? [t('topPromoBar.item1'), t('topPromoBar.item2'), t('topPromoBar.item3')],
)
const label = computed(() => `${items.value.join('   ')}   `)
</script>

<template>
  <section class="bg-primary px-3 py-2 md:px-6" :aria-label="t('topPromoBar.ariaLabel')">
    <TopPromoStripItem :label="label" :href="href" />
  </section>
</template>
