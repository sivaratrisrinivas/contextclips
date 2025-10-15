import { Clip, ClipGroup, SearchFilters } from '../types'

export class ClipCategorizer {
  categorizeByDomain(clips: Clip[]): ClipGroup[] {
    const groups = new Map<string, Clip[]>()
    
    clips.forEach(clip => {
      const domain = clip.domain
      if (!groups.has(domain)) {
        groups.set(domain, [])
      }
      groups.get(domain)!.push(clip)
    })
    
    return Array.from(groups.entries())
      .map(([domain, clips]) => ({
        title: domain,
        clips: clips.sort((a, b) => b.timestamp - a.timestamp),
        type: 'domain' as const
      }))
      .sort((a, b) => b.clips.length - a.clips.length)
  }

  categorizeByTime(clips: Clip[]): ClipGroup[] {
    const now = Date.now()
    const oneDay = 24 * 60 * 60 * 1000
    const oneWeek = 7 * oneDay
    
    const groups: { [key: string]: Clip[] } = {
      'Today': [],
      'Yesterday': [],
      'This Week': [],
      'Older': []
    }
    
    clips.forEach(clip => {
      const age = now - clip.timestamp
      
      if (age < oneDay) {
        groups['Today'].push(clip)
      } else if (age < 2 * oneDay) {
        groups['Yesterday'].push(clip)
      } else if (age < oneWeek) {
        groups['This Week'].push(clip)
      } else {
        groups['Older'].push(clip)
      }
    })
    
    return Object.entries(groups)
      .filter(([_, clips]) => clips.length > 0)
      .map(([title, clips]) => ({
        title,
        clips: clips.sort((a, b) => b.timestamp - a.timestamp),
        type: 'time' as const
      }))
  }

  categorizeByContent(clips: Clip[]): ClipGroup[] {
    const groups = new Map<string, Clip[]>()
    
    clips.forEach(clip => {
      const type = clip.contentType
      if (!groups.has(type)) {
        groups.set(type, [])
      }
      groups.get(type)!.push(clip)
    })
    
    return Array.from(groups.entries())
      .map(([type, clips]) => ({
        title: this.formatContentType(type),
        clips: clips.sort((a, b) => b.timestamp - a.timestamp),
        type: 'content' as const
      }))
      .sort((a, b) => b.clips.length - a.clips.length)
  }

  filterClips(clips: Clip[], filters: SearchFilters): Clip[] {
    return clips.filter(clip => {
      if (filters.domain && clip.domain !== filters.domain) return false
      if (filters.contentType && clip.contentType !== filters.contentType) return false
      if (filters.pinned !== undefined && clip.pinned !== filters.pinned) return false
      
      if (filters.dateRange) {
        const now = Date.now()
        const oneDay = 24 * 60 * 60 * 1000
        const oneWeek = 7 * oneDay
        const oneMonth = 30 * oneDay
        
        const age = now - clip.timestamp
        
        switch (filters.dateRange) {
          case 'today':
            if (age >= oneDay) return false
            break
          case 'yesterday':
            if (age < oneDay || age >= 2 * oneDay) return false
            break
          case 'week':
            if (age >= oneWeek) return false
            break
          case 'month':
            if (age >= oneMonth) return false
            break
        }
      }
      
      return true
    })
  }

  private formatContentType(type: string): string {
    const typeMap: { [key: string]: string } = {
      'text': 'Text',
      'code': 'Code',
      'url': 'Links',
      'image': 'Images',
      'html': 'HTML'
    }
    return typeMap[type] || type
  }
}

export const categorizer = new ClipCategorizer()
