<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import { useI18n } from 'vue-i18n'
import type { FilterDefinition } from '@/api'
import FilterChip from '@/components/molecules/FilterChip/FilterChip.vue'
import type {
  ProductDiscoveryFilterChip,
  ProductDiscoveryRangeDraft,
  ProductDiscoverySelectedFilters,
} from '@/composables/useProductDiscoveryListing'

interface Props {
  filters: FilterDefinition[]
  selectedFilters: ProductDiscoverySelectedFilters
  activeChips: ProductDiscoveryFilterChip[]
  resultCount: number
  loading?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (event: 'apply-filters', value: ProductDiscoverySelectedFilters): void
}>()

const { t } = useI18n()
const rangeDrafts = ref<Record<string, ProductDiscoveryRangeDraft>>({})
const draftFilters = ref<ProductDiscoverySelectedFilters>({})

watch(
  [() => props.selectedFilters, () => props.filters],
  ([selectedFilters]) => {
    draftFilters.value = cloneSelectedFilters(selectedFilters)
    rangeDrafts.value = {}

    for (const filter of props.filters) {
      if (filter.type !== 'RANGE') {
        continue
      }

      const selectedValue = selectedFilters[filter.key]
      const [min = '', max = ''] = typeof selectedValue === 'string' ? selectedValue.split('-') : []

      rangeDrafts.value[filter.key] = { min, max }
    }
  },
  { immediate: true, deep: true },
)

const draftChips = computed(() => buildDraftChips(props.filters, draftFilters.value))

function isOptionSelected(key: string, value: string) {
  const selectedValue = draftFilters.value[key]
  return Array.isArray(selectedValue) ? selectedValue.includes(value) : false
}

function isBooleanSelected(key: string) {
  return draftFilters.value[key] === true
}

function getRangeDraft(key: string): ProductDiscoveryRangeDraft {
  if (!rangeDrafts.value[key]) {
    rangeDrafts.value[key] = { min: '', max: '' }
  }

  return rangeDrafts.value[key]
}

function getRangeSummary(key: string) {
  const selectedValue = draftFilters.value[key]
  return typeof selectedValue === 'string'
    ? t('listingControls.rangeSummary', { value: selectedValue })
    : t('listingControls.rangeEmpty')
}

function toggleOption(key: string, value: string) {
  const currentValues = Array.isArray(draftFilters.value[key]) ? [...draftFilters.value[key]] : []
  const valueIndex = currentValues.indexOf(value)

  if (valueIndex >= 0) {
    currentValues.splice(valueIndex, 1)
  } else {
    currentValues.push(value)
  }

  if (currentValues.length) {
    draftFilters.value[key] = currentValues
    return
  }

  delete draftFilters.value[key]
}

function setBoolean(key: string, enabled: boolean) {
  if (enabled) {
    draftFilters.value[key] = true
    return
  }

  delete draftFilters.value[key]
}

function syncRangeDraft(key: string) {
  const draft = getRangeDraft(key)

  if (!draft.min || !draft.max) {
    delete draftFilters.value[key]
    return
  }

  draftFilters.value[key] = `${draft.min}-${draft.max}`
}

function handleRemoveChip(chip: ProductDiscoveryFilterChip) {
  if (chip.value) {
    toggleOption(chip.key, chip.value)
    return
  }

  delete draftFilters.value[chip.key]

  if (rangeDrafts.value[chip.key]) {
    rangeDrafts.value[chip.key] = { min: '', max: '' }
  }
}

function clearAllDraftFilters() {
  draftFilters.value = {}
  rangeDrafts.value = Object.fromEntries(
    props.filters
      .filter((filter) => filter.type === 'RANGE')
      .map((filter) => [filter.key, { min: '', max: '' }]),
  )
}

function applyFilters() {
  for (const filter of props.filters) {
    if (filter.type === 'RANGE') {
      syncRangeDraft(filter.key)
    }
  }

  emit('apply-filters', cloneSelectedFilters(draftFilters.value))
}

function cloneSelectedFilters(
  filters: ProductDiscoverySelectedFilters,
): ProductDiscoverySelectedFilters {
  return Object.fromEntries(
    Object.entries(filters).map(([key, value]) => [key, Array.isArray(value) ? [...value] : value]),
  )
}

