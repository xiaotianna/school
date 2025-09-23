<template>
  <div class="flex gap-3">
    <img
      v-if="comment.user.avatar"
      :src="comment.user.avatar"
      alt="avatar"
      class="w-10 h-10 rounded-full object-cover shrink-0"
    />
    <div
      v-else
      class="w-10 h-10 rounded-full bg-gray-200 shrink-0 flex items-center justify-center text-xs text-gray-500"
    >
      {{ comment.user.nickname?.[0] ?? 'U' }}
    </div>
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2">
        <span class="text-xs font-medium">{{ comment.user.nickname }}</span>
        <span class="text-[10px] text-gray-400">{{
          formatTime(comment.createdAt)
        }}</span>
      </div>
      <div class="mt-1 text-sm text-gray-700 whitespace-pre-wrap break-words">
        {{ comment.content }}
      </div>

      <div
        v-if="comment.replies && comment.replies.length && level < MAX_LEVEL"
        class="mt-3 pl-4 border-l border-gray-100 space-y-4"
      >
        <CommentItem
          v-for="r in comment.replies"
          :key="r.id"
          :comment="r"
          :level="level + 1"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const MAX_LEVEL = 2

type Comment = {
  id: string | number
  user: { id?: string | number; nickname: string; avatar?: string }
  content: string
  createdAt: string | number | Date
  replies?: Comment[]
}

defineProps<{
  comment: Comment
  level: number
}>()

function formatTime(time: Comment['createdAt']): string {
  const date = time instanceof Date ? time : new Date(time)
  const now = Date.now()
  const diff = Math.max(0, now - date.getTime())
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  if (diff < minute) return '刚刚'
  if (diff < hour) return `${Math.floor(diff / minute)} 分钟前`
  if (diff < day) return `${Math.floor(diff / hour)} 小时前`
  const y = date.getFullYear()
  const m = `${date.getMonth() + 1}`.padStart(2, '0')
  const d = `${date.getDate()}`.padStart(2, '0')
  const hh = `${date.getHours()}`.padStart(2, '0')
  const mm = `${date.getMinutes()}`.padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}`
}
</script>

<style scoped></style>
