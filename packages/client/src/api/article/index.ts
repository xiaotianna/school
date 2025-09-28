import request from '@/api/request'
import type {
  ArticleResponse,
  UploadImageResponse,
  ArticleListResponse,
  MyArticlesResponse,
  DeleteArticleResponse,
  ArticleDetailResponse,
  CommentResponse
} from './type'

enum API {
  UPLOAD = '/article/upload',
  DRAFT = '/article/draft', // 草稿
  PUBLISH = '/article/publish', // 发布
  UPDATE_DRAFT = '/article/draft/update', // 更新草稿
  UPDATE_PUBLISH = '/article/publish/update', // 更新文章
  ALL = '/article/all',
  MY = '/article/my',
  DELETE = '/article',
  DETAIL = '/article',
  COMMENT = '/article/comment'
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
