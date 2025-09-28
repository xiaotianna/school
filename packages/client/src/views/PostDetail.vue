<template>
  <div class="w-full h-screen flex flex-col">
    <div class="flex-1 overflow-hidden">
      <div class="w-full h-full grid grid-cols-1 md:grid-cols-3 gap-0">
        <!-- 左侧内容 -->
        <div
          class="col-span-2 overflow-auto px-4 pt-4 pb-8 flex flex-col items-center gap-4"
        >
          <header class="w-full px-4 flex gap-4">
            <button
              class="text-sm text-gray-600 hover:text-gray-900"
              @click="goBack"
            >
              <ChevronLeft />
            </button>
            <!-- 文章标题 -->
            <div class="text-lg font-semibold">{{ post.title || '' }}</div>
          </header>
          <div
            v-if="loading"
            class="flex gap-3 max-w-[80%] w-full pt-6"
          >
            <Skeleton class="w-10 h-10 rounded-full bg-gray-200" />
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <Skeleton class="h-4 w-16 bg-gray-200" />
                <span class="text-xs text-gray-400">·</span>
                <Skeleton class="h-3 w-20 bg-gray-200" />
              </div>
              <div class="mt-1 flex items-center gap-1">
                <Heart
                  :size="18"
                  class="fill-red-500 stroke-transparent stroke-0"
                />
                <Skeleton class="h-3 w-6 bg-gray-200" />
              </div>
              <div class="mt-3 space-y-2">
                <Skeleton class="h-4 w-full bg-gray-200" />
                <Skeleton class="h-4 w-full bg-gray-200" />
                <Skeleton class="h-4 w-full bg-gray-200" />
                <Skeleton class="h-4 w-[90%] bg-gray-200" />
              </div>
            </div>
          </div>
          <div
            v-else-if="error"
            class="flex justify-center items-center h-full"
          >
            <div class="text-red-500">{{ error }}</div>
          </div>
          <div
            v-else
            class="flex gap-3 w-full max-w-[80%] pt-6"
          >
            <img
              v-if="post.imgUrl && !post.isAnonymous"
              :src="proxy.$baseUrl + post.imgUrl"
              class="w-10 h-10 rounded-full object-cover cursor-pointer"
              @click="goProfile(post.userId)"
            />
            <div
              v-else
              class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500"
            >
              {{ post.isAnonymous ? '匿' : (post.username?.[0] ?? 'U') }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <span class="text-sm font-medium">{{
                  post.isAnonymous ? '匿名用户' : post.username || 'User'
                }}</span>
                <span class="text-xs text-gray-400">·</span>
                <span class="text-xs text-gray-400">{{
                  formatTime(post.create_time)
                }}</span>
              </div>
              <div
                class="mt-1 text-xs w-fit text-gray-500 flex items-center gap-1 cursor-pointer select-none"
                @click="toggleLike"
              >
                <Heart
                  v-if="post.isLike"
                  :size="18"
                  class="fill-red-500 stroke-transparent stroke-0"
                />
                <Heart
                  v-else
                  :size="18"
                />
                <span class="text-base">{{ post.likes ?? 0 }}</span>
              </div>
              <div
                class="mt-3 whitespace-pre-wrap break-words leading-7 text-[15px] text-gray-800 w-full"
              >
                <!-- {{ post.content }} -->
                <!-- 内容渲染 -->
                <div
                  ref="aiEditorRef"
                  class="w-full"
                >
                  <div class="aie-container !border-none">
                    <div class="aie-container-main"></div>
                    <div class="aie-container-header hidden"></div>
                    <div class="aie-container-footer hidden"></div>
                  </div>
                </div>
              </div>

              <!-- 图片 -->
              <div
                v-if="post.images && post.images.length"
                class="mt-3 masonry"
              >
                <img
                  v-for="(img, idx) in post.images"
                  :key="idx"
                  :src="proxy.$baseUrl + img"
                  class="masonry-item rounded object-cover w-full cursor-pointer"
                  @click="openImageModal(idx)"
                />
              </div>

              <!-- tag -->
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
            </div>
          </div>
        </div>
        <!-- 右侧评论 -->
        <div class="border-l flex flex-col h-screen">
          <h2 class="text-sm font-medium p-4 pb-0">评论</h2>
          <div class="flex-1 overflow-auto p-4">
            <div
              v-if="comments && comments.length"
              class="space-y-5"
            >
              <CommentItem
                v-for="comment in comments"
                :key="comment.id"
                :comment="comment"
                @reply="handleReplyToComment"
              />
            </div>
            <div
              v-else
              class="text-xs text-gray-400"
            >
              暂无评论
            </div>
          </div>

          <!-- 回复评论信息展示 -->
          <div
            v-if="replyToComment"
            class="px-4 py-2 bg-blue-50 border-t border-b border-blue-100 text-sm"
          >
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-2">
                <span class="text-blue-600"
                  >回复 {{ replyToComment.user.username }}:</span
                >
                <span class="text-gray-500 truncate max-w-[120px]">{{
                  replyToComment.content
                }}</span>
              </div>
              <button
                @click="cancelReply"
                class="text-gray-400 hover:text-gray-600"
              >
                <X class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- 评论输入框 -->
          <div class="p-2 border-t flex gap-2">
            <Input
              v-model="commentInput"
              placeholder="输入评论..."
              class="flex-1"
              @keyup.enter="submitComment"
            />
            <Button
              @click="submitComment"
              :disabled="!commentInput.trim()"
              >发送</Button
            >
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 图片查看模态框 -->
  <div
    v-if="isImageModalOpen"
    class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
    @click="closeImageModal"
  >
    <div
      class="relative max-w-4xl max-h-full"
      @click.stop
    >
      <!-- 关闭按钮 -->
      <button
        class="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 z-10"
        @click="closeImageModal"
      >
        <X class="w-6 h-6" />
      </button>

      <!-- 左右切换按钮 -->
      <button
        v-if="post.images && post.images.length > 1 && currentImageIndex > 0"
        class="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
        @click="prevImage"
      >
        <ChevronLeft class="w-6 h-6" />
      </button>

      <button
        v-if="
          post.images &&
          post.images.length > 1 &&
          currentImageIndex < post.images.length - 1
        "
        class="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
        @click="nextImage"
      >
        <ChevronRight class="w-6 h-6" />
      </button>

      <!-- 图片计数 -->
      <div
        v-if="post.images && post.images.length > 1"
        class="absolute top-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 rounded-full px-3 py-1 text-sm"
      >
        {{ currentImageIndex + 1 }} / {{ post.images.length }}
      </div>

      <!-- 图片 -->
      <img
        v-if="post.images && post.images.length"
        :src="proxy.$baseUrl + post.images[currentImageIndex]"
        class="max-w-full max-h-[90vh] object-contain"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, getCurrentInstance, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CommentItem from '@/components/CommentItem.vue'
import { ChevronLeft, ChevronRight, X, Heart } from 'lucide-vue-next'
import { getArticleDetail, reqComment, reqLike } from '@/api/article'
import type { ArticleDetailResponse, Comment } from '@/api/article/type'
import { formatTime } from '@/utils/formatTime'
import { AiEditor } from 'aieditor'
import 'aieditor/dist/style.css'
import { nextTick } from 'vue'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ElMessage } from 'element-plus'
import { sortCommentsByHierarchy } from '@/utils/comment'
import { useThrottleFn } from '@vueuse/core'
const { proxy } = getCurrentInstance() as any

