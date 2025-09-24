<template>
  <div class="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-900 p-4">
    <div class="text-center max-w-md w-full">
      <div class="mb-8">
        <svg
          class="w-32 h-32 mx-auto text-zinc-300 dark:text-zinc-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1"
            d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.467-.881-6.08-2.334M3 21l3.75-3.75M21 21l-3.75-3.75m3.75-12L18 9m2.25-3.75L18 3m-6 18v-3m0-15v3"
          ></path>
        </svg>
      </div>
      
      <h1 class="text-6xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">404</h1>
      <h2 class="text-2xl font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
        页面未找到
      </h2>
      <p class="text-zinc-600 dark:text-zinc-400 mb-8">
        抱歉，您访问的页面不存在或已被移除。
      </p>
      
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          @click="goHome" 
          class="px-6 py-3 rounded-lg"
        >
          返回首页
        </Button>
        <Button 
          @click="goBack" 
          variant="outline" 
          class="px-6 py-3 rounded-lg"
        >
          返回上页
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.back()
}
</script>