<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const primaryLinks = computed(() => [
  { key: 'catalogue', label: t('footer.nav.catalogue') },
  { key: 'newArrivals', label: t('footer.nav.newArrivals') },
  { key: 'bestOffers', label: t('footer.nav.bestOffers') },
  { key: 'collections', label: t('footer.nav.collections') },
])

const supportLinks = computed(() => [
  { key: 'deliveryPayment', label: t('footer.support.deliveryPayment') },
  { key: 'returns', label: t('footer.support.returns') },
  { key: 'contacts', label: t('footer.support.contacts') },
  { key: 'faq', label: t('footer.support.faq') },
])

const socialLinks = ['Instagram', 'Pinterest', 'Facebook']
</script>

<template>
  <footer class="w-full border-t border-surface-200 bg-surface-50">
    <div
      class="mx-auto grid w-full max-w-[75%] gap-10 px-4 py-12 md:grid-cols-[1.2fr_1fr_1fr] md:px-0"
    >
      <div class="grid gap-4">
        <p class="m-0 text-3xl font-bold uppercase text-color md:text-4xl">OLYA HOME</p>
        <p class="m-0 max-w-md text-sm leading-6 text-muted-color">
          {{ t('footer.tagline') }}
        </p>
      </div>

      <div class="grid gap-3">
        <h3 class="m-0 text-base font-bold uppercase text-color">{{ t('footer.navHeading') }}</h3>
        <ul class="m-0 grid gap-2 p-0 text-sm text-muted-color list-none">
          <li v-for="link in primaryLinks" :key="link.key">
            <a href="#" class="no-underline text-inherit hover:text-color">{{ link.label }}</a>
          </li>
        </ul>
      </div>

      <div class="grid gap-6">
        <div class="grid gap-3">
          <h3 class="m-0 text-base font-bold uppercase text-color">
            {{ t('footer.supportHeading') }}
          </h3>
          <ul class="m-0 grid gap-2 p-0 text-sm text-muted-color list-none">
            <li v-for="link in supportLinks" :key="link.key">
              <a href="#" class="no-underline text-inherit hover:text-color">{{ link.label }}</a>
            </li>
          </ul>
        </div>

        <div class="grid gap-3">
          <h3 class="m-0 text-base font-bold uppercase text-color">
            {{ t('footer.socialHeading') }}
          </h3>
          <div class="flex flex-wrap gap-3 text-sm text-muted-color">
            <a
              v-for="link in socialLinks"
              :key="link"
              href="#"
              class="no-underline text-inherit hover:text-color"
            >
              {{ link }}
            </a>
          </div>
        </div>
      </div>
    </div>

    <div class="border-t border-surface-200">
      <div
        class="mx-auto flex w-full max-w-[75%] flex-col gap-2 px-4 py-4 text-sm text-muted-color md:flex-row md:items-center md:justify-between md:px-0"
      >
        <span>{{ t('footer.copyright') }}</span>
        <span>{{ t('footer.legalLinks') }}</span>
      </div>
    </div>
  </footer>
</template>
