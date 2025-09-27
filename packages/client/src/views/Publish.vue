<template>
  <div class="w-full h-screen flex flex-col">
    <!-- 标题输入框和按钮区域 -->
    <div class="p-4 border-b flex items-center space-x-4">
      <button
        class="text-sm text-gray-600 hover:text-gray-900"
        @click="goBack"
      >
        <ChevronLeft />
      </button>
      <div class="flex-1 relative">
        <input
          v-model="title"
          type="text"
          placeholder="请输入标题"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          :maxlength="maxTitleLength"
        />
        <div
          class="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500"
        >
          {{ title.length }}/{{ maxTitleLength }}
        </div>
      </div>
      <button
        @click="handleSaveDraft"
        class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors whitespace-nowrap"
      >
        保存草稿
      </button>
      <button
        @click="handlePublish"
        class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors whitespace-nowrap"
      >
        {{ id ? '更新' : '发布' }}
      </button>
    </div>

    <!-- 主体内容区域 - 左右结构 -->
    <div class="flex flex-1 overflow-hidden">
      <!-- 左侧：富文本编辑器 -->
      <div class="w-2/3 border-r">
        <div
          ref="aiEditor"
          class="h-full"
        />
      </div>

      <!-- 右侧：图片上传列表 -->
      <div class="w-1/3 p-4 overflow-y-auto">
        <h3 class="text-lg font-semibold mb-4">标签选择</h3>
        <div class="space-y-3 mb-6">
          <!-- 标签输入区域 -->
          <div
            v-if="tags.length"
            class="flex flex-wrap gap-2 mb-2"
          >
            <span
              v-for="(tag, index) in tags"
              :key="index"
              class="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
            >
              {{ tag }}
              <button
                @click="removeTag(index)"
                class="ml-1 text-blue-600 hover:text-blue-900"
              >
                ×
              </button>
            </span>
          </div>
          <div class="flex">
            <input
              v-model="newTag"
              type="text"
              placeholder="输入标签，按回车添加"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              @keyup.enter="addTag"
            />
            <button
              @click="addTag"
              class="px-3 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 transition-colors"
            >
              添加
            </button>
          </div>
          <p class="text-xs text-gray-500">
            最多可添加5个标签，每个标签不超过10个字符
          </p>
        </div>

        <h3 class="text-lg font-semibold mb-4">图片上传</h3>

        <!-- 图片上传区域 -->
        <div
          class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors mb-4"
          @click="triggerImageUpload"
        >
          <div class="text-gray-500 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p class="text-gray-500 text-sm">点击上传图片</p>
          <p class="text-gray-400 text-xs mt-1">支持 JPG, PNG, GIF 格式</p>
          <input
            ref="imageInputRef"
            type="file"
            accept="image/*"
            multiple
            class="hidden"
            @change="handleImageUpload"
          />
        </div>

        <!-- 图片列表 -->
        <div class="space-y-3">
          <div
            v-for="(image, index) in uploadedImages"
            :key="index"
            class="flex items-center p-2 border rounded-lg"
          >
            <div class="relative w-16 h-16">
              <img
                :src="image.previewUrl"
                :alt="image.name"
                class="w-16 h-16 object-cover rounded-md"
              />
              <!-- Loading 遮罩 -->
              <div
                v-if="image.status === 'loading'"
                class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md"
              >
                <div
                  class="animate-spin rounded-full h-6 w-6 border-b-2 border-white"
                ></div>
              </div>

              <!-- Error 遮罩 -->
              <div
                v-else-if="image.status === 'error'"
                class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>

            <div class="ml-3 flex-1 min-w-0">
              <p class="text-sm font-medium truncate">{{ image.name }}</p>
              <p class="text-xs text-gray-500">
                {{ image.size && formatFileSize(image.size) }}
              </p>
              <!-- 状态文字提示 -->
              <p
                v-if="image.status === 'loading'"
                class="text-xs text-blue-500"
              >
                上传中...
              </p>
              <p
                v-else-if="image.status === 'error'"
                class="text-xs text-red-500"
              >
                上传失败
              </p>
            </div>
            <button
              @click="removeImage(index)"
              class="text-red-500 hover:text-red-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- 上传提示 -->
        <div
          v-if="uploadedImages.length === 0"
          class="text-center py-8 text-gray-500"
        >
          <p>暂无上传的图片</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AiEditor } from 'aieditor'
