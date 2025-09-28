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
import { search } from '@/api/article'

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
const searchTimeout = ref<number | null>(null)

const handleInput = (value: string | number) => {
  const stringValue = String(value)
  emit('update:modelValue', stringValue)
  emit('search', stringValue)
  
  // 清除之前的定时器
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  
  if (stringValue.trim()) {
    // 设置新的定时器，延迟执行搜索
    searchTimeout.value = window.setTimeout(() => {
      performSearch(stringValue)
    }, 300)
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

const performSearch = async (keyword: string) => {
  if (!keyword.trim()) {
    searchResults.value = []
    return
  }

  try {
    const response = await search(keyword)
    searchResults.value = response.data.slice(0, 10) // 限制最多显示10个结果
  } catch (error) {
    console.error('搜索失败:', error)
    searchResults.value = []
  }
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