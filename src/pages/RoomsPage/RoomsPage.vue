<script setup lang="ts">
import { computed, ref } from 'vue'
import Message from 'primevue/message'
import Paginator from 'primevue/paginator'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import type { Room } from '@/api'
import RoomGrid from '@/components/organisms/RoomGrid/RoomGrid.vue'
import DefaultTemplate from '@/components/templates/DefaultTemplate/DefaultTemplate.vue'
import { useRoomsListing } from '@/composables/useRoomsListing'

const ROOMS_PAGE_SIZE = 6

const { t } = useI18n()
const router = useRouter()
const { loading, error, rooms } = useRoomsListing()
const currentPage = ref(1)

const pageCount = computed(() => Math.max(1, Math.ceil(rooms.value.length / ROOMS_PAGE_SIZE)))

const paginatedRooms = computed(() => {
  const start = (currentPage.value - 1) * ROOMS_PAGE_SIZE
  return rooms.value.slice(start, start + ROOMS_PAGE_SIZE)
})

const showPaginator = computed(() => rooms.value.length > ROOMS_PAGE_SIZE)

function handlePageChange(event: { page: number }) {
  currentPage.value = event.page + 1
}

async function handleSelectRoom(room: Room) {
  await router.push({
    name: 'room-detail',
    params: { roomId: room.id },
  })
}
</script>

<template>
  <DefaultTemplate>
    <section class="mx-auto grid max-w-[1440px] gap-6 px-4 py-6 md:px-6 md:py-8">
      <h1 class="text-3xl font-bold text-color md:text-4xl">
        {{ t('roomsPage.title') }}
      </h1>

      <Message v-if="loading" severity="secondary" variant="simple">
        {{ t('roomsPage.loading') }}
      </Message>
      <Message v-else-if="error" severity="error">{{ error }}</Message>
      <Message v-else-if="!rooms.length" severity="secondary" variant="simple">
        {{ t('roomsPage.empty') }}
      </Message>
      <div v-else class="grid gap-5">
        <RoomGrid :rooms="paginatedRooms" @select-room="handleSelectRoom" />

        <div
          v-if="showPaginator"
          class="flex flex-col gap-3 rounded-lg border border-surface bg-surface-0 p-4 md:flex-row md:items-center md:justify-between"
        >
          <p class="text-sm text-muted-color">
            {{ t('roomsPage.paginationSummary', { page: currentPage, total: pageCount }) }}
          </p>

          <Paginator
            :rows="ROOMS_PAGE_SIZE"
            :first="(currentPage - 1) * ROOMS_PAGE_SIZE"
            :total-records="rooms.length"
            template="PrevPageLink PageLinks NextPageLink"
            @page="handlePageChange"
          />
        </div>
      </div>
    </section>
  </DefaultTemplate>
</template>
