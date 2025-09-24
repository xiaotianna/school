<template>
  <div class="w-full h-screen flex flex-col">
    <!-- 标题输入框和按钮区域 -->
    <div class="p-4 border-b flex items-center space-x-4">
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
    
    <!-- 富文本编辑器 -->
    <div
      ref="aiEditor"
      class="flex-1"
    />
  </div>
</template>

<script setup lang="ts">
import { AiEditor } from 'aieditor'
import 'aieditor/dist/style.css'
import { onMounted, ref } from 'vue'

const aiEditor = ref<HTMLElement | null>(null)
const title = ref('')

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
        'ai'
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
</script>