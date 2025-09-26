import axios from 'axios'
import router from '@/router/index'
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'
import { baseUrl } from '@/common'

const user = useUserStore()

const request = axios.create({
  baseURL: baseUrl,
  timeout: 300000
})

request.interceptors.request.use(
  (config) => {
    const user = useUserStore()
    if (user.token) config.headers['Authorization'] = 'Bearer ' + user.token
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  async (response) => {
    if (response.data?.code === 403 || response.data?.code === 401) {
      user.clearInfo()
      router.replace('/login')
      ElMessage.error(response.data.message || '登录已过期，请重新登录')
      return
    }

    if (response.data?.code !== 200) {
      ElMessage.error(response.data.message || '请求失败')
      return Promise.reject(response.data.message)
    }

    if (response.data?.code === 200) {
      response.data['status'] = true
    }
    return response.data
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default request
