import request from '@/api/request'
import type { ArticleResponse, UploadImageResponse } from './type'

enum API {
  UPLOAD = '/article/upload',
  DRAFT = '/article/draft',
  PUBLISH = '/article/publish'
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