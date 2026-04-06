<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Image from 'primevue/image'

interface Props {
  imageSrc: string
  imageAlt: string
  title: string
  clickable?: boolean
  showTitle?: boolean
  actionIcon?: string
  actionAriaLabel?: string
  actionPlacement?: 'bottom' | 'right' | 'none'
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (event: 'select'): void
}>()

const isClickable = computed(() => props.clickable ?? false)
const showTitle = computed(() => props.showTitle ?? false)
const actionIcon = computed(() => props.actionIcon ?? 'pi pi-arrow-right')
const actionAriaLabel = computed(() => props.actionAriaLabel ?? 'Open collection')
const actionPlacement = computed(
  () => props.actionPlacement ?? (showTitle.value ? 'bottom' : 'right'),
)
const showBottomFooter = computed(() => showTitle.value && actionPlacement.value === 'bottom')
const showRightRail = computed(() => !showTitle.value && actionPlacement.value === 'right')

function handleClick() {
  if (!isClickable.value) return
  emit('select')
}
</script>

<template>
  <Card
    :pt="{
      root: {
        style: {
          display: 'grid',
          width: '100%',
          overflow: 'hidden',
          borderRadius: '1.5rem',
          textAlign: 'center',
          cursor: isClickable ? 'pointer' : 'default',
        },
      },
      body: { style: { padding: '0' } },
      content: { style: { padding: '0' } },
    }"
    @click="handleClick"
  >
    <template #content>
      <div class="w-full overflow-hidden rounded-3xl">
        <div v-if="showRightRail" class="grid grid-cols-[1fr_auto] bg-color-gray-100">
          <Image
            :src="imageSrc"
            :alt="imageAlt"
            :pt="{
              root: { style: { width: '100%' } },
              image: {
                style: {
                  display: 'block',
                  width: '100%',
                  aspectRatio: '4 / 3',
                  objectFit: 'cover',
                  objectPosition: 'top',
                },
              },
            }"
          />

          <div class="flex items-center justify-center px-4 sm:px-5">
            <Button
              type="button"
              rounded
              :icon="actionIcon"
              :aria-label="actionAriaLabel"
              :disabled="!isClickable"
              :pt="{
                root: {
                  style: {
                    height: '2.75rem',
                    width: '2.75rem',
                    minHeight: '2.75rem',
                    minWidth: '2.75rem',
                    border: 'none',
                    background: 'var(--p-text-color)',
                    color: 'var(--p-surface-0)',
                    flexShrink: '0',
                  },
                },
              }"
              @click.stop="handleClick"
            />
          </div>
        </div>

        <Image
          v-else
          :src="imageSrc"
          :alt="imageAlt"
          :pt="{
            root: { style: { width: '100%' } },
            image: {
              style: {
                display: 'block',
                width: '100%',
                aspectRatio: '4 / 3',
                objectFit: 'cover',
                objectPosition: 'top',
              },
            },
          }"
        />

        <div
          v-if="showBottomFooter"
          class="grid grid-cols-[1fr_auto] items-center gap-4 px-5 py-4 bg-color-gray-100"
        >
          <h3
            class="text-color m-0 text-center text-[2rem] font-bold leading-[1.1] max-sm:text-2xl"
          >
            {{ title }}
          </h3>

          <Button
            type="button"
            rounded
            :icon="actionIcon"
            :aria-label="actionAriaLabel"
            :disabled="!isClickable"
            :pt="{
              root: {
                style: {
                  height: '2.75rem',
                  width: '2.75rem',
                  minHeight: '2.75rem',
                  minWidth: '2.75rem',
                  border: 'none',
                  background: 'var(--p-surface-900)',
                  color: 'var(--p-surface-0)',
                  flexShrink: '0',
                },
              },
            }"
            @click.stop="handleClick"
          />
        </div>

        <div v-else-if="showTitle" class="px-5 py-4 bg-color-gray-100">
          <h3
            class="text-color m-0 text-center text-[2rem] font-bold leading-[1.1] max-sm:text-2xl"
          >
            {{ title }}
          </h3>
        </div>
      </div>
    </template>
  </Card>
</template>
