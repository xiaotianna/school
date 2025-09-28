import type { Response } from '../type'

export interface UploadImageResponse extends Response {
  data: {
    urls: string[]
  }
}

// 定义作者接口
export interface Author {
  id: string
  phone?: string
  username: string
  imgUrl: string
  sex?: number
  sign?: string
  tag?: string[]
  create_time?: string
  isAnonymous: boolean
}

// 定义评论接口
export interface Comment {
  id: string
  content: string
  create_time: string
  user: Author
  reply_comment: Exclude<Comment, 'reply_comment' | 'content'>
}

export interface Article {
  title: string
  content: string
  images: string[]
  tags: string[]
  status: number // 0: 草稿，1: 发布
  id: string
  create_time: string
  update_time: string
  likes: number
  isLike: boolean
  author: Author
  comments: Comment[]
}

export interface ArticleResponse extends Response {
  data: Exclude<Article, 'comments'>
}

export interface ArticleDetailResponse extends Response {
  data: Article
}

// 首页所有数据
export interface ArticleListResponse extends Response {
  data: Article[]
}

// 用户文章列表响应（分页）
export interface MyArticlesResponse extends Response {
  data: {
    data: Article[]
    total: number
    page: number
    limit: number
  }
}

// 删除文章
export interface DeleteArticleResponse extends Response {
  data: {
    affected: number
  }
}

// 评论响应
export interface CommentResponse extends Response {
  data: Comment
}

// 点赞响应
export interface LikeResponse extends Response {
  data: {
    isLiked: boolean
    likes: number
  }
}

// 活跃用户榜数据
export interface ActiveUserRanking {
  user: Author
  likeCount: number
}

// 热门动态榜数据
export interface PopularArticleRanking {
  article: {
    id: string
    title: string
    content: string
    images: string[]
    tags: string[]
    create_time: string
  }
  author: Author
  likeCount: number
}

// 活跃用户榜响应
export interface ActiveUsersRankingResponse extends Response {
  data: ActiveUserRanking[]
}

// 热门动态榜响应
export interface PopularArticlesRankingResponse extends Response {
  data: PopularArticleRanking[]
}

// 消息基础类型（点赞信息没有id和content字段）
export interface Message {
  id?: string
  content?: string
  create_time: string
  user_id: string
  username: string
  user_imgUrl: string
  user_isAnonymous: boolean
  article_id: string
  article_title: string
}

export interface MessageResponse extends Response {
  data: {
    commentMessages: Message[]
    likeMessages: Message[]
  }
}
