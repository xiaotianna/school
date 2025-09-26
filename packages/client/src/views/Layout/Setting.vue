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
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'
import { Button } from '@/components/ui/button'

const router = useRouter()
const userStore = useUserStore()

const logout = () => {
  userStore.clearInfo()
  ElMessage.success('已退出登录')
  router.push('/login')
}

const goToProfile = () => {
  router.push('/dashboard/user')
}
</script>