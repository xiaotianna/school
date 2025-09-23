<template>
  <div class="w-full max-w-6xl mx-auto p-6 h-screen flex items-center">
    <div class="flex w-full gap-6 items-start h-[80vh]">
      <!-- 左侧：信息展示（等宽） -->
      <div class="w-5/12">
        <div class="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 h-full">
          <h3 class="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-6">个人信息</h3>

          <div class="flex items-center gap-4 mb-6">
            <img
              :src="profile.avatar"
              :alt="profile.name"
              class="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-zinc-900 shadow"
            />
            <div>
              <div class="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">{{ profile.name }}</div>
              <div class="text-base text-zinc-600 dark:text-zinc-400">{{ profile.signature }}</div>
            </div>
          </div>

          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm text-zinc-600 dark:text-zinc-400">性别</span>
              <span class="text-sm font-medium text-zinc-900 dark:text-zinc-100">{{ profile.gender }}</span>
            </div>
            <div>
              <div class="text-sm text-zinc-600 dark:text-zinc-400 mb-2">标签</div>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tag in profile.tags"
                  :key="tag"
                  class="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800"
                >{{ tag }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：信息编辑（等宽） -->
      <div class="w-7/12">
        <div class="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 h-full">
          <h3 class="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-6">编辑信息</h3>

          <form @submit.prevent="updateProfile" class="space-y-6">
            <!-- 头像 -->
            <div>
              <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">头像</label>
              <div class="flex items-center gap-4">
                <img
                  :src="formData.avatar"
                  :alt="formData.name"
                  class="w-16 h-16 rounded-full object-cover border-2 border-zinc-200 dark:border-zinc-700 cursor-pointer"
                  @click="triggerAvatarUpload"
                />
                <input ref="avatarInputRef" type="file" accept="image/*" class="hidden" @change="onAvatarSelected" />
              </div>
            </div>

            <!-- 昵称 -->
            <div>
              <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">昵称</label>
              <Input v-model="formData.name" type="text" required />
            </div>

            <!-- 个性签名 -->
            <div>
              <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">个性签名</label>
              <Input v-model="formData.signature" type="text" />
            </div>

            <!-- 性别 -->
            <div>
              <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">性别</label>
              <Select v-model="formData.gender">
                <SelectTrigger>
                  <SelectValue placeholder="选择性别" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="保密">保密</SelectItem>
                  <SelectItem value="男">男</SelectItem>
                  <SelectItem value="女">女</SelectItem>
                  <SelectItem value="其他">其他</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <!-- 标签（逗号分隔） -->
            <div>
              <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">标签（用逗号分隔）</label>
              <Input v-model="tagsInput" type="text" placeholder="例如：前端,Vue,校园生活" />
            </div>

            <!-- 操作按钮 -->
            <div class="flex gap-3 pt-4">
              <Button type="submit" class="flex-1">保存</Button>
              <Button type="button" variant="outline" class="flex-1" @click="resetForm">重置</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// 默认资料
const defaultProfile = {
  name: 'John Doe',
  signature: '保持热爱，奔赴山海',
  gender: '保密',
  avatar: 'https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-02-albo9B0tWOSLXCVZh9rX9KFxXIVWMr.png',
  tags: ['前端', 'Vue']
}

// 展示用资料
const profile = reactive({ ...defaultProfile })

// 表单数据
const formData = reactive({ ...defaultProfile })

// 标签输入框（逗号分隔）
const tagsInput = ref(formData.tags.join(','))

watch(tagsInput, (val) => {
  const list = (val || '')
    .split(',')
    .map(t => t.trim())
    .filter(Boolean)
  formData.tags = list
})

// 更新资料
const updateProfile = () => {
  Object.assign(profile, formData)
  // 这里可接入 API 保存
  // console.log('Profile updated:', profile)
}

// 重置表单
const resetForm = () => {
  Object.assign(formData, profile)
  tagsInput.value = formData.tags.join(',')
}

// 头像上传
const avatarInputRef = ref<HTMLInputElement | null>(null)
const triggerAvatarUpload = () => {
  avatarInputRef.value?.click()
}
const onAvatarSelected = (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files && input.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    formData.avatar = String(reader.result || '')
  }
  reader.readAsDataURL(file)
  input.value = ''
}
</script>
