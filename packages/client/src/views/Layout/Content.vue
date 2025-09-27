<template>
  <div class="w-full h-full">
    <div class="flex-1 flex flex-col">
      <header class="h-14 border-b px-4 flex items-center justify-between">
        <h1 class="text-sm font-medium">作品列表</h1>
      </header>
      <!-- 主内容区 -->
      <main class="flex-grow container mx-auto px-4 pb-8">
        <!-- 搜索和筛选区 -->
        <div class="bg-white rounded-lg mb-2">
          <div class="flex flex-col md:flex-row gap-4 py-4">
            <!-- 搜索框 -->
            <div class="relative flex-grow">
              <Input
                placeholder="搜索作品名称"
                v-model="searchQuery"
              />
            </div>

            <Button
              @click="applyFilters"
              variant="outline"
              class="flex items-center"
            >
              筛选
            </Button>

            <!-- 分类筛选 -->
            <div class="flex flex-wrap gap-3">
              <Select
                v-model="selectedStatus"
                @update:model-value="applyFilters"
              >
                <SelectTrigger class="w-[180px]">
                  <SelectValue placeholder="所有状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">所有状态</SelectItem>
                    <SelectItem value="published">已发布</SelectItem>
                    <SelectItem value="draft">草稿</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <!-- 作品列表 - 使用v3的网格布局增强功能 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- 作品项 -->
          <div
            v-for="work in works"
            :key="work.id"
            class="bg-white rounded-lg overflow-hidden shadow-md flex flex-col card-hover"
          >
            <div class="relative h-48">
              <!-- 封面图 -->
              <img
                v-if="work.image && !imageLoadFailed[work.id]"
                :src="proxy.$baseUrl + work.image"
                :alt="work.title"
                class="w-full h-full object-cover"
                @error="handleImageError(work.id)"
              />
              <!-- 图片加载失败或无图片时显示标题 -->
              <div
                v-else
                class="w-full h-full bg-gray-100 flex items-center justify-center"
              >
                <span
                  class="text-gray-500 text-lg font-medium text-center px-2"
                >
                  {{ work.title }}
                </span>
              </div>
              <span
                class="absolute top-3 left-3 text-white text-xs px-2 py-1 rounded-full"
                :class="getStatusClass(work.status)"
              >
                {{ getStatusText(work.status) }}
              </span>
            </div>
            <div class="p-5 flex-1 flex flex-col">
              <div class="flex justify-between items-start mb-3">
                <h3 class="font-bold text-lg">{{ work.title }}</h3>
                <div class="text-sm">{{ work.date }}</div>
              </div>
              <p class="text-gray-600 text-sm mb-4 line-clamp-2">
                {{ work.description }}
              </p>

              <div
                v-if="work.tags && work.tags.length > 0"
                class="flex flex-wrap gap-2 mb-4"
              >
                <span
                  v-for="tag in work.tags"
                  :key="tag"
                  class="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600"
                >
                  {{ tag }}
                </span>
              </div>

              <div class="w-full flex justify-end items-center mt-auto">
                <div class="flex gap-2">
                  <Button
                    @click="viewWork(work.id)"
                    class="text-blue-500 hover:text-blue-700 transition-colors"
                    title="查看"
                    variant="ghost"
                    size="icon"
                  >
                    <Eye class="h-4 w-4" />
                  </Button>
                  <Button
                    @click="editWork(work.id)"
                    class="text-green-500 hover:text-green-700 transition-colors"
                    title="编辑"
                    variant="ghost"
                    size="icon"
                  >
                    <Edit class="h-4 w-4" />
                  </Button>
                  <Button
                    @click="deleteWork(work.id, work.title)"
                    class="text-red-500 hover:text-red-700 transition-colors"
                    title="删除"
                    variant="ghost"
                    size="icon"
                  >
                    <Trash2 class="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 分页 -->
        <div class="mt-8 flex justify-center">
          <nav class="flex items-center space-x-1">
            <Button
              @click="changePage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              variant="ghost"
              size="icon"
            >
              <ChevronLeft class="h-4 w-4" />
            </Button>

            <template
              v-for="page in pageList"
              :key="page"
            >
              <Button
                v-if="page !== '...'"
                @click="changePage(Number(page))"
                class="w-10 h-10 flex items-center justify-center rounded-lg"
                :class="
                  page === currentPage
                    ? 'bg-primary text-white'
                    : 'border border-gray-200 hover:bg-gray-50 transition-colors'
                "
                variant="ghost"
                size="icon"
              >
                {{ page }}
              </Button>
              <span
                v-else
                class="w-10 h-10 flex items-center justify-center"
              >
                ...
              </span>
            </template>

            <Button
              @click="changePage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              variant="ghost"
              size="icon"
            >
              <ChevronRight class="h-4 w-4" />
            </Button>
          </nav>
        </div>
      </main>
    </div>
  </div>

  <!-- 删除确认对话框 -->
  <AlertDialog
    :open="isDeleteDialogOpen"
    @update:open="isDeleteDialogOpen = $event"
  >
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>删除确认</AlertDialogTitle>
        <AlertDialogDescription>
          确定要删除作品"{{ workToDelete?.title }}"吗？此操作不可恢复。
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel @click="isDeleteDialogOpen = false"
          >取消</AlertDialogCancel
        >
        <AlertDialogAction @click="confirmDelete">确定</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { deleteArticle, getMyArticles } from '@/api/article'
