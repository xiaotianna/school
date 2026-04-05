import request from '@/api/request'
import { baseUrl } from '@/common'
import { useUserStore } from '@/store/user'
import type {
  RewriteResponse,
  TagSuggestResponse,
  TitleSuggestResponse
} from './type'

enum API {
  TITLE_SUGGEST = '/ai/title-suggest',
  REWRITE = '/ai/rewrite',
  REWRITE_STREAM = '/ai/rewrite-stream',
  TAG_SUGGEST = '/ai/tag-suggest'
}

export const suggestTitle = (data: {
  draftTitle?: string
  content: string
  style?: 'normal' | 'formal' | 'casual'
}) => {
  return request<any, TitleSuggestResponse>({
    url: API.TITLE_SUGGEST,
    method: 'post',
    data
  })
}

export const rewriteContent = (data: {
  title?: string
  content: string
  goal: 'polish' | 'shorten' | 'expand'
  tone?: 'normal' | 'friendly' | 'serious'
}) => {
  return request<any, RewriteResponse>({
    url: API.REWRITE,
    method: 'post',
    data
  })
}

export const rewriteContentStream = async (
  data: {
    title?: string
    content: string
    goal: 'polish' | 'shorten' | 'expand'
    tone?: 'normal' | 'friendly' | 'serious'
  },
  onChunk?: (chunk: string, fullText: string) => void
) => {
  const user = useUserStore()
  const response = await fetch(`${baseUrl}${API.REWRITE_STREAM}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(user.token ? { Authorization: `Bearer ${user.token}` } : {})
    },
    body: JSON.stringify(data)
  })

  if (!response.ok || !response.body) {
    let message = `请求失败(${response.status})`
    try {
      const errorData = await response.json()
      if (errorData?.message) message = errorData.message
    } catch {
      // ignore parse error
    }
    throw new Error(message)
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let fullText = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    const chunk = decoder.decode(value, { stream: true })
    if (!chunk) continue
    fullText += chunk
    onChunk?.(chunk, fullText)
  }

  return fullText.trim()
}

export const suggestTags = (data: {
  title?: string
  content: string
  maxTags?: number
}) => {
  return request<any, TagSuggestResponse>({
    url: API.TAG_SUGGEST,
    method: 'post',
    data
  })
}
