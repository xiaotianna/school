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
                placeholder="搜索作品名称、描述或标签..."
                v-model="searchQuery"
              >
              </Input>
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
              <Select v-model="selectedCategory">
                <SelectTrigger class="w-[180px]">
                  <SelectValue placeholder="所有分类" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">所有分类</SelectItem>
                    <SelectItem value="design">设计</SelectItem>
                    <SelectItem value="development">开发</SelectItem>
                    <SelectItem value="writing">写作</SelectItem>
                    <SelectItem value="video">视频</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Select v-model="selectedStatus">
                <SelectTrigger class="w-[180px]">
                  <SelectValue placeholder="所有状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">所有状态</SelectItem>
                    <SelectItem value="published">已发布</SelectItem>
                    <SelectItem value="draft">草稿</SelectItem>
                    <SelectItem value="archived">已归档</SelectItem>
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
            v-for="work in filteredWorks"
            :key="work.id"
            class="bg-white rounded-lg overflow-hidden shadow-md card-hover"
          >
            <div class="relative">
              <img
                :src="work.image"
                :alt="work.title"
                class="w-full h-48 object-cover"
              />
              <span
                class="absolute top-3 left-3 text-white text-xs px-2 py-1 rounded-full"
                :class="getStatusClass(work.status)"
              >
                {{ getStatusText(work.status) }}
              </span>
            </div>
            <div class="p-5">
              <div class="flex justify-between items-start mb-3">
                <h3 class="font-bold text-lg">{{ work.title }}</h3>
                <div class="text-sm">{{ work.date }}</div>
              </div>
              <p class="text-gray-600 text-sm mb-4 line-clamp-2">
                {{ work.description }}
              </p>

              <div class="flex flex-wrap gap-2 mb-4">
                <span
                  v-for="tag in work.tags"
                  :key="tag"
                  class="text-xs px-2 py-1 rounded-full"
                  :class="getTagClass(tag)"
                >
                  {{ tag }}
                </span>
              </div>

              <div class="flex justify-between items-center">
                <div class="flex items-center text-sm">
                  <span class="flex items-center mr-3"
                    ><i class="fa fa-eye mr-1"></i> {{ work.views }}</span
                  >
                  <span class="flex items-center"
                    ><i class="fa fa-heart-o mr-1"></i> {{ work.likes }}</span
                  >
                </div>

                <div class="flex gap-2">
                  <button
                    class="hover:text-primary transition-colors"
                    title="编辑"
                  >
                    <i class="fa fa-pencil"></i>
                  </button>
                  <button
                    class="hover:text-danger transition-colors"
                    title="删除"
                  >
                    <i class="fa fa-trash-o"></i>
                  </button>
                  <button
                    class="hover:text-gray-800 transition-colors"
                    title="更多选项"
                  >
                    <i class="fa fa-ellipsis-v"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 分页 -->
        <div class="mt-8 flex justify-center">
          <nav class="flex items-center space-x-1">
            <button
              class="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <i class="fa fa-chevron-left text-xs"></i>
            </button>
            <button
              class="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-white"
            >
              1
            </button>
            <button
              class="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              2
            </button>
            <button
              class="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              3
            </button>
            <span class="w-10 h-10 flex items-center justify-center">...</span>
            <button
              class="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              8
            </button>
            <button
              class="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <i class="fa fa-chevron-right text-xs"></i>
            </button>
          </nav>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
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

// 定义作品数据类型
interface WorkItem {
  id: number
  title: string
  description: string
  image: string
  status: 'published' | 'draft' | 'archived'
  date: string
  views: number
  likes: number
  tags: string[]
  category: string
}

// 搜索和筛选状态
const searchQuery = ref('')
const selectedCategory = ref('all')
const selectedStatus = ref('all')

