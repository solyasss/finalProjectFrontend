<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Image from 'primevue/image'
import { useI18n } from 'vue-i18n'
import type { ImageAsset } from '@/api'

interface Props {
  image: ImageAsset
  title?: string
  clickable?: boolean
  actionIcon?: string
  actionAriaLabel?: string
  actionPlacement?: 'bottom' | 'right' | 'none'
  imageFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  fillHeight?: boolean
  hideActionButtonOnMobile?: boolean
}

const props = defineProps<Props>()
const { t } = useI18n()

const emit = defineEmits<{
  (event: 'select'): void
}>()

const isClickable = computed(() => props.clickable ?? false)
const actionIcon = computed(() => props.actionIcon ?? 'pi pi-arrow-right')
const actionAriaLabel = computed(
  () => props.actionAriaLabel ?? t('productCutoutCard.openCollectionAriaLabel'),
)
const actionPlacement = computed(() => props.actionPlacement ?? 'right')
const imageFit = computed(() => props.imageFit ?? 'fill')
const showBottomFooter = computed(() => actionPlacement.value === 'bottom')
const showRightRail = computed(() => actionPlacement.value === 'right')
const showImageOnly = computed(() => actionPlacement.value === 'none')
const hideActionButtonOnMobile = computed(() => props.hideActionButtonOnMobile ?? false)
const imageSrc = computed(() => props.image.url)
const imageAlt = computed(() => props.image.alt)
const bottomFooterClass = computed(() =>
  hideActionButtonOnMobile.value
    ? 'grid grid-cols-1 items-center gap-3 bg-slate-50 px-4 py-3 sm:grid-cols-[minmax(0,1fr)_auto]'
    : 'grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 bg-slate-50 px-4 py-3',
)
const rightRailContentClass = computed(() =>
  hideActionButtonOnMobile.value
    ? 'grid h-full min-h-0 grid-cols-1 bg-slate-50 sm:grid-cols-[minmax(0,1fr)_auto]'
    : 'grid h-full min-h-0 grid-cols-[minmax(0,1fr)_auto] bg-slate-50',
)
const rightRailActionContainerClass = computed(() =>
  hideActionButtonOnMobile.value
    ? 'hidden items-center justify-center px-4 sm:flex sm:px-5'
    : 'flex items-center justify-center px-4 sm:px-5',
)
const showMobileRightRailFooter = computed(
  () => hideActionButtonOnMobile.value && showRightRail.value && Boolean(props.title),
)
const titleClass = 'text-color m-0 text-center text-lg font-bold max-sm:text-sm'

const cardRootStyle = computed(() => ({
  display: 'grid',
  width: '100%',
  height: '100%',
  minHeight: '0',
  overflow: 'hidden',
  borderRadius: '1.5rem',
  textAlign: 'center',
  cursor: isClickable.value ? 'pointer' : 'default',
}))

// TODO: Can be changed to use const instead of computed if no dynamic changes are needed
const cardBodyStyle = computed(() => ({
  padding: '0',
  height: '100%',
  minHeight: '0',
}))

const imageRootStyle = computed(() => ({
  width: '100%',
  height: '100%',
  minHeight: '0',
  background: 'var(--p-surface-50)',
}))

const imageStyle = computed(() => ({
  display: 'block',
  width: '100%',
  height: '100%',
  objectFit: imageFit.value,
  objectPosition: 'center',
}))

function handleClick() {
  if (!isClickable.value) return
  emit('select')
}
</script>

<template>
  <Card
    :pt="{
      root: { style: cardRootStyle },
      body: { style: cardBodyStyle },
      content: { style: cardBodyStyle },
    }"
    @click="handleClick"
  >
    <template #content>
      <div class="grid h-full min-h-0 w-full overflow-hidden rounded-3xl">
        <div v-if="showRightRail" class="grid h-full min-h-0 bg-slate-50">
          <div :class="rightRailContentClass">
            <Image
              :src="imageSrc"
              :alt="imageAlt"
              :pt="{
                root: { style: imageRootStyle },
                image: { style: imageStyle },
              }"
            />

            <div :class="rightRailActionContainerClass">
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
          </div>

          <div v-if="showMobileRightRailFooter" class="grid items-center px-4 py-3 sm:hidden">
            <h3 :class="titleClass">
              {{ title }}
            </h3>
          </div>
        </div>

        <template v-else-if="showBottomFooter">
          <div class="grid h-full min-h-0 grid-rows-[minmax(0,1fr)_auto]">
            <Image
              :src="imageSrc"
              :alt="imageAlt"
              :pt="{
                root: { style: imageRootStyle },
                image: { style: imageStyle },
              }"
            />

            <div :class="bottomFooterClass">
              <h3 :class="titleClass">
                {{ title }}
              </h3>

              <Button
                type="button"
                rounded
                :icon="actionIcon"
                :aria-label="actionAriaLabel"
                :disabled="!isClickable"
                :class="hideActionButtonOnMobile ? 'hidden sm:inline-flex' : undefined"
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
          </div>
        </template>

        <Image
          v-else-if="showImageOnly"
          :src="imageSrc"
          :alt="imageAlt"
          :pt="{
            root: { style: imageRootStyle },
            image: { style: imageStyle },
          }"
        />
      </div>
    </template>
  </Card>
</template>
