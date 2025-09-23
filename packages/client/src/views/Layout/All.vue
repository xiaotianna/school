<template>
  <div class="w-full h-full flex">
    <div class="flex-1 flex flex-col">
      <header class="h-14 border-b px-4 flex items-center justify-between">
        <h1 class="text-sm font-medium">全部动态</h1>
        <Input placeholder="搜索" class="!w-52" />
      </header>
      <ScrollWrapper>
        <PostList :posts="posts" />
      </ScrollWrapper>
    </div>
    <div class="w-80 border-l flex flex-col">
      <div class="h-14 border-b px-4 flex items-center">
        <h2 class="text-sm font-medium">🏆 排行榜</h2>
      </div>
      <ScrollWrapper>
        <RankingList />
      </ScrollWrapper>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ScrollWrapper from '@/components/ScrollWrapper/index.vue'
import PostList from '@/components/PostList/index.vue'
import RankingList from '@/components/RankingList/index.vue'
import { Input } from '@/components/ui/input'

const now = Date.now()
const posts = ref<any[]>([
  {
    id: 1,
    userId: 1,
    avatar: 'https://avatars.githubusercontent.com/u/9919?s=200&v=4',
    nickname: 'GitHub学子',
    content: '今天给社墙加了新功能：支持图片九宫格展示和标签。欢迎大家来试用并反馈！',
    images: [
      'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop'
    ],
    tags: ['更新', '图片', '反馈'],
    createdAt: now - 5 * 60 * 1000,
    likes: 45
  },
  {
    id: 2,
    userId: 2,
    nickname: '匿名树洞',
    content: '图书馆二楼自习区今晚有空位，想学习的可以来～',
    tags: ['图书馆', '自习'],
    createdAt: now - 2 * 60 * 60 * 1000,
    likes: 12
  },
  {
    id: 3,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
    userId: 3,
    nickname: '摄影社阿青',
    content: '今晚的晚霞超美，分享几张校园的角落。',
    images: [
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=800&auto=format&fit=crop'
    ],
    tags: ['摄影', '晚霞'],
    createdAt: now - 3 * 24 * 60 * 60 * 1000,
    likes: 88
  },
  {
    id: 4,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
    userId: 4,
    nickname: '摄影社阿青',
    content: '今晚的晚霞超美，分享几张校园的角落。',
    images: [
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=800&auto=format&fit=crop'
    ],
    tags: ['摄影', '晚霞'],
    createdAt: now - 3 * 24 * 60 * 60 * 1000,
    likes: 91
  }
])
</script>

<style scoped></style>
