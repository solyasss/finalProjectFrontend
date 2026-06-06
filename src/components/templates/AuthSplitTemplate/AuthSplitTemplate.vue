<template>
  <section class="min-h-screen bg-surface-0 text-color lg:h-screen">
    <div class="flex min-h-screen w-full flex-col lg:h-full lg:flex-row">
      <aside class="hidden lg:block lg:basis-[40%]">
        <slot name="visual" />
      </aside>

      <main
        class="flex w-full items-start justify-center px-4 py-4 sm:px-6 sm:py-6 lg:max-w-[40rem] lg:items-center lg:px-10 lg:py-0"
      >
        <div class="w-full max-w-2xl md:h-fit">
          <slot />
        </div>
      </main>
    </div>
  </section>
</template>
