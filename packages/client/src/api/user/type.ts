import type { Article } from '../article/type'
import type { Response } from '../type'

export interface UserInfo {
  id: string
  phone: string
  username: string
  imgUrl: string
  sex: number
  sign: string
  tag: string[]
  isAnonymous: boolean
  articleCount?: number
  commentCount?: number
  likeCount?: number
}

export interface UpdateUserInfo {
  username?: string
  imgUrl?: string
  sex?: number
  sign?: string
  tag?: string[]
  isAnonymous?: boolean
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

// 用户主页的文章类型，包含评论数量
export type ProfileArticle = Omit<Article, 'comments'> & {
  commentCount: number
}

export interface GetUserProfileResponse extends Response {
  data: {
    user: UserInfo
    articles: ProfileArticle[]
  }
}