<template>
  <div class="w-full max-w-6xl mx-auto p-6 h-screen flex items-center">
    <div class="flex w-full gap-6 items-start h-[80vh]">
      <!-- 左侧：信息展示 -->
      <div class="w-5/12">
        <div
          class="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 h-full"
        >
          <h3
            class="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-6"
          >
            个人信息
          </h3>

          <div class="flex items-center gap-4 mb-6">
            <img
              :src="proxy.$baseUrl + profile.avatar"
              :alt="profile.name"
              class="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-zinc-900 shadow"
            />
            <div>
              <div
                class="text-2xl font-semibold text-zinc-900 dark:text-zinc-100"
              >
                {{ profile.name }}
              </div>
              <div class="text-base text-zinc-600 dark:text-zinc-400">
                {{ profile.signature }}
              </div>
            </div>
          </div>

          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm text-zinc-600 dark:text-zinc-400">性别</span>
              <span
                class="text-sm font-medium text-zinc-900 dark:text-zinc-100"
                >{{ profile.gender }}</span
              >
            </div>
            <div>
              <div class="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                标签
              </div>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tag in profile.tags"
                  :key="tag"
                  class="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800"
                  >{{ tag }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：信息编辑 -->
      <div class="w-7/12">
        <div
          class="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 h-full"
        >
          <h3
            class="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-6"
          >
            编辑信息
          </h3>

          <form
            @submit.prevent="updateProfile"
            class="space-y-6"
          >
            <!-- 头像 -->
            <div>
              <label
                class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
                >头像</label
              >
              <div class="flex items-center gap-4">
                <img
                  :src="proxy.$baseUrl + formData.avatar"
                  :alt="formData.name"
                  class="w-16 h-16 rounded-full object-cover border-2 border-zinc-200 dark:border-zinc-700 cursor-pointer"
                  @click="triggerAvatarUpload"
                />
                <input
                  ref="avatarInputRef"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="onAvatarSelected"
                />
              </div>
            </div>

            <!-- 昵称 -->
            <div>
              <label
                class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
                >昵称</label
              >
              <Input
                v-model="formData.name"
                type="text"
                required
                maxlength="20"
              />
            </div>

            <!-- 个性签名 -->
            <div>
              <label
                class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
                >个性签名</label
              >
              <Input
                v-model="formData.signature"
                type="text"
              />
            </div>

            <!-- 性别 -->
            <div>
              <label
                class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
                >性别</label
              >
              <Select v-model="formData.gender">
                <SelectTrigger>
                  <SelectValue placeholder="选择性别" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="保密">保密</SelectItem>
                  <SelectItem value="男">男</SelectItem>
                  <SelectItem value="女">女</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <!-- 标签 -->
            <div>
              <label
                class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
                >标签</label
              >
              <!-- 标签展示区域 -->
              <div v-if="formData.tags.length" class="flex flex-wrap gap-2 mb-2 min-h-[30px]">
                <span
                  v-for="tag in formData.tags"
                  :key="tag"
                  class="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800 flex items-center"
                >
                  {{ tag }}
                  <button
                    type="button"
                    @click="removeTag(tag)"
                    class="ml-1 text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100"
                  >
                    ×
                  </button>
                </span>
              </div>
              
              <!-- 标签输入和添加按钮 -->
              <div class="flex gap-2">
                <Input
                  v-model="newTag"
                  type="text"
                  placeholder="输入标签"
                  @keyup.enter="addTag"
                  class="flex-1"
                />
                <Button
                  type="button"
                  @click="addTag"
                  variant="outline"
                >
                  添加
                </Button>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="flex gap-3 pt-4">
              <Button
                type="submit"
                class="flex-1"
                >保存</Button
              >
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, getCurrentInstance } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useUserStore } from '@/store/user'
import { reqGetUserInfo, reqUpdateUserInfo, reqUploadAvatar } from '@/api/user'
import { ElMessage } from 'element-plus'
import type { GetUserResponse } from '@/api/user/type'
const { proxy } = getCurrentInstance() as any

// 用户状态管理
const userStore = useUserStore()

