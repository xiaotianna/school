<template>
  <div class="w-full h-screen flex flex-col">
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

    <div class="flex flex-1 overflow-hidden">
      <div class="w-2/3 border-r">
        <div
          ref="aiEditor"
          class="h-full"
        />
      </div>

      <div class="w-1/3 p-4 overflow-y-auto space-y-6">
        <section>
          <h3 class="text-lg font-semibold mb-4">标签选择</h3>
          <div class="space-y-3">
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
            <p class="text-xs text-gray-500">最多可添加5个标签，每个标签不超过10个字符</p>
          </div>
        </section>

        <section>
          <h3 class="text-lg font-semibold mb-4">图片上传</h3>
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
                <div
                  v-if="image.status === 'loading'"
                  class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md"
                >
                  <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                </div>
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
                <p class="text-xs text-gray-500">{{ image.size && formatFileSize(image.size) }}</p>
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

          <div
            v-if="uploadedImages.length === 0"
            class="text-center py-8 text-gray-500"
          >
            <p>暂无上传的图片</p>
          </div>
        </section>

        <section
          v-if="showAiAssistant"
          class="pt-4 border-t"
        >
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-lg font-semibold">AI 助手</h3>
            <button
              class="text-xs px-2 py-1 rounded border border-gray-300 hover:bg-gray-50"
              @click="aiPanelOpen = !aiPanelOpen"
            >
              {{ aiPanelOpen ? '收起' : '展开' }}
            </button>
          </div>

          <div
            v-if="aiPanelOpen"
            class="space-y-3"
          >
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="tab in aiTabs"
                :key="tab"
                class="w-full text-xs px-2 py-2 rounded border"
                :class="activeAiTab === tab ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-300 hover:bg-gray-50'"
                @click="activeAiTab = tab"
              >
                {{ aiTabLabelMap[tab] }}
              </button>
            </div>

            <div
              v-if="activeAiTab === 'title'"
              class="space-y-2"
            >
              <button
                class="w-full px-3 py-2 text-sm rounded bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-300"
                :disabled="aiLoading.title"
                @click="handleAiTitleSuggest"
              >
                {{ aiLoading.title ? '生成中...' : '生成3个标题' }}
              </button>
              <div
                v-if="titleSuggestions.length"
                class="space-y-2"
              >
                <button
                  v-for="(item, idx) in titleSuggestions"
                  :key="idx"
                  class="w-full text-left px-2 py-2 text-sm border rounded hover:bg-gray-50"
                  @click="applyTitle(item)"
                >
                  {{ item }}
                </button>
              </div>
            </div>

            <div
              v-if="activeAiTab === 'rewrite'"
              class="space-y-2"
            >
              <div class="grid grid-cols-3 gap-2">
                <button
                  v-for="goal in rewriteGoals"
                  :key="goal"
                  class="text-xs px-2 py-2 rounded border"
                  :class="rewriteGoal === goal ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-300 hover:bg-gray-50'"
                  @click="rewriteGoal = goal"
                >
                  {{ rewriteGoalLabelMap[goal] }}
                </button>
              </div>
              <button
                class="w-full px-3 py-2 text-sm rounded bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-300"
                :disabled="aiLoading.rewrite"
                @click="handleAiRewrite"
              >
                {{ aiLoading.rewrite ? '润色中...' : '生成润色结果' }}
              </button>
              <div
                v-if="rewriteResult"
                class="space-y-2"
              >
                <div class="text-xs text-gray-500">预览（节选）</div>
                <div class="text-sm p-2 border rounded bg-gray-50 max-h-40 overflow-auto whitespace-pre-wrap">
                  {{ rewriteResult.rewritten }}
                </div>
                <button
                  class="w-full px-3 py-2 text-sm rounded border border-blue-500 text-blue-500 hover:bg-blue-50"
                  @click="applyRewrite"
                >
                  应用到正文
                </button>
              </div>
            </div>

            <div
              v-if="activeAiTab === 'tag'"
              class="space-y-2"
            >
              <button
                class="w-full px-3 py-2 text-sm rounded bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-300"
                :disabled="aiLoading.tag"
                @click="handleAiTagSuggest"
              >
                {{ aiLoading.tag ? '生成中...' : '生成标签建议' }}
              </button>
              <div
                v-if="tagSuggestions.length"
                class="flex flex-wrap gap-2"
              >
                <button
                  v-for="(tag, idx) in tagSuggestions"
                  :key="idx"
                  class="text-xs px-2 py-1 rounded-full border border-gray-300 hover:bg-gray-50"
                  @click="applyTag(tag)"
                >
                  #{{ tag }}
                </button>
              </div>
            </div>

          </div>
        </section>
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
import {
  suggestTitle,
  rewriteContentStream,
  suggestTags
} from '@/api/ai'
import type { RewriteResponse } from '@/api/ai/type'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const { proxy } = getCurrentInstance() as any
const router = useRouter()
const route = useRoute()