const route = useRoute()
const router = useRouter()

type PostItem = {
  articleId: string
  userId: string
  username: string
  imgUrl: string
  // 是否匿名
  isAnonymous: boolean
  title: string
  content: string
  images?: string[]
  tags?: string[]
  create_time: string | number | Date
  likes: number
  isLike: boolean
}

// 文章数据
const post = ref<PostItem>({} as PostItem)
// 评论数据
const comments = ref<Comment[]>([])
const loading = ref(true)
// 错误信息
const error = ref('')

const aiEditorRef = ref<HTMLElement | null>(null)
let editorInstance = ref<AiEditor | null>(null)

onMounted(async () => {
  await fetchArticleDetail()
  nextTick(() => {
    if (aiEditorRef.value) {
      editorInstance.value = new AiEditor({
        element: aiEditorRef.value,
        editable: false,
        content: post.value.content
      })
    }
  })
})

// 获取文章详情
const fetchArticleDetail = async () => {
  try {
    loading.value = true
    error.value = ''
    const articleId = route.params.id as string
    const res: ArticleDetailResponse = await getArticleDetail(articleId)
    if (res.code === 200) {
      const data = res.data
      // 初始化文章数据
      post.value = {
        articleId: data.id,
        userId: data.author.id,
        username: data.author.username,
        imgUrl: data.author.imgUrl,
        isAnonymous: data.author.isAnonymous,
        title: data.title,
        content: data.content,
        images: data.images,
        tags: data.tags,
        create_time: data.create_time,
        isLike: data.isLike,
        likes: data.likes
      }
      // 初始化评论数据
      comments.value = sortCommentsByHierarchy(data.comments)
    } else {
      error.value = '获取文章详情失败'
    }
  } catch (err) {
    console.error('获取文章详情失败:', err)
    error.value = '获取文章详情失败'
  } finally {
    loading.value = false
  }
}

