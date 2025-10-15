export interface Clip {
  id: string
  content: string
  timestamp: number
  sourceUrl: string
  pageTitle: string
  contentType: ContentType
  domain: string
  pinned: boolean
  tags: string[]
}

export type ContentType = 'text' | 'code' | 'url' | 'image' | 'html'

export interface ClipContext {
  url: string
  title: string
  selection?: string
  domain: string
}

export interface SearchFilters {
  domain?: string
  contentType?: ContentType
  dateRange?: 'today' | 'yesterday' | 'week' | 'month' | 'all'
  pinned?: boolean
}

export interface ClipGroup {
  title: string
  clips: Clip[]
  type: 'domain' | 'time' | 'content'
}
