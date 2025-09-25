import type { Response } from '../type'

export interface LoginData {
  phone: string
  password: string
}

export type UserInfoType = {
  id: string
  phone: string
  username: string
  token: string
}

export interface SigninResponse extends Response {
  data: UserInfoType
}

export interface SignupResponse extends Response {
  data: Exclude<UserInfoType, 'token'>
}
