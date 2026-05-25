<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'
import { useI18n } from 'vue-i18n'

interface Props {
  open?: boolean
  disabled?: boolean
  ariaLabel?: string
}

const props = defineProps<Props>()
const { t } = useI18n()

const emit = defineEmits<{
  (event: 'toggle', nextState: boolean): void
}>()

const isOpen = computed(() => props.open ?? false)
const isDisabled = computed(() => props.disabled ?? false)
const ariaLabel = computed(() => props.ariaLabel ?? t('hamburgerMenu.toggleAriaLabel'))
const icon = computed(() => (isOpen.value ? 'pi pi-times' : 'pi pi-bars'))

function handleClick() {
  emit('toggle', !isOpen.value)
}
</script>

<template>
  <Button
    type="button"
    text
    rounded
    :icon="icon"
    :aria-label="ariaLabel"
    :aria-expanded="isOpen"
    aria-controls="hamburger-menu-drawer"
    :disabled="isDisabled"
    class="hamburger-toggle"
    @click="handleClick"
  />
</template>

<style scoped>
.hamburger-toggle {
  height: 2.75rem;
  width: 2.75rem;
  color: var(--color-gray-900);
}

.hamburger-toggle:hover {
  background: var(--color-gray-100);
}
</style>
