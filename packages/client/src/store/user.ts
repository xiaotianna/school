import { defineStore } from 'pinia'
import { removeStorage } from '@/utils/storage'
import type { UserInfoType } from '@/api/auth/type'

export const useUserStore = defineStore('user', {
  persist: [
    {
      key: 'USER_INFO',
      storage: localStorage
    }
  ],
  state: () => ({
    userInfo: {} as UserInfoType
  }),
  actions: {
    setInfo(value: UserInfoType) {
      this.userInfo = value
    },
    clearInfo() {
      this.userInfo = {} as UserInfoType
      removeStorage('USER_INFO')
    }
  }
})
