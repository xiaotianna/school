import request from '@/api/request'
import type {
  ArticleResponse,
  UploadImageResponse,
  ArticleListResponse,
  MyArticlesResponse,
  DeleteArticleResponse
} from './type'

enum API {
  UPLOAD = '/article/upload',
  DRAFT = '/article/draft',
  PUBLISH = '/article/publish',
  ALL = '/article/all',
  MY = '/article/my',
  DELETE = '/article'
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

// 发布文章
export const publishArticle = (data: any) => {
  return request<any, ArticleResponse>({
    url: API.PUBLISH,
    method: 'post',
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
