<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Room } from '@/api'
import InteractiveImageCard from '@/components/molecules/InteractiveImageCard/InteractiveImageCard.vue'

interface Props {
  room: Room
  clickable?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (event: 'select', room: Room): void
}>()
const { t } = useI18n()

const isClickable = computed(() => props.clickable ?? true)

function handleSelect() {
  if (!isClickable.value) {
    return
  }

  emit('select', props.room)
}
</script>

<template>
  <InteractiveImageCard
    :image-src="room.imageUrl"
    :image-alt="room.name"
    :no-image-label="t('roomsPage.noImage')"
    :clickable="isClickable"
    content-class="grid content-start gap-2 p-4"
    @select="handleSelect"
  >
    <div class="space-y-2">
      <h2 class="line-clamp-2 text-base font-bold text-color md:text-lg">
        {{ room.name }}
      </h2>
      <p v-if="room.description" class="line-clamp-3 text-sm leading-6 text-muted-color">
        {{ room.description }}
      </p>
    </div>
  </InteractiveImageCard>
</template>
