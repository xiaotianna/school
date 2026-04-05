import type { Response } from '../type'

export interface TitleSuggestResponse extends Response {
  data: {
    suggestions: string[]
  }
}

export interface RewriteResponse extends Response {
  data: {
    rewritten: string
    highlights: string[]
  }
}

export interface TagSuggestResponse extends Response {
  data: {
    tags: string[]
  }
}