// 点赞（需要做防抖处理）
const toggleLike = useThrottleFn(async () => {
  try {
    const articleId = route.params.id as string
    let res = await reqLike(articleId)
    if (res.code === 200) {
      const isLiked = res.data.isLiked
      post.value.isLike = isLiked
      if (isLiked) {
        post.value.likes += 1
      } else {
        post.value.likes -= 1
      }
    }
  } catch (error) {
    console.error('点赞失败:', error)
    ElMessage.error('点赞失败')
  }
}, 1000)

const commentInput = ref('')
const replyToComment = ref<Comment | null>(null)

// 处理回复评论
function handleReplyToComment(comment: Comment) {
  replyToComment.value = comment
  // 滚动到评论输入框
  nextTick(() => {
    const commentInput = document.querySelector('.border-t.flex.gap-2')
    if (commentInput) {
      commentInput.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  })
}

// 取消回复
function cancelReply() {
  replyToComment.value = null
}

// 提交评论
const submitComment = async () => {
  if (!commentInput.value.trim()) return ElMessage.warning('请输入评论内容')
  // 文章id
  const { articleId } = post.value
  // 评论内容
  const content = commentInput.value.trim()
  try {
    let res = await reqComment({
      content,
      articleId: articleId,
      replyCommentId: replyToComment.value?.id
    })
    if (res.code === 200) {
      // 更新评论列表（不采用重新请求的方式）
      comments.value = sortCommentsByHierarchy([...comments.value, res.data])
      // 清空输入框
      commentInput.value = ''
      cancelReply()
      ElMessage.success('评论成功')
    }
  } catch (error) {
    console.log(error)
    ElMessage.error('评论失败')
    return
  }
}

function goBack() {
  router.back()
}

// 跳转到用户主页
function goProfile(userId: string | number | undefined) {
  if (userId) {
    router.push({
      name: 'UserProfile',
      params: { id: String(userId) }
    })
  }
}

// 图片查看模态框相关数据
const isImageModalOpen = ref(false)
const currentImageIndex = ref(0)

// 打开图片查看模态框
const openImageModal = (index: number) => {
  currentImageIndex.value = index
  isImageModalOpen.value = true
  // 禁止背景滚动
  document.body.style.overflow = 'hidden'
}

// 关闭图片查看模态框
const closeImageModal = () => {
  isImageModalOpen.value = false
  // 恢复背景滚动
  document.body.style.overflow = ''
}

// 切换到上一张图片
const prevImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
  }
}

// 切换到下一张图片
const nextImage = () => {
  if (
    post.value.images &&
    currentImageIndex.value < post.value.images.length - 1
  ) {
    currentImageIndex.value++
  }
}

// 键盘事件处理
const handleKeydown = (event: KeyboardEvent) => {
  if (!isImageModalOpen.value) return

  switch (event.key) {
    case 'Escape':
      closeImageModal()
      break
    case 'ArrowLeft':
      prevImage()
      break
    case 'ArrowRight':
      nextImage()
      break
  }
}

// 添加键盘事件监听
onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

// 组件卸载时移除事件监听
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.masonry {
  column-count: 1;
  column-gap: 8px;
}
@media (min-width: 768px) {
  .masonry {
    column-count: 2;
  }
}
@media (min-width: 1024px) {
  .masonry {
    column-count: 3;
  }
}
.masonry-item {
  width: 100%;
  display: inline-block;
  margin-bottom: 8px;
}
</style>
