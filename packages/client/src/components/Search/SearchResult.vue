<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="close">
    <div class="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col -mt-[30vh]">
      <div class="p-4 border-b flex justify-between items-center">
        <h2 class="text-lg font-semibold">搜索结果</h2>
        <button @click="close" class="text-gray-500 hover:text-gray-700">
          <X class="w-5 h-5" />
        </button>
      </div>
      
      <div class="flex-1 overflow-y-auto">
        <div v-if="results.length === 0" class="p-8 text-center text-gray-500">
          没有找到相关结果
        </div>
        
        <div v-else class="divide-y">
          <div 
            v-for="(result, index) in results" 
            :key="index"
            class="p-4 hover:bg-gray-50 cursor-pointer"
            @click="selectResult(result)"
          >
            <div v-if="result.type === 'user'" class="flex items-start gap-3">
              <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                {{ result.user.nickname.charAt(0) }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="font-medium" v-html="highlightText(result.user.nickname, keyword)"></div>
                <div class="text-sm text-gray-500 mt-1">
                  用户
                </div>
                <div v-if="result.user.tags && result.user.tags.length" class="mt-2 flex flex-wrap gap-1">
                  <span 
                    v-for="(tag, tagIndex) in result.user.tags" 
                    :key="tagIndex"
                    class="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800"
                    v-html="highlightText('#' + tag, keyword)"
                  ></span>
                </div>
              </div>
            </div>
            
            <div v-else class="flex flex-col">
              <div class="font-medium text-lg mb-2" v-html="highlightText(result.article.title, keyword)"></div>
              <div class="text-gray-600 text-sm mb-3 line-clamp-2" v-html="highlightText(extractTextFromHtml(result.article.content), keyword)"></div>
              <div class="flex items-center justify-between">
                <div v-if="result.article.tags && result.article.tags.length" class="flex flex-wrap gap-1">
                  <span 
                    v-for="(tag, tagIndex) in result.article.tags" 
                    :key="tagIndex"
                    class="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-800"
                    v-html="highlightText('#' + tag, keyword)"
                  ></span>
                </div>
                <div class="text-xs text-gray-500">
                  文章
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { extractTextFromHtml } from '@/utils/extractTextFromHtml'
import type { SearchResult } from './type';

defineProps<{
  results: SearchResult[]
  keyword: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'select', result: SearchResult): void
}>()

const close = () => {
  emit('close')
}

const selectResult = (result: SearchResult) => {
  emit('select', result)
}

const highlightText = (text: string, keyword: string) => {
  if (!keyword.trim()) return text
  const regex = new RegExp(`(${keyword})`, 'gi')
  return text.replace(regex, '<span class="bg-yellow-200 font-bold">$1</span>')
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>