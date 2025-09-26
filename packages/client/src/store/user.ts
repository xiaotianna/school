import { defineStore } from 'pinia'
import { removeStorage, setStorage } from '@/utils/storage'
import type { UserInfoType } from '@/api/auth/type'
import { userInfoLocalKey } from '@/common'

interface UserState {
  id: string
  phone: string
  token: string
  username: string
  imgUrl: string
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
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
      setStorage(userInfoLocalKey, value)
    },
    clearInfo() {
      // 重置状态
      this.$reset()
      removeStorage(userInfoLocalKey)
    }
  }
})
