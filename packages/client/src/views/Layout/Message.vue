<template>
  <div class="w-full max-w-6xl mx-auto p-6">
    <div class="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
      <h2 class="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 !mb-4">
        消息中心
      </h2>

      <!-- 提示 -->
      <div
        v-if="currentTabTips"
        class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
      >
        <div class="flex items-start">
          <svg
            class="flex-shrink-0 w-5 h-5 text-blue-500 dark:text-blue-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div class="ml-3 text-sm text-blue-700 dark:text-blue-300">
            {{ currentTabTips }}
          </div>
        </div>
      </div>

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
          v-for="(message, idx) in messages"
          :key="message.article_id + idx"
          class="p-4 rounded-lg cursor-pointer border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors duration-200"
          @click="goTo(message)"
        >
          <div class="flex items-start gap-3">
            <!-- 匿名用户头像处理 -->
            <div
              v-if="message.user_isAnonymous"
              class="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
              @click.stop="$router.push(`/user/${message.user_id}`)"
            >
              <span class="text-gray-500 dark:text-gray-400 text-xs">匿</span>
            </div>
            <img
              v-else
              :src="proxy.$baseUrl + message.user_imgUrl"
              :alt="message.user_imgUrl"
              class="w-10 h-10 rounded-full object-cover"
            />
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <!-- 匿名用户名处理 -->
                <span
                  class="text-sm font-medium text-zinc-900 dark:text-zinc-100"
                >
                  {{ message.user_isAnonymous ? '匿名用户' : message.username }}
                </span>
                <span class="text-xs text-zinc-500 dark:text-zinc-400">
                  {{ formatTime(message.create_time) }}
                </span>
              </div>
              <p class="text-sm text-zinc-700 dark:text-zinc-300">
                {{ activeTab === 'replies' ? message.content : '赞了你的文章' }}
              </p>
              <div class="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                来自: {{ message.article_title }}
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div
          v-if="messages.length === 0"
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
import { reqGetMessages } from '@/api/article'
import type { Message } from '@/api/article/type'
import { formatTime } from '@/utils/formatTime'
import { ElMessage } from 'element-plus'
import { ref, onMounted, watch, computed, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
const { proxy } = getCurrentInstance() as any
const router = useRouter()

// Tab 数据
const tabs = [
  { id: 'replies', name: '消息回复', tips: '点击跳转进行回复' },
  { id: 'likes', name: '点赞信息', tips: '点击跳转查看详情' }
]

// 当前激活的 tab
const activeTab = ref('replies')
// 回复消息列表
const repliesMessages = ref<Message[]>([])
// 点赞信息列表
const likesMessages = ref<Message[]>([])
// 展示的消息列表
const messages = ref<Message[]>([])

// 计算当前标签页的提示信息
const currentTabTips = computed(() => {
  const currentTab = tabs.find((tab) => tab.id === activeTab.value)
  return currentTab ? currentTab.tips : ''
})

watch(
  () => activeTab.value,
  () => {
    renderMessage()
  }
)

const renderMessage = () => {
  messages.value =
    activeTab.value === 'replies' ? repliesMessages.value : likesMessages.value
}

onMounted(() => {
  getMessages()
})

const getMessages = async () => {
  try {
    let res = await reqGetMessages()
    if (res.code === 200) {
      repliesMessages.value = res.data.commentMessages
      likesMessages.value = res.data.likeMessages
      renderMessage()
    }
  } catch (error) {
    console.error('加载失败:', error)
    ElMessage.error('加载失败')
  }
}

const goTo = (message: Message) => {
  if (activeTab.value === 'replies' && message.id) {
    // message.id为评论id
    // 对于回复消息，跳转到文章详情页并定位到具体评论
    router.push(`/post/${message.article_id}?commentId=${message.id}`)
  } else {
    // 对于点赞消息，只跳转到文章详情页
    router.push(`/post/${message.article_id}`)
  }
}
</script>
