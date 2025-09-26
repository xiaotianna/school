<template>
  <div class="w-full h-full flex">
    <div class="flex-1 flex flex-col">
      <header class="h-14 border-b px-4 flex items-center justify-between">
        <h1 class="text-sm font-medium">设置</h1>
      </header>
      <div class="flex-1 p-6">
        <div class="max-w-2xl mx-auto w-full">
          <div class="space-y-6">
            <div class="pb-6">
              <h2 class="text-lg font-semibold mb-4">账号设置</h2>
              <div class="space-y-4">
                <div class="flex items-center justify-between py-3 border-b">
                  <div>
                    <h3 class="font-medium">账号信息</h3>
                    <p class="text-sm text-muted-foreground">查看和管理您的账号信息</p>
                  </div>
                  <Button variant="outline" size="sm" @click="goToProfile">
                    查看
                  </Button>
                </div>
                <div class="flex items-center justify-between py-3 border-b">
                  <div>
                    <h3 class="font-medium">匿名模式</h3>
                    <p class="text-sm text-muted-foreground">开启后您的身份将对其他用户隐藏</p>
                  </div>
                  <Switch 
                    :checked="isAnonymous" 
                    :disabled="isUpdating"
                    @update:model-value="toggleAnonymous"
                  />
                </div>
              </div>
            </div>
            
            <div class="pt-6">
              <Button 
                variant="destructive" 
                class="w-full"
                @click="logout"
              >
                退出登录
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { reqUpdateUserInfo } from '@/api/user'

const router = useRouter()
const userStore = useUserStore()
const isAnonymous = ref(false)
const isUpdating = ref(false)

onMounted(() => {
  // 初始化匿名状态
  isAnonymous.value = userStore.isAnonymous
})

const toggleAnonymous = async (checked: boolean) => {
  isUpdating.value = true
  try {
    const response = await reqUpdateUserInfo(userStore.id, { isAnonymous: checked })
    if (response.code === 200) {
      isAnonymous.value = checked
      userStore.setInfo({ 
        ...response.data, 
        token: userStore.token 
      })
      ElMessage.success(checked ? '已开启匿名模式' : '已关闭匿名模式')
    } else {
      ElMessage.error('更新失败: ' + response.message)
      // 恢复开关状态
      isAnonymous.value = !checked
    }
  } catch (error) {
    ElMessage.error('更新失败')
    // 恢复开关状态
    isAnonymous.value = !isAnonymous.value
  } finally {
    isUpdating.value = false
  }
}

const logout = () => {
  userStore.clearInfo()
  ElMessage.success('已退出登录')
  router.replace('/login')
}

const goToProfile = () => {
  router.push('/dashboard/user')
}
</script>