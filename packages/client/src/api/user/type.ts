import type { Response } from '../type'

export interface UserInfo {
  id: string
  phone: string
  username: string
  imgUrl: string
  sex: number
  sign: string
  tag: string[]
}

export interface UpdateUserInfo {
  username?: string
  imgUrl?: string
  sex?: number
  sign?: string
  tag?: string[]
}

export interface GetUserResponse extends Response {
  data: UserInfo
}

export interface UpdateUserResponse extends Response {
  data: UserInfo
}

export interface UploadAvatarResponse extends Response {
  data: {
    url: string
  }
}