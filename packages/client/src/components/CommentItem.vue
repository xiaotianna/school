<template>
  <div
    class="flex gap-3"
    :class="comment.reply_comment ? 'ml-2 pl-4 border-l border-gray-100' : ''"
  >
    <img
      v-if="comment.user.imgUrl && !comment.user.isAnonymous"
      :src="proxy.$baseUrl + comment.user.imgUrl"
      alt="avatar"
      class="w-10 h-10 rounded-full object-cover shrink-0"
    />
    <div
      v-else
      class="w-10 h-10 rounded-full bg-gray-200 shrink-0 flex items-center justify-center text-xs text-gray-500"
    >
      {{
        comment.user.isAnonymous ? '匿' : (comment.user.username?.[0] ?? 'U')
      }}
    </div>
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2">
        <span class="text-xs font-medium">{{
          comment.user.isAnonymous
            ? '匿名用户'
            : comment.user.username || 'User'
        }}</span>
        <span
          v-if="comment.reply_comment"
          class="text-[10px] font-medium text-gray-400"
          >回复</span
        >
        <span
          v-if="comment.reply_comment"
          class="text-xs font-medium"
        >
          {{
            comment.reply_comment.user.isAnonymous
              ? '匿名用户'
              : comment.reply_comment.user.username || 'User'
          }}
        </span>
      </div>
      <div class="mt-1 text-sm text-gray-700 whitespace-pre-wrap break-words">
        {{ comment.content }}
      </div>

      <!-- 底部时间和回复按钮 -->
      <div class="mt-2 flex items-center gap-2">
        <span class="text-xs text-gray-400">{{
          formatTime(comment.create_time)
        }}</span>
        <button
          @click="handleReply"
          class="text-xs text-gray-500 hover:text-blue-500"
        >
          回复
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Comment } from '@/api/article/type'
import { formatTime } from '@/utils/formatTime'
import { getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance() as any

const props = defineProps<{
  comment: Comment
}>()

const emit = defineEmits<{
  (e: 'reply', comment: Comment): void
}>()

function handleReply() {
  emit('reply', props.comment)
}
</script>
