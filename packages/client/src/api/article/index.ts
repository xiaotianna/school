import request from '@/api/request'
import type {
  ArticleResponse,
  UploadImageResponse,
  ArticleListResponse,
  MyArticlesResponse,
  DeleteArticleResponse,
  ArticleDetailResponse,
  CommentResponse,
  LikeResponse,
  ActiveUsersRankingResponse,
  PopularArticlesRankingResponse,
  MessageResponse
} from './type'

enum API {
  UPLOAD = '/article/upload',
  DRAFT = '/article/draft', // 草稿
  PUBLISH = '/article/publish', // 发布
  UPDATE_DRAFT = '/article/draft/update', // 更新草稿
  UPDATE_PUBLISH = '/article/publish/update', // 更新文章
  ALL = '/article/all', // 获取所有文章
  MY = '/article/my', // 获取我的文章
  DELETE = '/article', // 删除文章
  DETAIL = '/article/details', // 获取文章详情
  COMMENT = '/article/comment', // 添加评论
  LIKE = '/article/like', // 点赞
  ACTIVE_USERS_RANKING = '/article/ranking/active-users', // 活跃用户榜
  POPULAR_ARTICLES_RANKING = '/article/ranking/popular-articles', // 热门动态榜
  MESSAGE = '/article/messages' // 消息评论、点赞信息列表接口
}

// 上传图片
export const uploadImages = (formData: FormData) => {
  return request<any, UploadImageResponse>({
    url: API.UPLOAD,
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 保存草稿
export const saveDraft = (data: any) => {
  return request<any, ArticleResponse>({
    url: API.DRAFT,
    method: 'post',
    data
  })
}

// 更新草稿
export const updateDraft = (id: string, data: any) => {
  return request<any, ArticleResponse>({
    url: `${API.UPDATE_DRAFT}/${id}`,
    method: 'put',
    data
  })
}

// 发布文章
export const publishArticle = (data: any) => {
  return request<any, ArticleResponse>({
    url: API.PUBLISH,
    method: 'post',
    data
  })
}

// 更新文章
export const updateArticle = (id: string, data: any) => {
  return request<any, ArticleResponse>({
    url: `${API.UPDATE_PUBLISH}/${id}`,
    method: 'put',
    data
  })
}

// 获取所有已发布的文章
export const getAllArticles = () => {
  return request<any, ArticleListResponse>({
    url: API.ALL,
    method: 'get'
  })
}

// 获取当前用户的文章
export const getMyArticles = (params?: {
  page?: number
  limit?: number
  keyword?: string
  state?: number
}) => {
  return request<any, MyArticlesResponse>({
    url: API.MY,
    method: 'get',
    params
  })
}

// 删除文章
export const deleteArticle = (data: any) => {
  return request<any, DeleteArticleResponse>({
    url: `${API.DELETE}`,
    method: 'delete',
    data
  })
}

// 获取文章详情
export const getArticleDetail = (articleId: string) => {
  return request<any, ArticleDetailResponse>({
    url: `${API.DETAIL}/${articleId}`,
    method: 'get'
  })
}

// 评论接口
export const reqComment = (data: {
  content: string
  articleId: string
  replyCommentId?: string
}) => {
  return request.post<any, CommentResponse>(
    `${API.COMMENT}/${data.articleId}`,
    data
  )
}

// 点赞接口（包括取消）
export const reqLike = (articleId: string) => {
  return request.post<any, LikeResponse>(`${API.LIKE}/${articleId}`)
}

// 活跃用户榜接口
export const getActiveUsersRanking = () => {
  return request<any, ActiveUsersRankingResponse>({
    url: API.ACTIVE_USERS_RANKING,
    method: 'get'
  })
}

// 热门动态榜接口
export const getPopularArticlesRanking = () => {
  return request<any, PopularArticlesRankingResponse>({
    url: API.POPULAR_ARTICLES_RANKING,
    method: 'get'
  })
}

// 点赞、回复消息接口
export const reqGetMessages = () => {
  return request.get<any, MessageResponse>(API.MESSAGE)
}
