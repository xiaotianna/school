import request from '../request'
import type {
  UpdateUserInfo,
  GetUserResponse,
  UploadAvatarResponse,
  UpdateUserResponse,
  GetUserProfileResponse
} from './type.ts'

export enum API {
  GET_USER_INFO = '/user',
  UPDATE_USER_INFO = '/user',
  UPLOAD_AVATAR = '/user/upload',
  PROFILE = '/user/profile'
}

// 获取用户信息
export const reqGetUserInfo = (id: string) => {
  return request.get<any, GetUserResponse>(`${API.GET_USER_INFO}/${id}`)
}

// 更新用户信息
export const reqUpdateUserInfo = (id: string, data: UpdateUserInfo) => {
  return request.put<any, UpdateUserResponse>(
    `${API.UPDATE_USER_INFO}/${id}`,
    data
  )
}

// 上传头像
export const reqUploadAvatar = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return request.post<any, UploadAvatarResponse>(API.UPLOAD_AVATAR, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 用户主页信息接口
export const reqUserProfile = () => {
  return request.get<any, GetUserProfileResponse>(API.PROFILE)
}