import { getCurrentInstance } from 'vue'
import { Eye, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import type { Article, MyArticlesResponse } from '@/api/article/type'
const { proxy } = getCurrentInstance() as any

interface WorkItem {
  id: string
  title: string
  description: string
  image: string
  status: number // 0: 草稿，1: 发布
  date: string
  likes: number
  tags: string[]
}

// 路由
const router = useRouter()

// 搜索和筛选状态
const searchQuery = ref('')
const selectedStatus = ref('all')

// 分页状态
const currentPage = ref(1)
const totalPages = ref(1)
const totalItems = ref(0)
const itemsPerPage = ref(10)

// 作品数据
const works = ref<WorkItem[]>([])

// 加载作品数据
const loadWorks = async () => {
  try {
    const params: {
      page: number
      limit: number
      keyword?: string
      state?: number
    } = {
      page: currentPage.value,
      limit: itemsPerPage.value
    }
    if (searchQuery.value) {
      params.keyword = searchQuery.value
    }

    if (selectedStatus.value !== 'all') {
      params.state = selectedStatus.value === 'published' ? 1 : 0
    }

    const response: MyArticlesResponse = await getMyArticles(params)

    if (response.code === 200) {
      const articles = response.data?.data || []
      works.value = articles.map((article: Article) => ({
        id: article.id,
        title: article.title,
        description: article.content.substring(0, 100) + '...',
        image:
          article.images && article.images.length > 0 ? article.images[0] : '',
        status: article.status,
        date: new Date(article.create_time).toLocaleDateString(),
        likes: article.likes || 0,
        tags: article.tags || []
      }))

      // 更新分页信息
      totalItems.value = response.data?.total || 0
      totalPages.value = Math.ceil(totalItems.value / itemsPerPage.value)
    } else {
      ElMessage.error('获取作品列表失败: ' + response.message)
    }
  } catch (error) {
    ElMessage.error('获取作品列表失败')
    console.error(error)
  }
}

onMounted(() => {
  loadWorks()
})

const applyFilters = () => {
  // 重置到第一页
  currentPage.value = 1
  loadWorks()
}

// 分页相关方法
const changePage = (page: number) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  loadWorks()
}

// 生成分页列表
const pageList = computed(() => {
  const pages: (number | string)[] = []
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 7) {
    // 如果总页数小于等于7，显示所有页码
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // 如果总页数大于7，需要省略部分页码
    if (current <= 4) {
      // 当前页在前4页
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      // 当前页在后4页
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      // 当前页在中间
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }

  return pages
})

const getStatusClass = (status: number) => {
  switch (status) {
    case 1: // 已发布
      return 'bg-success'
    case 0: // 草稿
      return 'bg-warning'
    default:
      return 'bg-gray-400'
  }
}

// 获取状态显示文本
const getStatusText = (status: number) => {
  switch (status) {
    case 1:
      return '已发布'
    case 0:
      return '草稿'
    default:
      return '未知'
  }
}

// 查看作品
const viewWork = (id: string) => {
  router.push(`/post/${id}`)
}

// 编辑作品
const editWork = (id: string) => {
  router.push(`/publish/${id}`)
}

// 删除作品相关的状态
const workToDelete = ref<{ id: string; title: string } | null>(null)
const isDeleteDialogOpen = ref(false)

// 删除作品
const deleteWork = (id: string, title: string) => {
  workToDelete.value = { id, title }
  isDeleteDialogOpen.value = true
}

const confirmDelete = async () => {
  if (!workToDelete.value) return

  try {
    const response = await deleteArticle({
      articleId: workToDelete.value.id
    })
    if (response.code === 200) {
      ElMessage.success('作品删除成功')
      // 重新加载数据以更新分页信息
      loadWorks()
    } else {
      ElMessage.error('删除失败: ' + response.message)
    }
  } catch (error) {
    console.error(error)
  } finally {
    isDeleteDialogOpen.value = false
    workToDelete.value = null
  }
}

// 图片加载失败的状态管理
const imageLoadFailed = ref<Record<string, boolean>>({})

// 处理图片加载失败
const handleImageError = (workId: string) => {
  imageLoadFailed.value[workId] = true
}
</script>

<style lang="scss" scoped>
.content-auto {
  content-visibility: auto;
}
.card-hover {
  @apply transition-all duration-300 hover:-translate-y-1 hover:shadow-lg;
}
</style>
