<template>
  <div class="w-full h-full flex">
    <div class="flex-1 flex flex-col">
      <header class="h-14 border-b px-4 flex items-center justify-between">
        <h1 class="text-sm font-medium">全部动态</h1>
        <SearchInput 
          v-model="searchText" 
          @search="handleSearch"
          @select="handleSelectResult"
          @show-results="showSearchResults"
        />
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
        <RankingList :active-users="activeUsers" :popular-articles="popularArticles" />
      </ScrollWrapper>
    </div>
  </div>
  
  <!-- 搜索结果容器 -->
  <SearchResult 
    v-if="showSearchContainer"
    :results="searchResults"
    :keyword="searchKeyword"
    @close="closeSearchResults"
    @select="handleSelectResult"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ScrollWrapper from '@/components/ScrollWrapper/index.vue'
import PostList from '@/components/PostList/index.vue'
import RankingList from '@/components/RankingList/index.vue'
import SearchInput from '@/components/Search/SearchInput.vue'
import SearchResult from '@/components/Search/SearchResult.vue'
import { getAllArticles } from '@/api/article'
import { getActiveUsersRanking, getPopularArticlesRanking } from '@/api/article'
import { ElMessage } from 'element-plus'

const posts = ref<any[]>([])
const activeUsers = ref<any[]>([])
const popularArticles = ref<any[]>([])
const searchText = ref('')

// 搜索结果相关
const showSearchContainer = ref(false)
const searchResults = ref<any[]>([])
const searchKeyword = ref('')

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

// 获取排行榜数据
const fetchRankingData = async () => {
  try {
    // 使用Promise.all并行获取活跃用户榜和热门动态榜数据
    const [activeUsersResponse, popularArticlesResponse] = await Promise.all([
      getActiveUsersRanking(),
      getPopularArticlesRanking()
    ])

    // 处理活跃用户榜数据
    if (activeUsersResponse.code === 200) {
      activeUsers.value = activeUsersResponse.data.map(item => ({
        ...item.user,
        likeCount: item.likeCount
      }))
    } else {
      ElMessage.error('获取活跃用户榜失败: ' + activeUsersResponse.message)
    }

    // 处理热门动态榜数据
    if (popularArticlesResponse.code === 200) {
      popularArticles.value = popularArticlesResponse.data.map(item => ({
        ...item.article,
        author: item.author,
        likeCount: item.likeCount
      }))
    } else {
      ElMessage.error('获取热门动态榜失败: ' + popularArticlesResponse.message)
    }
  } catch (error) {
    ElMessage.error('获取排行榜数据失败')
    console.error(error)
  }
}

// 初始化所有数据
const initializeData = async () => {
  // 使用Promise.all并行初始化文章列表和排行榜数据
  await Promise.all([
    fetchAllArticles(),
    fetchRankingData()
  ])
}

// 处理搜索事件
const handleSearch = (keyword: string) => {
  console.log('搜索关键词:', keyword)
  // 这里可以添加实际的搜索逻辑
}

// 处理选择搜索结果事件
const handleSelectResult = (result: any) => {
  console.log('选择的搜索结果:', result)
  // 这里可以添加处理选中结果的逻辑
  closeSearchResults()
}

// 显示搜索结果容器
const showSearchResults = (data: { results: any[]; keyword: string }) => {
  searchResults.value = data.results
  searchKeyword.value = data.keyword
  showSearchContainer.value = true
}

// 关闭搜索结果容器
const closeSearchResults = () => {
  showSearchContainer.value = false
}

onMounted(() => {
  initializeData()
})
</script>

<style scoped></style>