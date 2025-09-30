<template>
  <div class="w-full h-screen">
    <el-container class="w-full h-full">
      <el-aside class="w-64 h-full border-r bg-muted/10">
        <!-- 头像 -->
        <div v-if="userStore.token" class="p-4 border-b">
          <div class="flex items-center gap-2">
            <div class="h-8 w-8 rounded-full bg-primary">
              <img :src="proxy.$baseUrl + userStore.imgUrl" alt="avatar" class="h-full w-full rounded-full"></img>
            </div>
            <span class="font-semibold">{{ userStore.username }}</span>
          </div>
        </div>
        <!-- 菜单栏 -->
        <div
          data-radix-scroll-area-viewport=""
          class="w-full rounded-[inherit]"
          style="overflow: hidden scroll"
        >
          <div style="min-width: 100%; display: table">
            <div class="space-y-4 p-4">
              <nav class="space-y-2">
                <div
                  v-for="(item, index) in renderMenus"
                  :key="index"
                >
                  <Button
                    v-if="item.type === 'menu' && item.link"
                    variant="outline"
                    class="w-full h-10 px-4 py-2"
                    @click="$router.push(item.path!)"
                  >
                    <component :is="item.icon" />
                    <span>{{ item.name }}</span>
                  </Button>
                  <button
                    v-if="item.type === 'menu' && !item.link"
                    class="ring-offset-background focus-visible:outline-hidden focus-visible:ring-ring inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full justify-start"
                    :class="{
                      'bg-accent text-accent-foreground':
                        item.path === $route.path
                    }"
                    @click="$router.push(item.path!)"
                  >
                    <component :is="item.icon" />
                    <span>{{ item.name }}</span>
                  </button>
                  <div
                    v-if="item.type === 'line'"
                    class="border-t"
                  ></div>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </el-aside>
      <el-main class="!p-0">
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import All from '@/components/icon/all.vue'
import Follow from '@/components/icon/follow.vue'
import Message from '@/components/icon/message.vue'
import User from '@/components/icon/user.vue'
import Setting from '@/components/icon/setting.vue'
import Publish from '@/components/icon/publish.vue'
import { Button } from '@/components/ui/button'
import { computed, getCurrentInstance } from 'vue'
import { useUserStore } from '@/store/user'
const { proxy } = getCurrentInstance() as any

const userStore = useUserStore()

const menus = [
  {
    type: 'menu',
    name: '发布',
    path: '/publish',
    icon: Publish,
    link: true,
    isLogin: true
  },
  {
    type: 'menu',
    name: '全部',
    path: '/dashboard/all',
    icon: Follow
  },
  {
    type: 'menu',
    name: '消息',
    path: '/dashboard/message',
    icon: Message,
    isLogin: true
  },
  {
    type: 'menu',
    name: '内容管理',
    path: '/dashboard/content',
    icon: All,
    isLogin: true
  },
  {
    type: 'menu',
    name: '我的',
    path: '/dashboard/user',
    icon: User,
    isLogin: true
  },
  {
    type: 'line'
  },
  {
    type: 'menu',
    name: '设置',
    path: '/dashboard/setting',
    icon: Setting,
    isLogin: true
  }
]

const renderMenus = computed(() => {
  return menus.filter((item) => {
    if (item.isLogin && !userStore.token) {
      return false
    }
    return true
  })
})
</script>
