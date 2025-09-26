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
  update_time: string;
  likes: number;
}

export interface ArticleResponse extends Response {
  data: Article
}

export interface ArticleListResponse extends Response {
  data: Article[]
}