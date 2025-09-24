<template>
  <div class="w-full h-screen flex flex-col">
    <header class="h-14 border-b px-4 flex items-center gap-3">
      <h1 class="text-sm font-medium">用户详情</h1>
    </header>

    <div class="flex-1 flex">
      <!-- 左侧：用户信息与成就 -->
      <div class="w-80 border-r bg-white p-6">
        <div class="flex items-start gap-4 mb-6">
          <img v-if="avatar" :src="avatar" class="w-16 h-16 rounded-full object-cover" />
          <div v-else class="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-sm text-gray-500">U</div>
          <div>
            <div class="text-base font-medium">{{ nickname || '匿名用户' }}</div>
            <div class="text-xs text-gray-500 mt-1">{{ bio }}</div>
            <div v-if="gender" class="text-xs text-gray-500 mt-1">性别：{{ gender }}</div>
            <div v-if="userTags && userTags.length" class="mt-2 flex flex-wrap gap-2">
              <span v-for="(t, i) in userTags" :key="i" class="px-2 py-0.5 text-[10px] rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">#{{ t }}</span>
            </div>
          </div>
        </div>

        <!-- 成就卡片 -->
        <div class="mb-6">
          <h3 class="text-sm font-medium mb-3">个人成就</h3>
          <ul class="space-y-2">
            <li class="flex items-center text-sm text-gray-700">
              <svg class="w-4 h-4 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.122a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.122a1 1 0 00-1.175 0l-3.976 2.122c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.122c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
              </svg>
              获得 {{ likeCount }} 次点赞
            </li>
            <li class="flex items-center text-sm text-gray-700">
              <svg class="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z"/>
                <path d="M10 6a4 4 0 100 8 4 4 0 000-8z"/>
              </svg>
              内容获得 {{ commentCount }} 次评论
            </li>
            <li class="flex items-center text-sm text-gray-700">
              <svg class="w-4 h-4 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z"/>
                <path d="M10 6a4 4 0 100 8 4 4 0 000-8z"/>
              </svg>
              获得 {{ collectCount }} 次收藏
            </li>
            <li class="flex items-center text-sm text-gray-700">
              <svg class="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z"/>
                <path d="M10 6a4 4 0 100 8 4 4 0 000-8z"/>
              </svg>
              代码片获得 {{ shareCount }} 次分享
            </li>
            <li class="flex items-center text-sm text-gray-700">
              <svg class="w-4 h-4 mr-2 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z"/>
                <path d="M10 6a4 4 0 100 8 4 4 0 000-8z"/>
              </svg>
              博客总排名 {{ rank }}
            </li>
          </ul>
        </div>

        <!-- 原力等级 -->
        <div class="mb-6">
          <h3 class="text-sm font-medium mb-3">原力等级</h3>
          <div class="bg-gray-50 p-3 rounded-lg">
            <div class="grid grid-cols-3 gap-4 text-center">
              <div>
                <div class="text-xs text-gray-500">原力等级</div>
                <div class="font-semibold">{{ level }}</div>
              </div>
              <div>
                <div class="text-xs text-gray-500">原力分</div>
                <div class="font-semibold">{{ powerScore }}</div>
              </div>
              <div>
                <div class="text-xs text-gray-500">本月获得</div>
                <div class="font-semibold">{{ monthlyGain }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：文章列表预览 -->
      <div class="flex-1 bg-white p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-medium">最近文章</h2>
          <div class="text-sm text-gray-500">共 {{ articleCount }} 篇</div>
        </div>

        <div class="space-y-4">
          <div v-for="(article, index) in articles" :key="index" class="border-b pb-4 last:border-b-0">
            <h3 class="text-base font-medium hover:text-indigo-600 cursor-pointer">{{ article.title }}</h3>
            <p class="text-sm text-gray-600 mt-1 line-clamp-2">{{ article.content }}</p>
            <div class="flex items-center justify-between mt-2 text-xs text-gray-500">
              <span>更新于 {{ article.updatedAt }}</span>
              <div class="flex items-center gap-4">
                <span>{{ article.readCount }} 阅读</span>
                <span>{{ article.commentCount }} 评论</span>
                <span>{{ article.likeCount }} 点赞</span>
                <span>{{ article.collectCount }} 收藏</span>
              </div>
            </div>
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

// 用户数据（mock）
const avatar = ref('https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop')
const nickname = ref('小天呐')
const bio = ref('一个在学习中的前端菜鸟')
const gender = ref('男') // 性别
const userTags = ref<string[]>(['摄影', 'Vue', '社团活动'])

// 成就数据
const likeCount = ref(473)
const commentCount = ref(44)
const collectCount = ref(682)
const shareCount = ref(3632)
const rank = ref('27,474 名')
const level = ref(4)
const powerScore = ref(818)
const monthlyGain = ref(11)

// 文章列表
const articles = ref([
  {
    title: 'qiankun 微前端接入实战',
    content: 'qiankun微前端实战，有完整的接入过程，以及一些遇到的问题，例如：解决项目的登录态和权限的问题。',
    updatedAt: '2025.09.06',
    readCount: 945,
    commentCount: 15,
    likeCount: 8,
    collectCount: 8
  },
  {
    title: 'Stenciljs，一个Web Components框架新体验',
    content: '一个新的框架Stenciljs，编写web components组件，拥有跨平台的特性，采用装饰器语法，本文讲述这个框架的使用。',
    updatedAt: '2025.08.28',
    readCount: 843,
    commentCount: 12,
    likeCount: 0,
    collectCount: 11
  },
  {
    title: '如何开发一款 VS Code 插件',
    content: '本文讲述了如何开发一款vscode插件，并进行发布',
    updatedAt: '2025.07.19',
    readCount: 584,
    commentCount: 3,
    likeCount: 7,
    collectCount: 7
  }
])

const articleCount = ref(articles.value.length)
</script>

<style scoped>
/* 自定义样式 */
</style>