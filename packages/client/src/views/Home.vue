<template>
  <div class="min-h-screen bg-[#f8f8f8]">
    <header class="flex items-center justify-between p-6">
      <div class="flex space-x-2">
        <div class="h-2 w-2 rounded-full bg-black"></div>
        <div class="h-2 w-2 rounded-full bg-black"></div>
      </div>
    </header>
    <main class="relative px-12 pt-12">
      <div
        class="absolute right-0 top-0 h-[300px] w-[300px] animate-pulse rounded-full bg-gradient-to-br from-pink-400 via-orange-300 to-yellow-200 opacity-70 blur-3xl"
        aria-hidden="true"
      />

      <div class="relative flex justify-between">
        <div class="max-w-3xl">
          <h1 class="text-6xl font-light leading-tight tracking-tight">
            校园墙
            <br />
            分享你的
            <br />
            校园生活
          </h1>

          <div class="mt-24">
            <div class="max-w-md">
              <button
                class="rounded-full border-2 px-8 py-2"
                @click="$router.push('/dashboard')"
              >
                <span class="relative">
                  立即加入
                  <div
                    class="absolute -left-4 -right-4 -top-4 -bottom-4 rounded-full border border-black opacity-50"
                  ></div>
                </span>
              </button>
            </div>
          </div>

          <p class="mt-24 max-w-xl text-sm leading-relaxed text-gray-600">
            我们创造有价值的校园内容和有趣的想法。
            <br />
            我们打造校园社区、分享平台、活动资讯和校园文化。
            <br />
            我们让校园生活更加精彩有趣。
          </p>
        </div>

        <!-- 右侧内容列表 -->
        <div class="w-80 space-y-4">
          <div
            v-for="post in posts"
            :key="post.id"
            class="bg-white rounded-xl p-4 shadow"
          >
            <div class="flex items-center space-x-3">
              <img
                :src="proxy.$baseUrl + '/user.png'"
                class="w-10 h-10 rounded-full object-cover"
                :alt="`${post.author}头像`"
              />
              <div>
                <div class="font-medium text-sm">{{ post.author }}</div>
                <div class="text-xs text-gray-500">{{ post.time }}</div>
              </div>
            </div>
            <div class="mt-3 text-sm">
              {{ post.content }}
            </div>
            <div class="mt-3 flex space-x-4 text-xs text-gray-500">
              <div class="flex items-center gap-1">
                <Heart
                  :size="12"
                  class="fill-red-500 stroke-transparent stroke-0"
                />
                <span> {{ post.likes }}</span>
              </div>
              <div class="flex items-center gap-1">
                <MessageCircleMore
                  :size="12"
                />
                <span> {{ post.comments }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { getCurrentInstance } from 'vue'
import { Heart, MessageCircleMore } from 'lucide-vue-next'
const { proxy } = getCurrentInstance() as any

// 生成假数据
const posts = [
  {
    id: 1,
    author: '校园小助手',
    time: '刚刚',
    content:
      '欢迎来到校园墙！在这里你可以分享校园生活的点点滴滴，结识志同道合的朋友。',
    likes: 24,
    comments: 5
  },
  {
    id: 2,
    author: '摄影爱好者',
    time: '10分钟前',
    content: '今日校园风景分享，秋天的梧桐叶正黄，快来感受这份美好吧！',
    likes: 128,
    comments: 24
  },
  {
    id: 3,
    author: '美食探索家',
    time: '1小时前',
    content: '新发现的食堂窗口，番茄牛腩饭超级香！推荐给大家～',
    likes: 86,
    comments: 31
  },
  {
    id: 4,
    author: '学习委员',
    time: '3小时前',
    content: '期末考试复习资料整理完毕，需要的同学可以私信我获取哦！',
    likes: 57,
    comments: 19
  }
]
</script>

<style scoped></style>
