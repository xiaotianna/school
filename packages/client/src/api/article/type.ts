import type { Response } from '../type'

export interface UploadImageResponse extends Response {
  data: {
    urls: string[]
  }
}

export interface Author {
  id: string;
  phone: string;
  username: string;
  password: string;
  imgUrl: string;
  sex: number;
  sign: string;
  tag: string[];
  create_time: string;
}

export interface Article {
  title: string;
  content: string;
  images: string[];
  tags: string[];
  status: number; // 0: 草稿，1: 发布
  author: Author;
  id: string;
  create_time: string;
  likes: number;
  isAnonymous: boolean;
}

export interface Comment {}

export interface ArticleResponse extends Response {
  data: Article
}

export interface ArticleDetailResponse extends Response {
  data: Article & {
    comment: Comment[];
  }
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