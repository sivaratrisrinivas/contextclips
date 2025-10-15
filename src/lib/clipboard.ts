import { Clip, ClipContext, ContentType } from '../types'

export class ClipboardManager {
  async captureClip(context: ClipContext): Promise<Clip | null> {
    try {
      console.log('🔍 [DEBUG] ClipboardManager: Attempting to read clipboard')
      console.log('🔍 [DEBUG] ClipboardManager: Navigator clipboard available:', !!navigator.clipboard)
      console.log('🔍 [DEBUG] ClipboardManager: Context:', context)
      
      // Check if clipboard API is available
      if (!navigator.clipboard) {
        console.error('❌ [DEBUG] ClipboardManager: Clipboard API not available')
        return null
      }
      
      // Use web clipboard API with proper permissions
      const clipboardItems = await navigator.clipboard.read()
      console.log('🔍 [DEBUG] ClipboardManager: Got clipboard items:', clipboardItems.length)
      
      for (const item of clipboardItems) {
        console.log('🔍 [DEBUG] ClipboardManager: Processing item with types:', item.types)
        for (const type of item.types) {
          const blob = await item.getType(type)
          const content = await blob.text()
          console.log('🔍 [DEBUG] ClipboardManager: Content from type', type, ':', content.substring(0, 100) + '...')
          
          if (content.trim()) {
            const clip = {
              id: this.generateId(),
              content: content.trim(),
              timestamp: Date.now(),
              sourceUrl: context.url,
              pageTitle: context.title,
              contentType: this.detectContentType(content, type),
              domain: context.domain,
              pinned: false,
              tags: []
            }
            console.log('✅ [DEBUG] ClipboardManager: Created clip:', clip)
            return clip
          }
        }
      }
      
      console.log('⚠️ [DEBUG] ClipboardManager: No content found in clipboard')
    } catch (error) {
      console.error('❌ [DEBUG] ClipboardManager: Failed to read clipboard:', error)
      console.error('❌ [DEBUG] ClipboardManager: Error details:', error)
    }
    
    return null
  }

  async writeToClipboard(content: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(content)
    } catch (error) {
      console.error('Failed to write to clipboard:', error)
      throw error
    }
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private detectContentType(content: string, mimeType: string): ContentType {
    // Check for URLs
    if (content.match(/^https?:\/\/.+/)) return 'url'
    
    // Check for code patterns
    if (content.includes('function') || 
        content.includes('const ') || 
        content.includes('import ') ||
        content.includes('class ') ||
        content.includes('def ') ||
        content.includes('SELECT ') ||
        content.includes('SELECT ')) {
      return 'code'
    }
    
    // Check for HTML
    if (content.includes('<') && content.includes('>')) return 'html'
    
    // Check for images
    if (mimeType.startsWith('image/')) return 'image'
    
    return 'text'
  }
}

export const clipboardManager = new ClipboardManager()
