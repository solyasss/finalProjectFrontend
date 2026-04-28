<script setup lang="ts">
import { computed } from 'vue'
import Message from 'primevue/message'
import { useI18n } from 'vue-i18n'
import type { ProductSetSummary } from '@/api'
import BackButton from '@/components/atoms/BackButton/BackButton.vue'
import DetailHero from '@/components/organisms/DetailHero/DetailHero.vue'
import ProductSetGrid from '@/components/organisms/ProductSetGrid/ProductSetGrid.vue'
import DefaultTemplate from '@/components/templates/DefaultTemplate/DefaultTemplate.vue'
import { useRoomDetailPage } from '@/composables/useRoomDetailPage'

const { t } = useI18n()
const { loading, error, room, sets, goBackToRooms, openProductSet } = useRoomDetailPage()

const roomStats = computed(() => {
  if (!room.value) {
    return []
  }

  return [
    {
      label: t('roomDetailPage.setCountLabel'),
      value: t('roomDetailPage.setCountValue', { count: sets.value.length }),
    },
    {
      label: t('roomDetailPage.activeStatusLabel'),
      value: room.value.isActive
        ? t('roomDetailPage.activeStatus')
        : t('roomDetailPage.inactiveStatus'),
    },
  ]
})

async function handleSelectProductSet(productSet: ProductSetSummary) {
  await openProductSet(productSet.id)
}
</script>

<template>
  <DefaultTemplate>
    <section class="mx-auto grid max-w-[1440px] gap-6 px-4 py-6 md:px-6 md:py-8">
      <Message v-if="loading" severity="secondary" variant="simple">
        {{ t('roomDetailPage.loading') }}
      </Message>

      <div v-else-if="error" class="grid gap-4">
        <Message severity="error">{{ error }}</Message>

        <div class="flex justify-start">
          <BackButton
            :label="t('roomDetailPage.backToRooms')"
            variant="outlined"
            @click="goBackToRooms"
          />
        </div>
      </div>

      <template v-else-if="room">
        <div class="flex justify-start">
          <BackButton :label="t('roomDetailPage.backToRooms')" @click="goBackToRooms" />
        </div>

        <DetailHero
          :image-url="room.imageUrl"
          :image-alt="room.name"
          :no-image-label="t('roomDetailPage.noImage')"
          :eyebrow="t('roomDetailPage.eyebrow')"
          :title="room.name"
          :description="room.description || t('roomDetailPage.descriptionFallback')"
          :stats="roomStats"
        />

        <section class="grid gap-4">
          <div class="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div class="space-y-1">
              <h2 class="text-2xl font-bold text-color md:text-3xl">
                {{ t('roomDetailPage.setsTitle') }}
              </h2>
              <p class="text-sm leading-6 text-muted-color">
                {{ t('roomDetailPage.setsDescription') }}
              </p>
            </div>
          </div>

          <Message v-if="!sets.length" severity="secondary" variant="simple">
            {{ t('roomDetailPage.empty') }}
          </Message>

          <ProductSetGrid
            v-else
            :product-sets="sets"
            @select-product-set="handleSelectProductSet"
          />
        </section>
      </template>
    </section>
  </DefaultTemplate>
</template>
