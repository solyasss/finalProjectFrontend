<script setup lang="ts">
import { computed } from 'vue'
import Drawer from 'primevue/drawer'
import { useI18n } from 'vue-i18n'
import HamburgerToggle from '@/components/atoms/HamburgerToggle/HamburgerToggle.vue'

export interface HamburgerMenuItem {
  id: string
  label: string
  icon?: string
  description?: string
  disabled?: boolean
}

interface Props {
  items: HamburgerMenuItem[]
  disabled?: boolean
  ariaLabel?: string
  title?: string
  closeOnSelect?: boolean
}

const props = defineProps<Props>()
const { t } = useI18n()

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  (event: 'toggle', nextState: boolean): void
  (event: 'select', item: HamburgerMenuItem): void
}>()

const isDisabled = computed(() => props.disabled ?? false)
const drawerTitle = computed(() => props.title ?? t('hamburgerMenu.title'))
const shouldCloseOnSelect = computed(() => props.closeOnSelect ?? true)
const toggleAriaLabel = computed(() => props.ariaLabel ?? t('hamburgerMenu.toggleAriaLabel'))

function setOpen(nextState: boolean) {
  if (open.value === nextState) {
    return
  }

  open.value = nextState
  emit('toggle', nextState)
}

function handleSelect(item: HamburgerMenuItem) {
  emit('select', item)

  if (shouldCloseOnSelect.value) {
    setOpen(false)
  }
}
</script>

<template>
  <div>
    <HamburgerToggle
      :open="open"
      :disabled="isDisabled"
      :aria-label="toggleAriaLabel"
      @toggle="setOpen"
    />

    <Drawer
      :visible="open"
      position="left"
      :header="drawerTitle"
      :pt="{
        root: {
          id: 'hamburger-menu-drawer',
          class: 'h-dvh w-screen max-w-screen rounded-none',
        },
      }"
      @update:visible="setOpen"
    >
      <div class="mb-1">
        <slot />
      </div>

      <nav class="grid gap-1" :aria-label="t('hamburgerMenu.navAriaLabel')">
        <button
          v-for="item in props.items"
          :key="item.id"
          type="button"
          :disabled="item.disabled"
          class="w-full rounded-2xl border border-surface-200 bg-surface-0 p-4 text-inherit disabled:opacity-60"
          @click="handleSelect(item)"
        >
          <span class="flex items-start gap-3">
            <i
              v-if="item.icon"
              :class="[item.icon, 'mt-0.5 text-base text-muted-color']"
              aria-hidden="true"
            />
            <span class="min-w-0 text-left">
              <span class="block text-sm font-medium text-color">{{ item.label }}</span>
              <span v-if="item.description" class="mt-1 block text-sm text-muted-color">
                {{ item.description }}
              </span>
            </span>
          </span>
        </button>
      </nav>
    </Drawer>
  </div>
</template>
