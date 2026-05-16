<script setup lang="ts">
interface MetaItem {
  label: string
  value: string | number | null | undefined
}

interface Props {
  items?: MetaItem[]
  columns?: 2 | 3 | 4
}

const props = withDefaults(defineProps<Props>(), {
  columns: 3,
})

const gridColsClass: Record<number, string> = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
}
</script>

<template>
  <dl class="grid gap-3 text-sm" :class="gridColsClass[columns]">
    <template v-if="items">
      <div v-for="item in items" :key="item.label">
        <dt class="font-medium text-color">{{ item.label }}</dt>
        <dd class="text-muted-color">{{ item.value ?? '—' }}</dd>
      </div>
    </template>
    <slot v-else />
  </dl>
</template>