// 默认资料
const defaultProfile = {
  name: '',
  signature: '保持热爱，奔赴山海',
  gender: '保密',
  avatar: proxy.$baseUrl + '/user.png',
  tags: [] as string[]
}

// 展示用资料
const profile = reactive({ ...defaultProfile })

// 表单数据
const formData = reactive({ ...defaultProfile })

watch(
  () => formData.name,
  (newName) => {
    profile.name = newName
  },
  { immediate: true }
)

watch(
  () => formData.signature,
  (newSignature) => {
    profile.signature = newSignature
  },
  { immediate: true }
)

watch(
  () => formData.gender,
  (newGender) => {
    profile.gender = newGender
  },
  { immediate: true }
)

watch(
  () => formData.tags,
  (newTags) => {
    profile.tags = [...newTags]
  },
  { deep: true, immediate: true }
)

// 新增标签输入
const newTag = ref('')

// 添加标签
const addTag = () => {
  if (newTag.value.trim() && !formData.tags.includes(newTag.value.trim())) {
    formData.tags.push(newTag.value.trim())
  }
  newTag.value = ''
}

// 删除标签
const removeTag = (tag: string) => {
  const index = formData.tags.indexOf(tag)
  if (index > -1) {
    formData.tags.splice(index, 1)
  }
}

// 更新资料
const updateProfile = async () => {
  try {
    // 准备要更新的数据，直接从formData赋值
    const updateData: Record<string, any> = {
      username: formData.name,
      sign: formData.signature,
      sex: formData.gender === '保密' ? 0 : formData.gender === '男' ? 1 : formData.gender === '女' ? 2 : 0,
      tag: formData.tags,
      imgUrl: formData.avatar
    }
    const res = await reqUpdateUserInfo(userStore.id, updateData)
    
    if (res.code === 200) {
      // 更新预览卡片
      Object.assign(profile, formData)
      ElMessage.success('信息更新成功')
      // 更新用户状态store
      userStore.setInfo({
        ...userStore.$state,
        username: updateData.username,
        imgUrl: updateData.imgUrl
      })
    } else {
      ElMessage.error(res.message || '更新失败')
    }
  } catch (error) {
    console.error('更新用户信息失败:', error)
    ElMessage.error('更新失败，请稍后重试')
  }
}

// 头像上传
const avatarInputRef = ref<HTMLInputElement | null>(null)
const triggerAvatarUpload = () => {
  avatarInputRef.value?.click()
}

const onAvatarSelected = async (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files && input.files[0]
  if (!file) return
  
  try {
    const res = await reqUploadAvatar(file)
    if (res.code === 200 && res.data && res.data.url) {
      formData.avatar = res.data.url
      profile.avatar = formData.avatar
      ElMessage.success('头像上传成功')
    } else {
      ElMessage.error(res.message || '头像上传失败')
    }
  } catch (error) {
    console.error('头像上传失败:', error)
    ElMessage.error('头像上传失败，请稍后重试')
  } finally {
    input.value = ''
  }
}

// 将后端性别数字转换为前端表单值
const convertSexToFormValue = (sex: number) => {
  switch (sex) {
    case 1: return '男'
    case 2: return '女'
    default: return '保密'
  }
}

// 初始化用户信息
const initUserInfo = async () => {
  try {
    const res: GetUserResponse = await reqGetUserInfo(userStore.id)
    if (res.code === 200 && res.data) {
      const userData = res.data
      
      // 更新预览区和表单数据
      const userInfo = {
        name: userData.username || '未知用户',
        signature: userData.sign || '保持热爱，奔赴山海',
        gender: convertSexToFormValue(userData.sex),
        avatar: userData.imgUrl || 'https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-02-albo9B0tWOSLXCVZh9rX9KFxXIVWMr.png',
        tags: Array.isArray(userData.tag) ? userData.tag : []
      }
      
      Object.assign(profile, userInfo)
      Object.assign(formData, userInfo)
    } else {
      ElMessage.error(res.message || '获取用户信息失败')
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
    ElMessage.error('获取用户信息失败，请稍后重试')
  }
}

// 组件挂载时初始化用户信息
onMounted(() => {
  initUserInfo()
})
</script>