const { id } = route.params

const aiEditor = ref<HTMLElement | null>(null)
const title = ref('')
const imageInputRef = ref<HTMLInputElement | null>(null)
const newTag = ref('')
const tags = ref<string[]>([])

const maxTitleLength = 20
const isContentSaved = ref(true)

type AiTab = 'title' | 'rewrite' | 'tag'

type RewriteGoal = 'polish' | 'shorten' | 'expand'

const aiTabs: AiTab[] = ['title', 'rewrite', 'tag']
const aiTabLabelMap: Record<AiTab, string> = {
  title: '标题',
  rewrite: '润色',
  tag: '标签'
}

const rewriteGoals: RewriteGoal[] = ['polish', 'shorten', 'expand']
const rewriteGoalLabelMap: Record<RewriteGoal, string> = {
  polish: '润色',
  shorten: '精简',
  expand: '扩写'
}

const aiPanelOpen = ref(true)
const activeAiTab = ref<AiTab>('title')
const rewriteGoal = ref<RewriteGoal>('polish')
const aiLoading = ref({
  title: false,
  rewrite: false,
  tag: false
})
const titleSuggestions = ref<string[]>([])
const tagSuggestions = ref<string[]>([])
const rewriteResult = ref<RewriteResponse['data'] | null>(null)
const hasInitializedArticle = ref(false)
const showAiAssistant = false

interface UploadedImage {
  file?: File
  name: string
  size?: number
  previewUrl: string
  status: 'loading' | 'success' | 'error'
}

const uploadedImages = ref<UploadedImage[]>([])
let editorInstance = ref<AiEditor | null>(null)

const createEditor = (payload?: { type: 'html' | 'markdown'; value: string }) => {
  if (!aiEditor.value) return

  if (editorInstance.value && !editorInstance.value.isDestroyed()) {
    editorInstance.value.destroy()
  }

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
    textSelectionBubbleMenu: {
      enable: false
    },
    onChange: () => {
      isContentSaved.value = false
    },
    onCreated: (instance) => {
      if (payload) {
        if (payload.type === 'markdown') {
          instance.setMarkdownContent(payload.value)
        } else {
          instance.setContent(payload.value)
        }
        return
      }

      if (id && !hasInitializedArticle.value) {
        void initArticle(instance)
      }
    }
  })
}

onMounted(() => {
  createEditor()

  window.addEventListener('beforeunload', beforeUnloadHandler)
})

