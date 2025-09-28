<template>
  <div class="w-full">
    <div
      v-if="posts && posts.length"
      class="p-4 space-y-6"
    >
      <div
        v-for="post in posts"
        :key="post.id"
        class="flex gap-3 cursor-pointer rounded hover:bg-gray-50 p-2 -m-2"
        @click="navigateTo(post.id)"
      >
        <div>
          <img
            v-if="post.avatar && !post.isAnonymous"
            :src="proxy.$baseUrl + post.avatar"
            alt="avatar"
            class="w-10 h-10 rounded-full object-cover shrink-0"
            @click.stop="goProfile(post.userId)"
          />
          <div
            v-else
            class="w-10 h-10 rounded-full bg-gray-200 shrink-0 flex items-center justify-center text-xs text-gray-500"
            @click.stop="goProfile(post.userId)"
          >
            {{ post.isAnonymous ? '匿' : (post.nickname?.[0] ?? 'U') }}
          </div>
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium truncate">{{
              post.isAnonymous ? '匿名用户' : post.nickname || 'User'
            }}</span>
            <span class="text-xs text-gray-400">·</span>
            <span class="text-xs text-gray-400">{{
              formatTime(post.createdAt)
            }}</span>
          </div>
          <div
            class="mt-1 text-sm leading-6 whitespace-pre-wrap break-words text-gray-800 content-ellipsis-5"
          >
            {{ extractTextFromHtml(post.content) }}
          </div>

          <div
            v-if="post.images && post.images.length"
            class="mt-3 grid gap-2"
            :class="imageGridClass(post.images.length)"
          >
            <img
              v-for="(img, idx) in post.images"
              :key="idx"
              :src="proxy.$baseUrl + img"
              alt="image"
              class="w-full h-28 object-cover rounded"
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

          <div class="mt-3 flex items-center gap-4 text-xs text-gray-500">
            <div class="flex items-center gap-1">
              <Heart
                :size="12"
                class="fill-red-500 stroke-transparent stroke-0"
              />
              <span>{{ post.likes ?? 0 }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-else
      class="h-40 flex items-center justify-center text-sm text-gray-400"
    >
      暂无内容
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatTime } from '@/utils/formatTime'
import { useRouter } from 'vue-router'
import { getCurrentInstance } from 'vue'
import { extractTextFromHtml } from '@/utils/extractTextFromHtml'
import { Heart } from 'lucide-vue-next'
const { proxy } = getCurrentInstance() as any

type PostItem = {
  id: string | number
  userId: string | number
  avatar: string
  nickname: string
  content: string
  images?: string[]
  tags?: string[]
  createdAt: string | number | Date
  likes?: number
  // 是否匿名（该数据理应放在server端的，但是为了方便，所以在client端做判断）
  isAnonymous: boolean
}

defineProps<{
  posts: PostItem[]
}>()

function imageGridClass(length: number): string {
  if (length === 1) return 'grid-cols-1'
  if (length === 2) return 'grid-cols-2'
  if (length === 4) return 'grid-cols-2'
  return 'grid-cols-3'
}

const router = useRouter()
function navigateTo(id: string | number) {
  router.push({ name: 'PostDetail', params: { id: String(id) } })
}

function goProfile(userId: string | number) {
  router.push({
    name: 'UserProfile',
    params: { id: String(userId) }
  })
}
</script>

<style scoped>
.content-ellipsis-5 {
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  line-clamp: 5;
  overflow: hidden;
}
</style>