import 'aieditor/dist/style.css'
import { ChevronLeft } from 'lucide-vue-next'
import { onMounted, ref, getCurrentInstance, onUnmounted } from 'vue'
import {
  uploadImages,
  saveDraft,
  publishArticle,
  getArticleDetail,
  updateArticle,
  updateDraft
} from '@/api/article'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
const { proxy } = getCurrentInstance() as any
const router = useRouter()
const route = useRoute()

const { id } = route.params

const aiEditor = ref<HTMLElement | null>(null)
const title = ref('')
const imageInputRef = ref<HTMLInputElement | null>(null)
const newTag = ref('') // 新标签输入
const tags = ref<string[]>([]) // 标签数组

// 标题最大长度
const maxTitleLength = 20

// 添加内容保存状态跟踪
const isContentSaved = ref(true)

interface UploadedImage {
  file?: File
  name: string
  size?: number
  previewUrl: string
  status: 'loading' | 'success' | 'error'
}

const uploadedImages = ref<UploadedImage[]>([])

let editorInstance = ref<AiEditor | null>(null)

onMounted(() => {
  if (aiEditor.value) {
    editorInstance.value = new AiEditor({
      element: aiEditor.value,
      placeholder: '点击输入内容...',
      toolbarExcludeKeys: [
        'brush',
        'eraser',
        'todo',
        'image',
        'video',
        'attachment',
        'source-code',
        'printer',
        'fullscreen',
        'ai',
        'indent-decrease',
        'indent-increase',
        'break',
        'align',
        'subscript',
        'superscript',
        'emoji'
      ],
      onChange: () => {
        // 当编辑器内容发生变化时，标记为未保存
        isContentSaved.value = false
      },
      onCreated: (aiEditor) => {
        id && initArticle(aiEditor)
      }
    })
  }

  window.addEventListener('beforeunload', beforeUnloadHandler)
})

const initArticle = async (aiEditorInstance: AiEditor) => {
  let res = await getArticleDetail(id as string)
  if (res.code === 200) {
    const { title: resTitle, content, tags: resTags, images } = res.data
    // 初始化标题
    title.value = resTitle
    // 初始化编辑器内容
    aiEditorInstance?.setContent(content)
    // 初始化tag
    tags.value = resTags || []
    // 初始化图片列表
    uploadedImages.value =
      images.map((url) => {
        return {
          name: url.split('/').pop() as string,
          previewUrl: proxy.$baseUrl + url,
          status: 'success'
        }
      }) || []
  }
}

onUnmounted(() => {
  window.removeEventListener('beforeunload', beforeUnloadHandler)
})

const beforeUnloadHandler = (e: BeforeUnloadEvent) => {
  if (!isContentSaved.value) {
    e.preventDefault()
    return '您有未保存的内容，确定要离开吗？'
  }
}

const goBack = () => {
  if (!isContentSaved.value) {
    const confirmed = confirm('您有未保存的内容，确定要离开吗？')
    if (!confirmed) {
      return
    }
  }
  router.back()
}

const handleSaveDraft = async () => {
  if (!title.value || !editorInstance.value?.getHtml()) {
    ElMessage.error('请填写标题和内容')
    return
  }
  try {
    const articleData = {
      title: title.value,
      content: editorInstance.value?.getHtml() || '',
      images: uploadedImages.value
        .filter((img) => img.status === 'success')
        .map((img) => img.previewUrl.replace(proxy.$baseUrl, '')),
      tags: tags.value,
      status: 0 // 草稿状态
    }
    let response
    if (id) {
      response = await updateDraft(id as string, articleData)
    } else {
      response = await saveDraft(articleData)
    }
    if (response.code === 200) {
      isContentSaved.value = true
      ElMessage.success(`草稿${ id ? '更新' : '保存' }成功`)
      router.back()
    } else {
      ElMessage.error(`草稿${ id ? '更新' : '保存' }失败`)
      console.error(`草稿${ id ? '更新' : '保存' }失败:`, response.message)
    }
  } catch (error) {
    ElMessage.error(`草稿${ id ? '更新' : '保存' }失败`)
    console.error(`草稿${ id ? '更新' : '保存' }失败:`, error)
  }
}

