<script setup lang="ts">
const primaryLinks = ['Каталог', 'Новинки', 'Найкращі пропозиції', 'Колекції']

const supportLinks = ['Доставка та оплата', 'Повернення', 'Контакти', 'FAQ']

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
          Створюємо простір, у який хочеться повертатися - меблі, декор та готові рішення для дому в
          одному місці.
        </p>
      </div>

      <div class="grid gap-3">
        <h3 class="m-0 text-base font-bold uppercase text-color">Навігація</h3>
        <ul class="m-0 grid gap-2 p-0 text-sm text-muted-color list-none">
          <li v-for="link in primaryLinks" :key="link">
            <a href="#" class="no-underline text-inherit hover:text-color">{{ link }}</a>
          </li>
        </ul>
      </div>

      <div class="grid gap-6">
        <div class="grid gap-3">
          <h3 class="m-0 text-base font-bold uppercase text-color">Підтримка</h3>
          <ul class="m-0 grid gap-2 p-0 text-sm text-muted-color list-none">
            <li v-for="link in supportLinks" :key="link">
              <a href="#" class="no-underline text-inherit hover:text-color">{{ link }}</a>
            </li>
          </ul>
        </div>

        <div class="grid gap-3">
          <h3 class="m-0 text-base font-bold uppercase text-color">Соцмережі</h3>
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
      <!-- TODO: Replace store name -->
        <span>© 2026 REPLACE WITH REAL NAME. Всі права захищено.</span>
        <span>Політика конфіденційності · Умови користування</span>
      </div>
    </div>
  </footer>
</template>
