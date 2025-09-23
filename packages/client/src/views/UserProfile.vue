<template>
  <div class="w-full h-full flex flex-col">
    <header class="h-14 border-b px-4 flex items-center gap-3">
      <h1 class="text-sm font-medium">用户详情</h1>
    </header>
    <div class="p-6">
      <div class="flex items-start gap-4">
        <img v-if="avatar" :src="avatar" class="w-16 h-16 rounded-full object-cover" />
        <div v-else class="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-sm text-gray-500">U</div>
        <div>
          <div class="text-base font-medium">{{ nickname || '匿名用户' }}</div>
          <div class="text-xs text-gray-500 mt-1">{{ bio }}</div>
          <div v-if="userTags && userTags.length" class="mt-2 flex flex-wrap gap-2">
            <span v-for="(t, i) in userTags" :key="i" class="px-2 py-0.5 text-[10px] rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">#{{ t }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref } from 'vue'

const route = useRoute()
const userId = route.params.id
// mock 数据，可替换为接口请求
const avatar = ref('https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop')
const nickname = ref('摄影社阿青')
const bio = ref('热爱摄影与前端的在校生')
const userTags = ref<string[]>(['摄影', 'Vue', '社团活动'])
</script>

<style scoped></style>


