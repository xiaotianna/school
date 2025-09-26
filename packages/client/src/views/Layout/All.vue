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
import { ref, onMounted } from 'vue'
import ScrollWrapper from '@/components/ScrollWrapper/index.vue'
import PostList from '@/components/PostList/index.vue'
import RankingList from '@/components/RankingList/index.vue'
import { Input } from '@/components/ui/input'
import { getAllArticles } from '@/api/article'
import { ElMessage } from 'element-plus'

const posts = ref<any[]>([])

// 获取所有文章
const fetchAllArticles = async () => {
  try {
    const response = await getAllArticles()
    if (response.code === 200) {
      // 转换数据格式以匹配PostList组件的期望格式
      posts.value = response.data.map((article: any) => ({
        id: article.id,
        userId: article.author.id,
        avatar: article.author.imgUrl || 'https://avatars.githubusercontent.com/u/9919?s=200&v=4',
        nickname: article.author.username,
        content: article.content,
        images: article.images,
        tags: article.tags,
        createdAt: new Date(article.create_time).getTime(),
        likes: article.likes || 0,
        isAnonymous: article.author.isAnonymous
      }))
    } else {
      ElMessage.error('获取文章列表失败: ' + response.message)
    }
  } catch (error) {
    ElMessage.error('获取文章列表失败')
    console.error(error)
  }
}

onMounted(() => {
  fetchAllArticles()
})
</script>

<style scoped></style>