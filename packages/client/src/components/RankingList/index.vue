<template>
  <div class="py-4">
    <!-- 活跃用户排行榜 -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-medium">活跃用户榜</h3>
        <span class="text-[10px] text-gray-400">最近7天</span>
      </div>

      <div v-if="activeUsers && activeUsers.length" class="space-y-3">
        <div
          class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
          v-for="(user, index) in activeUsers"
          :key="user.id"
        >
          <div class="relative shrink-0">
            <div
              class="flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium"
              :class="indexClass(index)"
            >
              {{ index + 1 }}
            </div>
            <span v-if="index < 3" class="absolute -top-1 -right-1 text-xs">🏅</span>
          </div>

          <div
            class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center overflow-hidden"
          >
            <span class="text-xs">{{ user.name.charAt(0) }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium truncate">{{ user.name }}</p>
            <p class="text-xs text-muted-foreground">{{ user.posts }} 动态</p>
          </div>
          <div class="text-xs text-muted-foreground">{{ user.likes }} 赞</div>
        </div>
      </div>
    </div>

    <!-- 热门动态 -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-medium">热门动态</h3>
        <span class="text-[10px] text-gray-400">今日</span>
      </div>
      <div v-if="hotPosts && hotPosts.length" class="space-y-3">
        <div
          class="p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-100"
          v-for="(post, index) in hotPosts"
          :key="post.id"
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
                <span>{{ post.author }}</span>
                <span>•</span>
                <span>{{ post.likes }} 赞</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-xs text-gray-400 h-20 flex items-center justify-center">暂无数据</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

type ActiveUser = {
  id: number | string
  name: string
  posts: number
  likes: number
  trend?: number // 名次变化（正上升，负下降，0持平）
}

type HotPost = {
  id: number | string
  title: string
  author: string
  likes: number
}

const activeUsers = ref<ActiveUser[]>([
  { id: 1, name: '张小明', posts: 24, likes: 128, trend: 2 },
  { id: 2, name: '李小红', posts: 19, likes: 96, trend: 1 },
  { id: 3, name: '王小刚', posts: 17, likes: 87, trend: 0 },
  { id: 4, name: '赵小丽', posts: 15, likes: 76, trend: -1 },
  { id: 5, name: '刘小强', posts: 12, likes: 65, trend: -2 }
])

const hotPosts = ref<HotPost[]>([
  { id: 1, title: '校园秋色正浓，快来欣赏', author: '摄影社', likes: 256 },
  { id: 2, title: '图书馆新书推荐', author: '图书管理员', likes: 198 },
  { id: 3, title: '校运会精彩瞬间回顾', author: '体育部', likes: 187 },
  { id: 4, title: '食堂新菜品评测', author: '美食协会', likes: 142 },
  { id: 5, title: '期末考试复习指南', author: '学霸君', likes: 135 }
])

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