const handlePublish = async () => {
  if (!title.value || !editorInstance.value?.getHtml()) {
    ElMessage.error('请填写标题和内容')
    return
  }
  try {
    // 准备文章数据
    const articleData = {
      title: title.value,
      content: editorInstance.value?.getHtml() || '',
      images: uploadedImages.value
        .filter((img) => img.status === 'success')
        .map((img) => img.previewUrl.replace(proxy.$baseUrl, '')),
      tags: tags.value,
      status: 1 // 发布状态
    }

    let response
    if (id) {
      response = await updateArticle(id as string, articleData)
    } else {
      response = await publishArticle(articleData)
    }
    if (response.code === 200) {
      isContentSaved.value = true
      ElMessage.success(`文章${ id ? '更新' : '发布' }成功`)
      router.replace(`/post/${response.data.id}`)
    } else {
      console.error(`文章${ id ? '更新' : '发布' }失败:`, response.message)
      ElMessage.error(`文章${ id ? '更新' : '发布' }失败`)
    }
  } catch (error) {
    console.error(`文章${ id ? '更新' : '发布' }失败:`, error)
    ElMessage.error(`文章${ id ? '更新' : '发布' }失败`)
  }
}

// 触发图片上传
const triggerImageUpload = () => {
  imageInputRef.value?.click()
}

// 处理图片上传
const handleImageUpload = async (e: Event) => {
  const input = e.target as HTMLInputElement
  const files = input.files

  if (files && files.length > 0) {
    isContentSaved.value = false
    const startIndex = uploadedImages.value.length
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (file.type.startsWith('image/')) {
        const previewUrl = URL.createObjectURL(file)
        uploadedImages.value.push({
          file,
          name: file.name,
          size: file.size,
          previewUrl,
          status: 'loading'
        })
      }
    }
    const formData = new FormData()
    const validFiles = Array.from(files).filter((file) =>
      file.type.startsWith('image/')
    )
    validFiles.forEach((file) => {
      formData.append('files', file)
    })

    try {
      const response = await uploadImages(formData)
      if (response.status) {
        const uploadedUrls = response.data.urls.map(
          (item: string) => proxy.$baseUrl + item
        )
        validFiles.forEach((_file, index) => {
          const imageIndex = startIndex + index
          if (imageIndex < uploadedImages.value.length) {
            if (index < uploadedUrls.length && uploadedUrls[index]) {
              uploadedImages.value[imageIndex].previewUrl = uploadedUrls[index]
              uploadedImages.value[imageIndex].status = 'success'
            } else {
              uploadedImages.value[imageIndex].status = 'error'
            }
          }
        })
      } else {
        for (let i = startIndex; i < uploadedImages.value.length; i++) {
          uploadedImages.value[i].status = 'error'
        }
      }
    } catch (error) {
      console.error('图片上传失败:', error)
      for (let i = startIndex; i < uploadedImages.value.length; i++) {
        uploadedImages.value[i].status = 'error'
      }
    }
  }
  input.value = ''
}

// 移除图片
const removeImage = (index: number) => {
  URL.revokeObjectURL(uploadedImages.value[index].previewUrl)
  uploadedImages.value.splice(index, 1)
  isContentSaved.value = false
}

// 添加标签
const addTag = () => {
  const tag = newTag.value.trim()
  if (
    tag &&
    !tags.value.includes(tag) &&
    tags.value.length <= 5 &&
    tag.length <= 10
  ) {
    tags.value.push(tag)
    newTag.value = ''
    // 标记内容为未保存
    isContentSaved.value = false
  }
}

// 移除标签
const removeTag = (index: number) => {
  tags.value.splice(index, 1)
  // 标记内容为未保存
  isContentSaved.value = false
}

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>

<style>
.aie-codeblock-tools-comments {
  display: none !important;
}
.aie-codeblock-tools-explain {
  display: none !important;
}
</style>