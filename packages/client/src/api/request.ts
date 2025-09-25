import axios from 'axios'
import router from '@/router/index'
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'
import { baseUrl } from '@/common/baseUrl'

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
    if (response.data?.code === 403) {
      user.clearInfo()
      router.replace('/login')
      ElMessage.error('无权限')
      return
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
