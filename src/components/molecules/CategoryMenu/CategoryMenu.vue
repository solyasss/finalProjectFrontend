<script setup lang="ts">
import { computed, ref } from 'vue'
import AngleRightIcon from '@primevue/icons/angleright'
import TieredMenu from 'primevue/tieredmenu'
import type { MenuItem } from 'primevue/menuitem'

interface Props {
  model: MenuItem[]
}

const props = defineProps<Props>()

interface ProcessedMenuItem {
  item: MenuItem
  items?: ProcessedMenuItem[]
}

interface TieredMenuClickEvent {
  originalEvent: Event
  processedItem: ProcessedMenuItem
  isFocus?: boolean
}

type TieredMenuInstance = InstanceType<typeof TieredMenu> & {
  processedItems?: ProcessedMenuItem[]
  onItemClick?: (event: TieredMenuClickEvent) => void
}

const menu = ref<TieredMenuInstance | null>(null)
const hasInitializedHoverOpen = ref(false)

const rootItem = computed<MenuItem | undefined>(() => props.model[0])

function resolveMenuLabel(item: MenuItem | undefined): string {
  const { label } = item ?? {}

  if (typeof label === 'function') {
    return label()
  }

  return label ?? 'Categories'
}

const buttonLabel = computed(() => resolveMenuLabel(rootItem.value))
const popupItems = computed<MenuItem[]>(() => rootItem.value?.items ?? props.model)

function resetHoverInitialization() {
  hasInitializedHoverOpen.value = false
}

function toggleMenu(event: MouseEvent) {
  resetHoverInitialization()
  menu.value?.toggle(event)
}

function onMenuItemHover(event: MouseEvent, item: MenuItem) {
  if (hasInitializedHoverOpen.value) {
    return
  }

  const menuInstance = menu.value
  const processedItem = menuInstance?.processedItems?.find((candidate) => candidate.item === item)

  if (!processedItem?.items?.length || !menuInstance?.onItemClick) {
    return
  }

  hasInitializedHoverOpen.value = true
  menuInstance.onItemClick({
    originalEvent: event,
    processedItem,
    isFocus: false,
  })
}
</script>

<template>
  <button
    type="button"
    class="text-muted-color hover:text-color cursor-pointer border-0 bg-transparent px-0 py-0 text-sm font-medium transition-colors"
    aria-haspopup="true"
    aria-controls="category-menu"
    @click="toggleMenu"
  >
    {{ buttonLabel }}
  </button>

  <TieredMenu
    id="category-menu"
    ref="menu"
    :model="popupItems"
    popup
    @before-show="resetHoverInitialization"
    @before-hide="resetHoverInitialization"
  >
    <template #item="{ item, props: itemProps, hasSubmenu }">
      <a
        :href="item.url"
        :target="item.target"
        v-bind="itemProps.action"
        @mouseenter="onMenuItemHover($event, item)"
      >
        <span v-if="item.icon" v-bind="itemProps.icon" :class="item.icon" />
        <span v-bind="itemProps.label">{{ resolveMenuLabel(item) }}</span>
        <AngleRightIcon v-if="hasSubmenu" v-bind="itemProps.submenuicon" />
      </a>
    </template>
  </TieredMenu>
</template>