// 作品数据
const works = ref<WorkItem[]>([
  {
    id: 1,
    title: '自然摄影作品集',
    description:
      '一组展示大自然美丽风光的摄影作品，包含山川、河流和野生动物等主题。',
    image: 'https://picsum.photos/id/1025/600/400',
    status: 'published',
    date: '2023-05-12',
    views: 1243,
    likes: 86,
    tags: ['摄影', '自然', '户外'],
    category: 'design'
  },
  {
    id: 2,
    title: '电子商务网站设计',
    description:
      '为时尚品牌设计的响应式电子商务网站，包含产品展示、购物车和支付流程。',
    image: 'https://picsum.photos/id/180/600/400',
    status: 'published',
    date: '2023-06-24',
    views: 2567,
    likes: 156,
    tags: ['UI设计', '电商', '响应式'],
    category: 'design'
  },
  {
    id: 3,
    title: '移动应用原型设计',
    description:
      '健康追踪应用的交互原型设计，包含用户仪表盘、数据统计和目标设置功能。',
    image: 'https://picsum.photos/id/48/600/400',
    status: 'draft',
    date: '2023-07-08',
    views: 789,
    likes: 42,
    tags: ['UX设计', '移动应用', '健康'],
    category: 'design'
  },
  {
    id: 4,
    title: '企业品牌重塑',
    description:
      '为科技公司进行的品牌重塑项目，包括Logo设计、色彩系统和品牌指南。',
    image: 'https://picsum.photos/id/0/600/400',
    status: 'published',
    date: '2023-04-15',
    views: 3120,
    likes: 215,
    tags: ['品牌设计', 'Logo', '企业'],
    category: 'design'
  },
  {
    id: 5,
    title: '旅行博客文章集',
    description:
      '记录亚洲各地旅行体验的博客文章合集，包含景点推荐、美食体验和旅行攻略。',
    image: 'https://picsum.photos/id/96/600/400',
    status: 'archived',
    date: '2023-03-22',
    views: 5642,
    likes: 328,
    tags: ['写作', '旅行', '博客'],
    category: 'writing'
  },
  {
    id: 6,
    title: '短视频制作集锦',
    description: '为社交媒体平台制作的短视频合集，包含产品展示和品牌宣传内容。',
    image: 'https://picsum.photos/id/160/600/400',
    status: 'draft',
    date: '2023-07-15',
    views: 987,
    likes: 56,
    tags: ['视频', '剪辑', '营销'],
    category: 'video'
  }
])

// 筛选后的作品数据
const filteredWorks = computed(() => {
  return works.value.filter((work) => {
    // 搜索过滤
    const matchesSearch =
      !searchQuery.value ||
      work.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      work.description
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase()) ||
      work.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.value.toLowerCase())
      )

    // 分类过滤
    const matchesCategory =
      selectedCategory.value === 'all' ||
      work.category === selectedCategory.value

    // 状态过滤
    const matchesStatus =
      selectedStatus.value === 'all' || work.status === selectedStatus.value

    return matchesSearch && matchesCategory && matchesStatus
  })
})

// 应用筛选条件
const applyFilters = () => {
  // 这里可以添加额外的筛选逻辑
  console.log('应用筛选条件:', {
    search: searchQuery.value,
    category: selectedCategory.value,
    status: selectedStatus.value
  })
}

// 获取状态对应的CSS类
const getStatusClass = (status: string) => {
  switch (status) {
    case 'published':
      return 'bg-success'
    case 'draft':
      return 'bg-warning'
    case 'archived':
      return 'bg-gray-600'
    default:
      return 'bg-gray-400'
  }
}

// 获取状态显示文本
const getStatusText = (status: string) => {
  switch (status) {
    case 'published':
      return '已发布'
    case 'draft':
      return '草稿'
    case 'archived':
      return '已归档'
    default:
      return status
  }
}

// 获取标签的CSS类
const getTagClass = (tag: string) => {
  const tagClasses: Record<string, string> = {
    摄影: 'bg-blue-50 text-blue-600',
    自然: 'bg-green-50 text-green-600',
    户外: 'bg-purple-50 text-purple-600',
    UI设计: 'bg-blue-50 text-blue-600',
    电商: 'bg-indigo-50 text-indigo-600',
    响应式: 'bg-teal-50 text-teal-600',
    UX设计: 'bg-pink-50 text-pink-600',
    移动应用: 'bg-red-50 text-red-600',
    健康: 'bg-green-50 text-green-600',
    品牌设计: 'bg-yellow-50 text-yellow-600',
    Logo: 'bg-blue-50 text-blue-600',
    企业: 'bg-gray-50 text-gray-600',
    写作: 'bg-indigo-50 text-indigo-600',
    旅行: 'bg-green-50 text-green-600',
    博客: 'bg-orange-50 text-orange-600',
    视频: 'bg-red-50 text-red-600',
    剪辑: 'bg-purple-50 text-purple-600',
    营销: 'bg-blue-50 text-blue-600'
  }

  return tagClasses[tag] || 'bg-gray-100 text-gray-800'
}
</script>

<style scoped>
.content-auto {
  content-visibility: auto;
}
.card-hover {
  @apply transition-all duration-300 hover:-translate-y-1 hover:shadow-lg;
}
</style>
