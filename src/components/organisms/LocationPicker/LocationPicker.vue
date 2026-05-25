<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import Popover from 'primevue/popover'
import { useI18n } from 'vue-i18n'
import type { LocationPickerCityOption } from '@/composables/useLocationPicker'

interface Props {
  currentLabel: string
  query: string
  cities: LocationPickerCityOption[]
  detecting?: boolean
  errorKey?: string | null
  showDesktopTrigger?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  detecting: false,
  errorKey: null,
  showDesktopTrigger: true,
})

const emit = defineEmits<{
  (event: 'update:query', value: string): void
  (event: 'select-city', cityId: string): void
  (event: 'retry-detect'): void
}>()

const { t } = useI18n()

const desktopPopover = ref<InstanceType<typeof Popover> | null>(null)
const mobileVisible = ref(false)
const isPopoverOpen = ref(false)

const isChooserOpen = computed(() => isPopoverOpen.value || mobileVisible.value)

const errorMessage = computed(() => (props.errorKey ? t(props.errorKey) : ''))

function onPopoverShow() {
  isPopoverOpen.value = true
  nextTick(() => {
    (document.getElementById('location-search-desktop') as HTMLInputElement | null)?.focus()
  })
}

function updateQuery(value: string | undefined) {
  emit('update:query', value ?? '')
}

function selectCity(cityId: string) {
  emit('select-city', cityId)
  closeChooser()
}

function retryDetect() {
  emit('retry-detect')
}

function openChooser(event?: Event) {
  if (isDesktopViewport() && event) {
    desktopPopover.value?.toggle(event)
    return
  }

  mobileVisible.value = true
}

function closeChooser() {
  desktopPopover.value?.hide()
  mobileVisible.value = false
}

function isDesktopViewport() {
  return globalThis.matchMedia?.('(min-width: 768px)').matches ?? true
}

defineExpose({ openChooser, closeChooser })
</script>

<template>
  <div>
    <Button
      type="button"
      text
      :aria-label="t('header.locationLabel')"
      :aria-expanded="isChooserOpen"
      aria-haspopup="dialog"
      :pt="{
        root: {
          style: {
            border: 'none',
            color: 'var(--p-text-muted-color)',
          },
        },
      }"
      @click="openChooser($event)"
    >
      <span class="text-muted-color flex items-center gap-2 text-sm">
        <i class="pi pi-map-marker" aria-hidden="true" />
        {{ props.currentLabel }}
      </span>
    </Button>

    <Popover ref="desktopPopover" @show="onPopoverShow" @hide="isPopoverOpen = false">
      <div class="grid w-[20rem] gap-4 p-1">
        <div class="grid gap-4">
          <p class="text-sm font-semibold text-color">{{ t('header.locationChooserTitle') }}</p>

          <div class="grid gap-2">
            <label for="location-search-desktop" class="text-sm font-medium text-color">
              {{ t('header.locationSearchLabel') }}
            </label>
            <InputText
              id="location-search-desktop"
              :model-value="props.query"
              fluid
              :placeholder="t('header.locationSearchPlaceholder')"
              @update:model-value="updateQuery"
            />
          </div>

          <Message v-if="errorMessage" severity="warn" size="small">
            {{ errorMessage }}
          </Message>

          <p class="text-sm text-muted-color">
            {{ t('header.locationManualHint') }}
          </p>

          <Button
            type="button"
            icon="pi pi-map-marker"
            :label="
              props.detecting ? t('header.locationDetecting') : t('header.locationUseCurrent')
            "
            :loading="props.detecting"
            @click="retryDetect"
          />

          <div class="max-h-80 overflow-y-auto pr-1">
            <div v-if="props.cities.length" class="grid gap-2">
              <Button
                v-for="city in props.cities"
                :key="city.id"
                text
                :label="city.label"
                :pt="{
                  root: {
                    style: {
                      minHeight: '3rem',
                      justifyContent: 'flex-start',
                      border: '1px solid var(--p-surface-200)',
                      borderRadius: '1rem',
                      padding: '0.75rem 1rem',
                      color: 'var(--p-text-color)',
                    },
                  },
                  label: {
                    style: {
                      width: '100%',
                      textAlign: 'left',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                    },
                  },
                }"
                @click="selectCity(city.id)"
              />
            </div>
            <p v-else class="text-sm text-muted-color">
              {{ t('header.locationNoResults') }}
            </p>
          </div>
        </div>
      </div>
    </Popover>

    <Dialog
      v-model:visible="mobileVisible"
      modal
      class="md:hidden"
      :header="t('header.locationChooserTitle')"
      :style="{ width: 'min(100%, 32rem)' }"
    >
      <div class="grid gap-4">
        <div class="grid gap-2">
          <label for="location-search-mobile" class="text-sm font-medium text-color">
            {{ t('header.locationSearchLabel') }}
          </label>
          <InputText
            id="location-search-mobile"
            :model-value="props.query"
            fluid
            :placeholder="t('header.locationSearchPlaceholder')"
            @update:model-value="updateQuery"
          />
        </div>

        <Message v-if="errorMessage" severity="warn" size="small">
          {{ errorMessage }}
        </Message>

        <p class="text-sm text-muted-color">
          {{ t('header.locationManualHint') }}
        </p>

        <Button
          type="button"
          icon="pi pi-map-marker"
          :label="props.detecting ? t('header.locationDetecting') : t('header.locationUseCurrent')"
          :loading="props.detecting"
          @click="retryDetect"
        />

        <div class="max-h-80 overflow-y-auto pr-1">
          <div v-if="props.cities.length" class="grid gap-2">
            <Button
              v-for="city in props.cities"
              :key="city.id"
              text
              :label="city.label"
              :pt="{
                root: {
                  style: {
                    minHeight: '3rem',
                    justifyContent: 'flex-start',
                    border: '1px solid var(--p-surface-200)',
                    borderRadius: '1rem',
                    padding: '0.75rem 1rem',
                    color: 'var(--p-text-color)',
                  },
                },
                label: {
                  style: {
                    width: '100%',
                    textAlign: 'left',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                  },
                },
              }"
              @click="selectCity(city.id)"
            />
          </div>
          <p v-else class="text-sm text-muted-color">
            {{ t('header.locationNoResults') }}
          </p>
        </div>
      </div>
    </Dialog>
  </div>
</template>