const initArticle = async (aiEditorInstance: AiEditor) => {
  const res = await getArticleDetail(id as string)
  if (res.code === 200 && res.data) {
    const { title: resTitle, content, tags: resTags, images } = res.data
    hasInitializedArticle.value = true
    title.value = resTitle
    aiEditorInstance.setContent(content)
    tags.value = resTags || []
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
  if (editorInstance.value && !editorInstance.value.isDestroyed()) {
    editorInstance.value.destroy()
  }
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

const getEditorContent = () => {
  return editorInstance.value?.getHtml()?.trim() || ''
}

const getEditorPlainText = () => {
  return editorInstance.value?.getText()?.trim() || ''
}

const getAiInputText = (maxLen = 1200) => {
  const plainText = getEditorPlainText()
  if (!plainText) return ''

  if (maxLen > 0 && plainText.length > maxLen) {
    ElMessage.warning(`AI 输入较长，已截断到前 ${maxLen} 字`)
    return plainText.slice(0, maxLen)
  }

  return plainText
}

const handleSaveDraft = async () => {
  const content = getEditorContent()
  if (!title.value || !content) {
    ElMessage.error('请填写标题和内容')
    return
  }
  try {
    const articleData = {
      title: title.value,
      content,
      images: uploadedImages.value
        .filter((img) => img.status === 'success')
        .map((img) => img.previewUrl.replace(proxy.$baseUrl, '')),
      tags: tags.value,
      status: 0
    }
    let response
    if (id) {
      response = await updateDraft(id as string, articleData)
    } else {
      response = await saveDraft(articleData)
    }
    if (response.code === 200) {
      isContentSaved.value = true
      ElMessage.success(`草稿${id ? '更新' : '保存'}成功`)
      router.back()
    } else {
      ElMessage.error(`草稿${id ? '更新' : '保存'}失败`)
    }
  } catch (error) {
    ElMessage.error(`草稿${id ? '更新' : '保存'}失败`)
    console.error(`草稿${id ? '更新' : '保存'}失败:`, error)
  }
}

const handlePublish = async () => {
  const content = getEditorContent()
  if (!title.value || !content) {
    ElMessage.error('请填写标题和内容')
    return
  }

  try {
    const articleData = {
      title: title.value,
      content,
      images: uploadedImages.value
        .filter((img) => img.status === 'success')
        .map((img) => img.previewUrl.replace(proxy.$baseUrl, '')),
      tags: tags.value,
      status: 1
    }

    let response
    if (id) {
      response = await updateArticle(id as string, articleData)
    } else {
      response = await publishArticle(articleData)
    }
    if (response.code === 200) {
      isContentSaved.value = true
      ElMessage.success(`文章${id ? '更新' : '发布'}成功`)
      router.replace(`/post/${response.data.id}`)
    } else {
      ElMessage.error(`文章${id ? '更新' : '发布'}失败`)
    }
  } catch (error) {
    console.error(`文章${id ? '更新' : '发布'}失败:`, error)
    ElMessage.error(`文章${id ? '更新' : '发布'}失败`)
  }
}

const handleAiTitleSuggest = async () => {
  const content = getAiInputText()
  if (!content || content.length < 10) {
    ElMessage.warning('正文至少10个字符后再生成标题')
    return
  }

  aiLoading.value.title = true
  try {
    const res = await suggestTitle({
      draftTitle: title.value,
      content,
      style: 'normal'
    })
    titleSuggestions.value = res.data?.suggestions || []
    if (!titleSuggestions.value.length) {
      ElMessage.warning('暂无可用标题建议')
    }
  } catch (error) {
    console.error('标题建议失败:', error)
    ElMessage.error('标题建议失败')
  } finally {
    aiLoading.value.title = false
  }
}

const applyTitle = (value: string) => {
  title.value = value.slice(0, 20)
  isContentSaved.value = false
  ElMessage.success('已应用标题')
}

const handleAiRewrite = async () => {
  const content = getAiInputText(0)
  if (!content || content.length < 10) {
    ElMessage.warning('正文至少10个字符后再润色')
    return
  }

  aiLoading.value.rewrite = true
  rewriteResult.value = {
    rewritten: '',
    highlights: []
  }
  try {
    const finalText = await rewriteContentStream(
      {
      title: title.value,
      content,
      goal: rewriteGoal.value,
      tone: 'normal'
      },
      (_chunk, fullText) => {
        rewriteResult.value = {
          rewritten: fullText,
          highlights: []
        }
      }
    )

    rewriteResult.value = {
      rewritten: finalText,
      highlights: []
    }
    if (!rewriteResult.value?.rewritten) {
      ElMessage.warning('未生成有效润色结果')
    }
  } catch (error) {
    console.error('正文润色失败:', error)
    ElMessage.error('正文润色失败')
  } finally {
    aiLoading.value.rewrite = false
  }
}

const applyRewrite = () => {
  if (!rewriteResult.value?.rewritten) {
    ElMessage.warning('暂无可应用内容')
    return
  }

  const rewritten = rewriteResult.value.rewritten

  try {
    createEditor({ type: 'markdown', value: rewritten })
    isContentSaved.value = false
    ElMessage.success('已应用润色结果')
  } catch (error) {
    console.error('应用润色结果失败:', error)
    ElMessage.error('应用润色结果失败，请重试')
  }
}

const handleAiTagSuggest = async () => {
  const content = getAiInputText()
  if (!content || content.length < 10) {
    ElMessage.warning('正文至少10个字符后再生成标签')
    return
  }

  aiLoading.value.tag = true
  try {
    const res = await suggestTags({
      title: title.value,
      content,
      maxTags: 5
    })
    tagSuggestions.value = res.data?.tags || []
    if (!tagSuggestions.value.length) {
      ElMessage.warning('暂无可用标签建议')
    }
  } catch (error) {
    console.error('标签建议失败:', error)
    ElMessage.error('标签建议失败')
  } finally {
    aiLoading.value.tag = false
  }
}

const applyTag = (tag: string) => {
  const normalized = tag.trim().slice(0, 10)
  if (!normalized) return
  if (tags.value.includes(normalized)) return
  if (tags.value.length >= 5) {
    ElMessage.warning('最多添加5个标签')
    return
  }
  tags.value.push(normalized)
  isContentSaved.value = false
  ElMessage.success('已添加标签')
}

const triggerImageUpload = () => {
  imageInputRef.value?.click()
}

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
      if (response.status && response.data) {
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

const removeImage = (index: number) => {
  URL.revokeObjectURL(uploadedImages.value[index].previewUrl)
  uploadedImages.value.splice(index, 1)
  isContentSaved.value = false
}

const addTag = () => {
  const tag = newTag.value.trim()
  if (
    tag &&
    !tags.value.includes(tag) &&
    tags.value.length < 5 &&
    tag.length <= 10
  ) {
    tags.value.push(tag)
    newTag.value = ''
    isContentSaved.value = false
  }
}

const removeTag = (index: number) => {
  tags.value.splice(index, 1)
  isContentSaved.value = false
}

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
