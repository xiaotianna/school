import router from '@/router'
import { userInfoLocalKey } from '@/common'
import { getStorage } from '@/utils/storage'

router.beforeEach((to, _from, next) => {
  const isLogin = to.matched.some((item) => item.meta.isLogin)
  const u_info = getStorage(userInfoLocalKey)
  if (isLogin) {
    if (u_info && u_info.token) {
      next()
    } else {
      next('/login')
    }
  } else {
    next()
  }
})
