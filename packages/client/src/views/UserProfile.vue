<template>
  <div class="w-full h-screen flex flex-col">
    <header class="h-14 border-b px-4 flex items-center gap-3">
      <button
        class="text-sm text-gray-600 hover:text-gray-900"
        @click="$router.back()"
      >
        <ChevronLeft />
      </button>
      <h1 class="text-sm font-medium">用户详情</h1>
    </header>

    <div class="flex-1 flex">
      <!-- 左侧：用户信息与成就 -->
      <div class="w-80 border-r bg-white p-6">
        <div class="flex items-start gap-4 mb-6">
          <!-- 匿名用户头像 -->
          <div
            v-if="profile?.isAnonymous"
            class="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-sm text-gray-500"
          >
            匿
          </div>
          <!-- 非匿名用户头像 -->
          <img
            v-else-if="profile?.imgUrl"
            :src="proxy.$baseUrl + profile.imgUrl"
            class="w-16 h-16 rounded-full object-cover"
          />
          <div
            v-else
            class="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-sm text-gray-500"
          >
            U
          </div>
          <div>
            <div class="text-base font-medium">
              {{
                profile?.isAnonymous ? '匿名用户' : profile?.username || 'User'
              }}
            </div>
            <!-- 非匿名用户才显示性别 -->
            <div
              v-if="!profile?.isAnonymous"
              class="text-xs text-gray-500 mt-1"
            >
              性别：{{ getGenderText(profile?.sex) }}
            </div>
            <!-- 非匿名用户才显示标签 -->
            <div
              v-if="!profile?.isAnonymous && profile?.tag && profile.tag.length"
              class="mt-2 flex flex-wrap gap-2"
            >
              <span
                v-for="(t, i) in profile.tag"
                :key="i"
                class="px-2 py-0.5 text-[10px] rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100"
                >#{{ t }}</span
              >
            </div>
          </div>
        </div>

        <!-- 成就卡片 -->
        <div class="mb-6">
          <h3 class="text-sm font-medium mb-3">个人成就</h3>
          <ul class="space-y-2">
            <li class="flex items-center text-sm text-gray-700">
              <svg
                class="w-4 h-4 mr-2 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.122a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.122a1 1 0 00-1.175 0l-3.976 2.122c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.122c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
              获得 {{ profile?.likeCount || 0 }} 次点赞
            </li>
            <li class="flex items-center text-sm text-gray-700">
              <svg
                class="w-4 h-4 mr-2 text-blue-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z"
                />
                <path d="M10 6a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
              内容获得 {{ profile?.commentCount || 0 }} 次评论
            </li>
            <li class="flex items-center text-sm text-gray-700">
              <svg
                class="w-4 h-4 mr-2 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z"
                />
                <path d="M10 6a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
              发布 {{ profile?.articleCount || 0 }} 篇文章
            </li>
          </ul>
        </div>
      </div>

      <!-- 右侧：文章列表预览 -->
      <div class="flex-1 bg-white p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-medium">最近文章</h2>
          <div class="text-sm text-gray-500">
            共 {{ profile?.articleCount || 0 }} 篇
          </div>
        </div>

        <div class="space-y-4">
          <div
            v-for="(article, index) in articles"
            :key="index"
            class="border-b pb-4 last:border-b-0"
            @click="$router.push(`/post/${article.id}`)"
          >
            <h3
              class="text-base font-medium hover:text-indigo-600 cursor-pointer"
            >
              {{ article.title }}
            </h3>
            <p class="text-sm text-gray-600 mt-1 truncate max-w-[60vw]">
              {{
                extractTextFromHtml(article.content)
              }}121232132132312313123232323232332323nnmasndmandmnasdmandnsdamndmnm
            </p>
            <div
              class="flex items-center justify-between mt-2 text-xs text-gray-500"
            >
              <span>更新于 {{ formatTime(article.update_time) }}</span>
              <div class="flex items-center gap-4">
                <span>{{ article.commentCount || 0 }} 评论</span>
                <span>{{ article.likes || 0 }} 点赞</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getCurrentInstance, onMounted, ref } from 'vue'
import { ChevronLeft } from 'lucide-vue-next'
import { reqUserProfile } from '@/api/user'
import type { ProfileArticle, UserInfo } from '@/api/user/type'
import { extractTextFromHtml } from '@/utils/extractTextFromHtml'
import { formatTime } from '@/utils/formatTime'
import { useRoute } from 'vue-router'
const { proxy } = getCurrentInstance() as any
const route = useRoute()

// 用户信息
const profile = ref<UserInfo>()
// 文章列表
const articles = ref<ProfileArticle[]>([])

onMounted(() => {
  getUserProfile()
})

const getUserProfile = async () => {
  const res = await reqUserProfile(route.params.id as string)
  if (res.code === 200) {
    profile.value = res.data.user
    articles.value = res.data.articles
  }
}

const getGenderText = (sex: number | undefined) => {
  switch (sex) {
    case 0:
      return '保密'
    case 1:
      return '男'
    case 2:
      return '女'
    default:
      return '未知'
  }
}
</script>
