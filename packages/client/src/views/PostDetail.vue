<template>
  <div class="w-full h-screen flex flex-col">
    <div class="flex-1 overflow-hidden">
      <div class="w-full h-full grid grid-cols-1 md:grid-cols-3 gap-0">
        <!-- 左侧内容 -->
        <div
          class="col-span-2 overflow-auto px-4 pt-4 pb-8 flex flex-col items-center gap-4"
        >
          <header class="w-full px-4">
            <button
              class="text-sm text-gray-600 hover:text-gray-900"
              @click="goBack"
            >
              <ChevronLeft />
            </button>
          </header>
          <div class="flex gap-3 max-w-[80%]">
            <img
              v-if="post.avatar"
              :src="post.avatar"
              class="w-10 h-10 rounded-full object-cover"
            />
            <div
              v-else
              class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500"
            >
              {{ post.nickname?.[0] ?? 'U' }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <span class="text-sm font-medium">{{
                  post.nickname || '匿名用户'
                }}</span>
                <span class="text-xs text-gray-400">·</span>
                <span class="text-xs text-gray-400">{{
                  formatTime(post.createdAt)
                }}</span>
              </div>
              <div class="mt-1 text-xs text-gray-500 flex items-center gap-2">
                <span>👍</span>
                <span>{{ post.likes ?? 0 }}</span>
              </div>
              <div
                class="mt-3 whitespace-pre-wrap break-words leading-7 text-[15px] text-gray-800"
              >
                {{ post.content }}
              </div>

              <div v-if="post.images && post.images.length" class="mt-3 masonry">
                <img
                  v-for="(img, idx) in post.images"
                  :key="idx"
                  :src="img"
                  class="masonry-item rounded object-cover w-full"
                />
              </div>

              <div
                v-if="post.tags && post.tags.length"
                class="mt-3 flex flex-wrap gap-2"
              >
                <span
                  v-for="(tag, idx) in post.tags"
                  :key="idx"
                  class="text-xs px-2 py-0.5 rounded-full border border-gray-200 text-gray-600"
                  >#{{ tag }}</span
                >
              </div>
            </div>
          </div>
        </div>
        <!-- 右侧评论 -->
        <div class="border-l overflow-auto p-4">
          <h2 class="text-sm font-medium mb-3">评论</h2>
          <div
            v-if="comments && comments.length"
            class="space-y-5"
          >
            <CommentItem
              v-for="c in comments"
              :key="c.id"
              :comment="c"
              :level="1"
            />
          </div>
          <div
            v-else
            class="text-xs text-gray-400"
          >
            暂无评论
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CommentItem from '@/components/CommentItem.vue'
import { ChevronLeft } from 'lucide-vue-next'

type Comment = {
  id: string | number
  user: { nickname: string; avatar?: string }
  content: string
  createdAt: string | number | Date
  replies?: Comment[]
}

type PostItem = {
  id: string | number
  userId?: string | number
  avatar?: string
  nickname?: string
  bio?: string
  userTags?: string[]
  content: string
  images?: string[]
  tags?: string[]
  createdAt: string | number | Date
  likes?: number
}

const route = useRoute()
const router = useRouter()

function goBack() {
  router.back()
}

// 示例：根据路由 id 获取帖子详情（此处使用 mock 数据）
const post = ref<PostItem>({
  id: route.params.id as string,
  userId: 3,
  avatar:
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
  nickname: '摄影社阿青',
  bio: '热爱摄影与前端的在校生',
  userTags: ['摄影', 'Vue', '社团活动'],
  content: '今晚的晚霞超美，分享几张校园的角落。',
  images: [
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=800&auto=format&fit=crop'
  ],
  tags: ['摄影', '晚霞'],
  createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
  likes: 88
})

const comments = ref<Comment[]>([
  {
    id: 1,
    user: { nickname: '同学A' },
    content: '写得很好，期待更多更新～',
    createdAt: Date.now() - 40 * 60 * 1000,
    replies: [
      {
        id: 11,
        user: { nickname: '作者' },
        content: '谢谢支持！后续会继续优化。',
        createdAt: Date.now() - 30 * 60 * 1000
      }
    ]
  },
  {
    id: 2,
    user: { nickname: '同学B' },
    content: '能否支持多图原图预览？',
    createdAt: Date.now() - 20 * 60 * 1000,
    replies: [
      {
        id: 21,
        user: { nickname: '同学C' },
        content: '赞同，最好还能保存到相册。',
        createdAt: Date.now() - 10 * 60 * 1000
      }
    ]
  }
])

function formatTime(time: PostItem['createdAt']): string {
  const date = time instanceof Date ? time : new Date(time)
  const now = Date.now()
  const diff = Math.max(0, now - date.getTime())
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  if (diff < minute) return '刚刚'
  if (diff < hour) return `${Math.floor(diff / minute)} 分钟前`
  if (diff < day) return `${Math.floor(diff / hour)} 小时前`
  const y = date.getFullYear()
  const m = `${date.getMonth() + 1}`.padStart(2, '0')
  const d = `${date.getDate()}`.padStart(2, '0')
  const hh = `${date.getHours()}`.padStart(2, '0')
  const mm = `${date.getMinutes()}`.padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}`
}
</script>

<style scoped>
.masonry {
  column-count: 1;
  column-gap: 8px;
}
@media (min-width: 768px) {
  .masonry {
    column-count: 2;
  }
}
@media (min-width: 1024px) {
  .masonry {
    column-count: 3;
  }
}
.masonry-item {
  width: 100%;
  display: inline-block;
  margin-bottom: 8px;
}
</style>
