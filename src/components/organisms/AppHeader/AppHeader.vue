<script setup lang="ts">
import { ref } from 'vue'
import Button from 'primevue/button'
import HamburgerMenu from '@/components/organisms/HamburgerMenu/HamburgerMenu.vue'

const menuOpen = ref(false)

const menuItems = [
  { id: 'products', label: 'Товари', icon: 'pi pi-box' },
  { id: 'rooms', label: 'Кімнати', icon: 'pi pi-home' },
  { id: 'design', label: 'Дизайн', icon: 'pi pi-palette' },
]

const navItems = [
  { label: 'Товари', href: '#' },
  { label: 'Кімнати', href: '#' },
  { label: 'Дизайн', href: '#' },
]
</script>

<template>
  <header class="bg-surface-0 border-b border-surface">
    <div class="flex min-h-18 items-center justify-between gap-4 px-3 md:px-6 lg:px-12">
      <div class="flex min-w-0 items-center gap-4 md:gap-6 lg:gap-8">
        <div class="md:hidden">
          <HamburgerMenu v-model:open="menuOpen" :items="menuItems" aria-label="Відкрити меню" />
        </div>

        <a
          href="#"
          class="text-color flex h-10 items-center text-[2.25rem] font-bold leading-none no-underline"
          aria-label="Логотип"
        >
          BN
        </a>

        <nav class="hidden items-center gap-6 md:flex" aria-label="Основна навігація">
          <a
            v-for="item in navItems"
            :key="item.label"
            :href="item.href"
            class="text-muted-color hover:text-color text-sm font-medium no-underline transition-colors"
          >
            {{ item.label }}
          </a>
        </nav>
      </div>

      <div class="flex shrink-0 items-center gap-1 md:gap-2">
        <Button
          type="button"
          text
          :pt="{
            root: { style: { border: 'none', color: 'var(--p-text-muted-color)' } },
          }"
        >
          <span class="text-muted-color hidden items-center gap-2 text-sm md:flex">
            <i class="pi pi-map-marker" aria-hidden="true" />
            Київ
          </span>
        </Button>

        <RouterLink to="/register" class="no-underline">
          <Button
            type="button"
            text
            :pt="{
              root: { style: { border: 'none', color: 'var(--p-text-muted-color)' } },
            }"
          >
            <span class="text-muted-color hidden items-center gap-2 text-sm md:flex">
              <i class="pi pi-user" aria-hidden="true" />
              Привіт! Увійдіть в систему
            </span>
          </Button>
        </RouterLink>

        <Button
          type="button"
          text
          aria-label="Кошик"
          :pt="{
            root: { style: { border: 'none', color: 'var(--p-text-muted-color)' } },
          }"
        >
          <i class="pi pi-shopping-bag text-muted-color text-base" aria-hidden="true" />
        </Button>

        <Button
          type="button"
          text
          aria-label="Обране"
          :pt="{
            root: { style: { border: 'none', color: 'var(--p-text-muted-color)' } },
          }"
        >
          <i class="pi pi-heart text-muted-color text-base" aria-hidden="true" />
        </Button>
      </div>
    </div>
  </header>
</template>