function buildDraftChips(
  filters: FilterDefinition[],
  selectedFilters: ProductDiscoverySelectedFilters,
): ProductDiscoveryFilterChip[] {
  return filters.flatMap((filter) => {
    const selectedValue = selectedFilters[filter.key]

    if (!selectedValue) {
      return []
    }

    if (filter.type === 'MULTI_SELECT' && Array.isArray(selectedValue)) {
      return selectedValue.map((value) => ({
        key: filter.key,
        label: filter.label,
        value,
        displayLabel: filter.options?.find((option) => option.value === value)?.label ?? value,
      }))
    }

    if (filter.type === 'BOOLEAN') {
      return [{ key: filter.key, label: filter.label, displayLabel: filter.label }]
    }

    if (filter.type === 'RANGE' && typeof selectedValue === 'string') {
      return [{ key: filter.key, label: filter.label, displayLabel: selectedValue }]
    }

    return []
  })
}
</script>

<template>
  <section
    class="grid max-h-[calc(100vh-8rem)] gap-4 overflow-hidden rounded-3xl border border-surface bg-surface-0 p-4 md:p-5"
  >
    <header class="grid gap-3">
      <div class="space-y-1">
        <h2 class="text-base font-bold text-color">
          {{ t('listingControls.filtersTitle') }}
        </h2>
        <p class="text-sm text-muted-color">
          {{ t('listingControls.resultCount', { count: props.resultCount }) }}
        </p>
      </div>

      <div class="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="text"
          size="small"
          :label="t('listingControls.clearAll')"
          :disabled="props.loading"
          @click="clearAllDraftFilters"
        />
        <Button
          type="button"
          size="small"
          :label="t('listingControls.applyFilters')"
          :disabled="props.loading"
          @click="applyFilters"
        />
      </div>
    </header>

    <div v-if="draftChips.length" class="flex flex-wrap gap-2">
      <FilterChip
        v-for="chip in draftChips"
        :key="`${chip.key}-${chip.value ?? chip.displayLabel}`"
        :label="`${chip.label}: ${chip.displayLabel}`"
        :disabled="props.loading"
        @remove="handleRemoveChip(chip)"
      />
    </div>

    <p v-else class="text-sm text-muted-color">
      {{ t('listingControls.noActiveFilters') }}
    </p>

    <div class="grid gap-4 overflow-y-auto pr-1">
      <section
        v-for="filter in props.filters"
        :key="filter.key"
        class="grid gap-3 rounded-2xl border border-surface bg-surface-0 p-4"
      >
        <header class="space-y-1">
          <h3 class="text-sm font-semibold text-color">
            {{ filter.label }}
          </h3>
          <p v-if="filter.type === 'RANGE'" class="text-sm text-muted-color">
            {{ getRangeSummary(filter.key) }}
          </p>
        </header>

        <div v-if="filter.type === 'MULTI_SELECT'" class="grid gap-3">
          <label
            v-for="option in filter.options ?? []"
            :key="option.value"
            class="flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl border border-surface px-3 py-2 text-sm text-color"
          >
            <Checkbox
              binary
              :model-value="isOptionSelected(filter.key, option.value)"
              :disabled="props.loading"
              @update:model-value="toggleOption(filter.key, option.value)"
            />
            <span class="flex-1">{{ option.label }}</span>
            <span class="text-muted-color">{{ option.count }}</span>
          </label>
        </div>

        <label
          v-else-if="filter.type === 'BOOLEAN'"
          class="flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl border border-surface px-3 py-2 text-sm text-color"
        >
          <Checkbox
            binary
            :model-value="isBooleanSelected(filter.key)"
            :disabled="props.loading"
            @update:model-value="setBoolean(filter.key, !isBooleanSelected(filter.key))"
          />
          <span>{{ filter.label }}</span>
        </label>

        <div v-else class="grid gap-3">
          <div class="grid gap-3">
            <label class="grid gap-1 text-sm text-color">
              <span>{{ t('listingControls.rangeMinLabel') }}</span>
              <input
                v-model="getRangeDraft(filter.key).min"
                type="number"
                inputmode="numeric"
                min="0"
                class="min-h-12 rounded-2xl border border-surface bg-surface-0 px-3 text-color"
                :disabled="props.loading"
              />
            </label>
            <label class="grid gap-1 text-sm text-color">
              <span>{{ t('listingControls.rangeMaxLabel') }}</span>
              <input
                v-model="getRangeDraft(filter.key).max"
                type="number"
                inputmode="numeric"
                min="0"
                class="min-h-12 rounded-2xl border border-surface bg-surface-0 px-3 text-color"
                :disabled="props.loading"
              />
            </label>
          </div>
          <Button
            v-if="draftFilters[filter.key]"
            type="button"
            variant="outlined"
            size="small"
            :label="t('listingControls.clearRange')"
            :disabled="props.loading"
            @click="handleRemoveChip({ key: filter.key, label: filter.label, displayLabel: '' })"
          />
        </div>
      </section>
    </div>
  </section>
</template>
