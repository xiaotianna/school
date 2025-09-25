import request from '../request'
import type { SigninResponse, SignupResponse } from './type'

export enum API {
  SIGNIN = '/auth/signin',
  SIGNUP = '/auth/signup'
}

export const reqSignin = (
  {
    phone,
    password
  }: {
    phone: string
    password: string
  },
  type: 'signin' | 'signup'
) => {
  if (type === 'signin') {
    return request.post<any, SigninResponse>(API.SIGNIN, { phone, password })
  } else {
    return request.post<any, SignupResponse>(API.SIGNUP, { phone, password })
  }
}
