<template>
    <div class="min-h-screen bg-[#f8f8f8]">
      <header class="flex items-center justify-between p-6">
        <div class="flex space-x-2">
          <div class="h-2 w-2 rounded-full bg-black"></div>
          <div class="h-2 w-2 rounded-full bg-black"></div>
        </div>
        <div class="flex items-center space-x-6">
          <button class="text-sm">EN</button>
          <Link href="/contact" class="text-sm hover:underline">
            CONTACT US
          </Link>
          <button class="flex flex-col space-y-1">
            <span class="h-0.5 w-6 bg-black"></span>
            <span class="h-0.5 w-6 bg-black"></span>
          </button>
        </div>
      </header>

      <main class="relative px-6 pt-12">
        <div
          class="absolute right-0 top-0 h-[300px] w-[300px] animate-pulse rounded-full bg-gradient-to-br from-pink-400 via-orange-300 to-yellow-200 opacity-70 blur-3xl"
          aria-hidden="true"
        />

        <div class="relative">
          <h1 class="max-w-3xl text-6xl font-light leading-tight tracking-tight">
            WE CREATE
            <br />
            BEST DIGITAL
            <br />
            PRODUCTS.
          </h1>

          <div class="mt-24 flex justify-between">
            <div class="max-w-md">
              <button class="rounded-full border-2 px-8 py-2">
                <span class="relative">
                  DISCUSS THE PROJECT
                  <div class="absolute -left-4 -right-4 -top-4 -bottom-4 rounded-full border border-black opacity-50"></div>
                </span>
              </button>
              <p class="mt-8 text-sm leading-relaxed text-gray-600">
                WE ARE THE LEADERS IN WEB & MOBILE
                <br />
                DESIGN AND DEVELOPMENT INDUSTRY.
              </p>
            </div>

            <div class="flex items-end">
              <div class="flex items-center space-x-2">
                <span class="text-sm">WHO WE ARE</span>
                <span class="h-px w-12 bg-black"></span>
              </div>
            </div>
          </div>

          <p class="mt-24 max-w-xl text-sm leading-relaxed text-gray-600">
            We create quality content and cool ideas. We create websites, applications, 3D design, motion design and
            animation. We bring the most daring ideas to life
          </p>
        </div>
      </main>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>