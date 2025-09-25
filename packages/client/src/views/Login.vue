<template>
  <div
    class="flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-6 md:p-10"
  >
    <div class="w-full max-w-sm">
      <div
        :class="cn('flex flex-col gap-6', className)"
        v-bind="$attrs"
      >
        <div class="flex flex-col gap-6">
          <div class="flex flex-col items-center gap-2">
            <a class="flex flex-col items-center gap-2 font-medium">
              <div class="flex h-8 w-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd class="size-6" />
              </div>
            </a>
            <h1 class="text-xl font-bold">🚀 欢迎来到校园墙</h1>
          </div>
          <div class="flex flex-col gap-6">
            <div class="grid gap-2">
              <label
                for="phone"
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                手机号
              </label>
              <input
                id="phone"
                v-model="phone"
                type="tel"
                placeholder="请输入手机号"
                required
                class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div class="grid gap-2">
              <label
                for="password"
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                密码
              </label>
              <input
                id="password"
                v-model="password"
                type="password"
                placeholder="请输入密码"
                required
                class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div class="flex gap-2">
              <button
                type="button"
                @click="handleSubmit('signin')"
                class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 w-full"
              >
                登录
              </button>
              <button
                type="button"
                @click="handleSubmit('signup')"
                class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground shadow hover:bg-secondary/90 h-9 px-4 py-2 w-full"
              >
                注册
              </button>
            </div>
          </div>
        </div>
        <div
          class="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary"
        >
          还没有账号？
          <a
            class="cursor-pointer"
            @click="handleSubmit('signup')"
            >点击注册</a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { GalleryVerticalEnd } from 'lucide-vue-next'
import { reqSignin } from '@/api/auth'
import { useToast } from '@/components/ui/toast/use-toast'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'

const { toast } = useToast()
const router = useRouter()
const userStore = useUserStore()

defineProps({
  className: {
    type: String,
    default: ''
  }
})

const phone = ref('')
const password = ref('')

const cn = (...classes: any[]) => {
  return classes.filter(Boolean).join(' ')
}

const handleSubmit = async (type: 'signin' | 'signup') => {
  if (!phone.value || !password.value) {
    toast({
      title: '请填写手机号和密码',
      variant: 'destructive'
    })
    return
  }

  let res = await reqSignin(
    {
      phone: phone.value,
      password: password.value
    },
    type
  )
  if (res.code === 200) {
    ElMessage.success(type === 'signin' ? '登录成功' : '注册成功')
    if (type === 'signin') {
      userStore.setInfo(res.data)
      router.push('/dashboard/all')
    }
  } else {
    toast({
      title: res.message || (type === 'signin' ? '登录失败' : '注册失败'),
      variant: 'destructive'
    })
  }
}
</script>
