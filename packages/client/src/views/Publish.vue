<template>
  <div class="w-full h-screen flex flex-col">
    <!-- 标题输入框和按钮区域 -->
    <div class="p-4 border-b flex items-center space-x-4">
      <button
        class="text-sm text-gray-600 hover:text-gray-900"
        @click="$router.back()"
      >
        <ChevronLeft />
      </button>
      <input
        v-model="title"
        type="text"
        placeholder="请输入标题"
        class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        @click="saveDraft"
        class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors whitespace-nowrap"
      >
        保存草稿
      </button>
      <button
        @click="publish"
        class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors whitespace-nowrap"
      >
        发布
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
            <img
              :src="image.previewUrl"
              :alt="image.name"
              class="w-16 h-16 object-cover rounded-md"
            />
            <div class="ml-3 flex-1 min-w-0">
              <p class="text-sm font-medium truncate">{{ image.name }}</p>
              <p class="text-xs text-gray-500">
                {{ formatFileSize(image.size) }}
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
import { onMounted, ref } from 'vue'

const aiEditor = ref<HTMLElement | null>(null)
const title = ref('')
const imageInputRef = ref<HTMLInputElement | null>(null)
const uploadedImages = ref<
  Array<{
    file: File
    name: string
    size: number
    previewUrl: string
  }>
>([])

let editorInstance: AiEditor | null = null

onMounted(() => {
  if (aiEditor.value) {
    editorInstance = new AiEditor({
      element: aiEditor.value,
      placeholder: '点击输入内容...',
      content: '',
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
      ]
    })
  }
})

const saveDraft = () => {
  // 保存草稿的逻辑
  console.log('保存草稿:', {
    title: title.value,
    content: editorInstance?.getHtml()
  })
  // 这里可以添加实际的保存草稿逻辑
}

const publish = () => {
  // 发布的逻辑
  console.log('发布内容:', {
    title: title.value,
    content: editorInstance?.getHtml()
  })
  // 这里可以添加实际的发布逻辑
}

// 触发图片上传
const triggerImageUpload = () => {
  imageInputRef.value?.click()
}

// 处理图片上传
const handleImageUpload = (e: Event) => {
  const input = e.target as HTMLInputElement
  const files = input.files

  if (files && files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      // 检查文件类型是否为图片
      if (file.type.startsWith('image/')) {
        // 创建预览URL
        const previewUrl = URL.createObjectURL(file)

        // 添加到已上传图片列表
        uploadedImages.value.push({
          file,
          name: file.name,
          size: file.size,
          previewUrl
        })
      }
    }
  }

  // 清空input值，确保下次选择相同文件也能触发change事件
  input.value = ''
}

// 移除图片
const removeImage = (index: number) => {
  // 释放预览URL
  URL.revokeObjectURL(uploadedImages.value[index].previewUrl)
  // 从列表中移除
  uploadedImages.value.splice(index, 1)
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
