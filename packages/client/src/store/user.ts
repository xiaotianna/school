import { defineStore } from 'pinia'
import { removeStorage } from '@/utils/storage'
import type { UserInfoType } from '@/api/auth/type'
import { userInfoLocalKey } from '@/common'

export const useUserStore = defineStore('user', {
  persist: [
    {
      key: userInfoLocalKey,
      pick: ['id', 'phone', 'token']
    }
  ],
  state: () => ({
    id: '',
    phone: '',
    token: '',
    username: '',
    imgUrl: ''
  }),
  actions: {
    setInfo(value: UserInfoType) {
      const { id, phone, token, username, imgUrl } = value
      this.id = id
      this.phone = phone
      this.token = token
      this.username = username
      this.imgUrl = imgUrl
    },
    clearInfo() {
      // 重置状态
      this.$reset()
      // 移除持久化存储
      removeStorage(userInfoLocalKey)
    }
  }
})