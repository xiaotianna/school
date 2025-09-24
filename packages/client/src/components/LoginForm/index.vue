<template>
  <div
    :class="cn('flex flex-col gap-6', className)"
    v-bind="$attrs"
  >
    <form @submit.prevent="handleSubmit">
      <div class="flex flex-col gap-6">
        <div class="flex flex-col items-center gap-2">
          <a
            href="#"
            class="flex flex-col items-center gap-2 font-medium"
          >
            <div class="flex h-8 w-8 items-center justify-center rounded-md">
              <GalleryVerticalEnd class="size-6" />
            </div>
            <span class="sr-only">Acme Inc.</span>
          </a>
          <h1 class="text-xl font-bold">Welcome to Acme Inc.</h1>
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
          <button
            type="submit"
            class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 w-full"
          >
            登录
          </button>
        </div>
      </div>
    </form>
    <div
      class="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary"
    >
      还没有账号？
      <a class="cursor-pointer">未注册的自动注册登录</a>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { GalleryVerticalEnd } from 'lucide-vue-next'

defineProps({
  className: {
    type: String,
    default: ''
  }
})

const phone = ref('')
const password = ref('')

const cn = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

const handleSubmit = () => {
  console.log('Login submitted with phone:', phone.value, 'password:', password.value)
}
</script>