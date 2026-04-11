<script setup lang="ts">
import { computed } from 'vue'
import Drawer from 'primevue/drawer'
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

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  (event: 'toggle', nextState: boolean): void
  (event: 'select', item: HamburgerMenuItem): void
}>()

const isDisabled = computed(() => props.disabled ?? false)
const drawerTitle = computed(() => props.title ?? 'Menu')
const shouldCloseOnSelect = computed(() => props.closeOnSelect ?? true)
const toggleAriaLabel = computed(() => props.ariaLabel ?? 'Toggle menu')

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
      class="hamburger-menu-drawer"
      :header="drawerTitle"
      @update:visible="setOpen"
    >
      <nav class="hamburger-menu-list" aria-label="Main menu">
        <button
          v-for="item in props.items"
          :key="item.id"
          type="button"
          :disabled="item.disabled"
          class="hamburger-menu-item"
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

<style scoped>
.hamburger-menu-list {
  display: grid;
  gap: 0.25rem;
}

.hamburger-menu-item {
  width: 100%;
  border: 1px solid var(--p-surface-200);
  border-radius: 1rem;
  background: var(--p-surface-0);
  padding: 1rem;
  color: inherit;
}

.hamburger-menu-item:disabled {
  opacity: 0.6;
}
</style>
