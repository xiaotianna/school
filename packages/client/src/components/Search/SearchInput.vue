<template>
  <div class="relative">
    <Input 
      :model-value="searchText" 
      placeholder="搜索用户或文章内容" 
      class="!w-52"
      @update:model-value="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      @keyup.enter="showSearchResultsContainer"
    />
    <div 
      v-if="showSearchResults && searchResults.length > 0" 
      class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-96 overflow-y-auto"
    >
      <div 
        v-for="(result, index) in searchResults" 
        :key="index"
        class="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
        @click="selectResult(result)"
      >
        <div class="font-medium text-sm mb-1">
          <span v-html="highlightText(result.type === 'user' ? result.user.nickname : result.article.title, searchText)"></span>
        </div>
        <div class="text-xs text-gray-500 truncate">
          <span v-if="result.type === 'article'" v-html="highlightText(extractTextFromHtml(result.article.content), searchText)"></span>
          <span v-else>用户</span>
        </div>
        <div v-if="getTags(result).length" class="mt-1 flex flex-wrap gap-1">
          <span 
            v-for="(tag, tagIndex) in getTags(result)" 
            :key="tagIndex"
            class="text-xs px-1 py-0.5 rounded-full bg-blue-100 text-blue-800"
            v-html="highlightText('#' + tag, searchText)"
          ></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Input } from '@/components/ui/input'
import { extractTextFromHtml } from '@/utils/extractTextFromHtml'
import type { SearchResult } from './type'

// 获取标签的辅助函数
const getTags = (result: SearchResult): string[] => {
  if (result.type === 'user') {
    return result.user.tags || []
  } else {
    return result.article.tags || []
  }
}

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'search', value: string): void
  (e: 'select', value: SearchResult): void
  (e: 'show-results', value: { results: SearchResult[]; keyword: string }): void
}>()

const searchText = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const showSearchResults = ref(false)
const searchResults = ref<SearchResult[]>([])

// Mock数据
const mockData = ref<SearchResult[]>([
  {
    type: 'user',
    user: {
      id: '1',
      nickname: '张三',
      username: 'zhangsan',
      tags: ['前端开发', 'Vue', 'JavaScript']
    }
  },
  {
    type: 'user',
    user: {
      id: '2',
      nickname: '李四',
      username: 'lisi',
      tags: ['后端开发', 'Node.js', '数据库']
    }
  },
  {
    type: 'article',
    article: {
      id: '101',
      title: 'Vue 3 Composition API 使用指南',
      content: '<p>Vue 3 Composition API 是 Vue 3 中引入的一种新的组织和复用组件逻辑的方式。它提供了一种更灵活的方式来编写组件代码。</p>',
      tags: ['Vue', '前端', 'JavaScript']
    }
  },
  {
    type: 'article',
    article: {
      id: '102',
      title: 'React Hooks 完全指南',
      content: '<p>React Hooks 是 React 16.8 中引入的新特性，它让你可以在不编写 class 的情况下使用 state 以及其他的 React 特性。</p>',
      tags: ['React', '前端', 'JavaScript']
    }
  },
  {
    type: 'article',
    article: {
      id: '103',
      title: 'Node.js 性能优化技巧',
      content: '<p>在 Node.js 应用中，性能优化是一个重要的话题。本文将介绍一些常见的 Node.js 性能优化技巧。</p>',
      tags: ['Node.js', '后端', '性能优化']
    }
  }
])

const handleInput = (value: string | number) => {
  const stringValue = String(value)
  emit('update:modelValue', stringValue)
  emit('search', stringValue)
  
  if (stringValue.trim()) {
    performSearch(stringValue)
    showSearchResults.value = true
  } else {
    searchResults.value = []
    showSearchResults.value = false
  }
}

const handleFocus = () => {
  if (searchText.value.trim()) {
    showSearchResults.value = true
  }
}

const handleBlur = () => {
  // 延迟隐藏搜索结果，确保点击结果时不会立即隐藏
  setTimeout(() => {
    showSearchResults.value = false
  }, 200)
}

const showSearchResultsContainer = () => {
  if (searchText.value.trim()) {
    performSearch(searchText.value)
    emit('show-results', { results: searchResults.value, keyword: searchText.value })
    showSearchResults.value = false
  }
}

const performSearch = (keyword: string) => {
  if (!keyword.trim()) {
    searchResults.value = []
    return
  }

  const results = mockData.value.filter(item => {
    if (item.type === 'user') {
      const user = item.user
      // 搜索用户：匹配昵称、用户名和标签
      return (
        user.nickname.toLowerCase().includes(keyword.toLowerCase()) ||
        user.username.toLowerCase().includes(keyword.toLowerCase()) ||
        (user.tags && user.tags.some(tag => tag.toLowerCase().includes(keyword.toLowerCase())))
      )
    } else {
      const article = item.article
      // 搜索文章：匹配标题、内容和标签
      return (
        article.title.toLowerCase().includes(keyword.toLowerCase()) ||
        extractTextFromHtml(article.content).toLowerCase().includes(keyword.toLowerCase()) ||
        (article.tags && article.tags.some(tag => tag.toLowerCase().includes(keyword.toLowerCase())))
      )
    }
  })

  searchResults.value = results.slice(0, 10) // 限制最多显示10个结果
}

const selectResult = (result: SearchResult) => {
  showSearchResults.value = false
  emit('select', result)
}

const highlightText = (text: string, keyword: string) => {
  if (!keyword.trim()) return text
  const regex = new RegExp(`(${keyword})`, 'gi')
  return text.replace(regex, '<span class="bg-yellow-200 font-bold">$1</span>')
}
</script>