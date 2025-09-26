export interface Response<T = any> {
  code: number
  message: string
  status: boolean
  data?: T
}
