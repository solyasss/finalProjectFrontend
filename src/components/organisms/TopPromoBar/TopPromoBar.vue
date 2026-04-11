<script setup lang="ts">
import { computed } from 'vue'
import TopPromoStripItem from '@/components/molecules/TopPromoStripItem/TopPromoStripItem.vue'

interface Props {
  items?: string[]
  href?: string
}

const props = defineProps<Props>()

const href = computed(() => props.href ?? '#')
const items = computed(() => props.items ?? ['#все_для_дому', '#швидкотазручно', '#buy now'])
const label = computed(() => `${items.value.join('   ')}   `)
</script>

<template>
  <section class="bg-primary px-3 py-2 md:px-6" aria-label="Промо рядок">
    <TopPromoStripItem :label="label" :href="href" />
  </section>
</template>
