<template>
  <div class="py-4">
    <!-- 活跃用户排行榜 -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-medium">活跃用户榜</h3>
        <span class="text-[10px] text-gray-400">最近7天</span>
      </div>

      <div
        v-if="activeUsers && activeUsers.length"
        class="space-y-3"
      >
        <div
          class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 cursor-pointer"
          v-for="(user, index) in activeUsers"
          :key="user.id"
          @click="$router.push(`/user/${user.id}`)"
        >
          <div class="relative shrink-0">
            <div
              class="flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium"
              :class="indexClass(index)"
            >
              {{ index + 1 }}
            </div>
            <span
              v-if="index < 3"
              class="absolute -top-1 -right-1 text-xs"
              >🏅</span
            >
          </div>

          <div
            class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center overflow-hidden"
          >
            <img :src="proxy.$baseUrl + user.imgUrl" />
          </div>
          <div class="flex-1 max-w-[150px]">
            <p class="text-sm font-medium truncate min-w-0">
              {{ user.username }}
            </p>
          </div>
          <div class="text-xs text-muted-foreground">
            {{ user.likeCount }} 赞
          </div>
        </div>
      </div>
      <div
        v-else
        class="text-xs text-gray-400 h-20 flex items-center justify-center"
      >
        暂无数据
      </div>
    </div>

    <!-- 热门动态 -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-medium">热门动态</h3>
        <span class="text-[10px] text-gray-400">最近3天</span>
      </div>
      <div
        v-if="popularArticles && popularArticles.length"
        class="space-y-3"
      >
        <div
          class="p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-100"
          v-for="(post, index) in popularArticles"
          :key="post.id"
          @click="$router.push(`/post/${post.id}`)"
        >
          <div class="flex items-start gap-2">
            <div
              class="flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-medium mt-0.5"
              :class="indexClass(index)"
            >
              {{ index + 1 }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm truncate">{{ post.title }}</p>
              <div class="flex items-center gap-2 mt-1 text-xs text-gray-500">
                <span class="truncate max-w-[180px]">{{
                  extractTextFromHtml(post.content)
                }}</span>
                <span class="ml-auto">{{ post.likeCount }} 赞</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-else
        class="text-xs text-gray-400 h-20 flex items-center justify-center"
      >
        暂无数据
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { extractTextFromHtml } from '@/utils/extractTextFromHtml'
import { getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance() as any

// 定义从父组件接收的属性
interface ActiveUser {
  id: string
  username: string
  imgUrl: string
  isAnonymous: boolean
  likeCount: number
}

interface PopularArticle {
  id: string
  title: string
  content: string
  images: string[]
  tags: string[]
  create_time: string
  author: {
    id: string
    username: string
    imgUrl: string
    isAnonymous: boolean
  }
  likeCount: number
}

// 定义props
interface Props {
  activeUsers?: ActiveUser[]
  popularArticles?: PopularArticle[]
}

// 设置默认值
withDefaults(defineProps<Props>(), {
  activeUsers: () => [],
  popularArticles: () => []
})

function indexClass(index: number): string {
  if (index === 0) return 'bg-yellow-100 text-yellow-700'
  if (index === 1) return 'bg-gray-100 text-gray-700'
  if (index === 2) return 'bg-orange-100 text-orange-700'
  return 'bg-gray-100 text-gray-500'
}
</script>

<style scoped>
.w-80 {
  min-width: 20rem;
}
</style>
