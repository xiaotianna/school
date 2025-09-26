import { userInfoLocalKey } from "@/common"
import { getStorage } from "./storage"
import { useUserStore } from "@/store/user"
import type { Pinia } from "pinia"

export const initUserInfo = (pinia: Pinia) => {
  const u_info = getStorage(userInfoLocalKey)
  if (u_info) {
    const user = useUserStore(pinia)
    user.setInfo(u_info)
  }
}
