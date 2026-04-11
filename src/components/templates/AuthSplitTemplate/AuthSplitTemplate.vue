<template>
  <section class="h-screen bg-surface-0 text-color">
    <div class="flex flex-row h-full w-full">
      <aside class="hidden lg:block lg:basis-[40%]">
        <slot name="visual" />
      </aside>
      
      <main
        class="flex flex-1 lg:flex-0 items-center md:px-6 lg:basis-[30%] lg:px-10"
      >
        <div class="w-full h-full md:h-fit">
          <slot />
        </div>
      </main>
    </div>
  </section>
</template>
