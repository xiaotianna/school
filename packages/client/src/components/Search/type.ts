// 定义搜索结果类型
export interface User {
  id: string
  nickname: string
  username: string
  tags?: string[]
}

export interface Article {
  id: string
  title: string
  content: string
  tags?: string[]
}

export interface SearchResultUser {
  type: 'user'
  user: User
}

export interface SearchResultArticle {
  type: 'article'
  article: Article
}

export type SearchResult = SearchResultUser | SearchResultArticle
