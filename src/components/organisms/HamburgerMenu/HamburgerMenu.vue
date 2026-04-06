<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'
import Drawer from 'primevue/drawer'
import HamburgerToggle from '@/components/atoms/HamburgerToggle/HamburgerToggle.vue'

export interface HamburgerMenuItem {
  id: string
  label: string
  icon?: string
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
        <Button
          v-for="item in props.items"
          :key="item.id"
          text
          fluid
          type="button"
          :label="item.label"
          :icon="item.icon"
          :disabled="item.disabled"
          class="hamburger-menu-item"
          @click="handleSelect(item)"
        />
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
  justify-content: flex-start;
}
</style>
