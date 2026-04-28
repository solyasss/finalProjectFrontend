<script setup lang="ts">
import type { Room } from '@/api'
import RoomCard from '@/components/molecules/RoomCard/RoomCard.vue'

interface Props {
  rooms: Room[]
}

defineProps<Props>()

const emit = defineEmits<{
  (event: 'select-room', room: Room): void
}>()
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <RoomCard
      v-for="room in rooms"
      :key="room.id"
      :room="room"
      @select="emit('select-room', $event)"
      clickable
    />
  </div>
</template>
