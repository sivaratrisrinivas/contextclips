export interface Clip {
  id: string
  content: string
  timestamp: number
  domain: string
  pageTitle: string
  sourceUrl: string
}

export interface ClipContext {
  url: string
  title: string
  domain: string
}
