<template>
  <div class="w-full max-w-6xl mx-auto p-6">
    <div class="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
      <h2 class="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-6">
        消息中心
      </h2>
      
      <!-- Tab 切换 -->
      <div class="border-b border-zinc-200 dark:border-zinc-800 mb-6">
        <nav class="flex space-x-6">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="py-3 px-1 text-sm font-medium border-b-2 transition-colors duration-200"
            :class="[
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300 dark:text-zinc-400 dark:hover:text-zinc-300'
            ]"
          >
            {{ tab.name }}
          </button>
        </nav>
      </div>
      
      <!-- 消息列表 -->
      <div class="space-y-4">
        <div
          v-for="message in filteredMessages"
          :key="message.id"
          class="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors duration-200"
        >
          <div class="flex items-start gap-3">
            <img
              :src="message.user.avatar"
              :alt="message.user.name"
              class="w-10 h-10 rounded-full object-cover"
            />
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {{ message.user.name }}
                </span>
                <span class="text-xs text-zinc-500 dark:text-zinc-400">
                  {{ message.time }}
                </span>
              </div>
              <p class="text-sm text-zinc-700 dark:text-zinc-300">
                {{ message.content }}
              </p>
              <div class="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                来自: {{ message.source }}
              </div>
            </div>
          </div>
        </div>
        
        <!-- 空状态 -->
        <div
          v-if="filteredMessages.length === 0"
          class="text-center py-12"
        >
          <svg
            class="mx-auto h-12 w-12 text-zinc-400 dark:text-zinc-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
            暂无消息
          </h3>
          <p class="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            当你收到回复或点赞时，会在这里显示
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Tab 数据
const tabs = [
  { id: 'replies', name: '消息回复' },
  { id: 'likes', name: '点赞回复' }
]

// 当前激活的 tab
const activeTab = ref('replies')

// 模拟消息数据
const messages = [
  {
    id: 1,
    type: 'replies',
    user: {
      name: '张三',
      avatar: 'https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-02-albo9B0tWOSLXCVZh9rX9KFxXIVWMr.png'
    },
    content: '你的帖子写得真好，学到了很多新知识！',
    time: '2小时前',
    source: '帖子《Vue 3实战技巧分享》'
  },
  {
    id: 2,
    type: 'replies',
    user: {
      name: '李四',
      avatar: 'https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-02-albo9B0tWOSLXCVZh9rX9KFxXIVWMr.png'
    },
    content: '感谢分享，这个解决方案对我帮助很大',
    time: '5小时前',
    source: '帖子《React性能优化指南》'
  },
  {
    id: 3,
    type: 'likes',
    user: {
      name: '王五',
      avatar: 'https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-02-albo9B0tWOSLXCVZh9rX9KFxXIVWMr.png'
    },
    content: '赞了你的评论',
    time: '1天前',
    source: '帖子《前端工程化实践》下的评论'
  },
  {
    id: 4,
    type: 'likes',
    user: {
      name: '赵六',
      avatar: 'https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-02-albo9B0tWOSLXCVZh9rX9KFxXIVWMr.png'
    },
    content: '赞了你的帖子',
    time: '2天前',
    source: '帖子《TypeScript高级技巧》'
  },
  {
    id: 5,
    type: 'replies',
    user: {
      name: '孙七',
      avatar: 'https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-02-albo9B0tWOSLXCVZh9rX9KFxXIVWMr.png'
    },
    content: '请问这个问题你是怎么解决的？能详细说说吗？',
    time: '3天前',
    source: '帖子《Webpack配置优化》'
  }
]

// 根据当前激活的 tab 过滤消息
const filteredMessages = computed(() => {
  return messages.filter(message => message.type === activeTab.value)
})
</script>