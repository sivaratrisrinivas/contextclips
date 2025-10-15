import { Clip } from '../types'

const STORAGE_KEY = 'clips'

// Identify context for debugging
const CONTEXT_ID = typeof chrome !== 'undefined' && chrome.runtime?.id 
  ? `${chrome.runtime.id}-${Math.random().toString(36).substr(2, 9)}`
  : 'unknown-context'

console.log('🔍 [DEBUG] Database Module: Loaded in context:', CONTEXT_ID)
console.log('🔍 [DEBUG] Database Module: Using chrome.storage.local API')

class Database {
  private contextId: string = CONTEXT_ID

  async init(): Promise<void> {
    console.log('🔍 [DEBUG] Database: Init called (chrome.storage requires no initialization)')
    console.log('🔍 [DEBUG] Database: Context:', this.contextId)
    // chrome.storage doesn't need initialization
    return Promise.resolve()
  }

  async addClip(clip: Clip): Promise<void> {
    console.log('🔍 [DEBUG] Database: Starting addClip with chrome.storage')
    console.log('🔍 [DEBUG] Database: Clip to add:', clip)
    console.log('🔍 [DEBUG] Database: Context:', this.contextId)
    
    try {
      // Get existing clips
      const result = await chrome.storage.local.get(STORAGE_KEY)
      const clips: Clip[] = result[STORAGE_KEY] || []
      
      console.log('🔍 [DEBUG] Database: Current clips count:', clips.length)
      
      // Add new clip
      clips.push(clip)
      
      // Save back to storage
      await chrome.storage.local.set({ [STORAGE_KEY]: clips })
      
      console.log('✅ [DEBUG] Database: Clip added successfully')
      console.log('🔍 [DEBUG] Database: New clips count:', clips.length)
      
      // Verify the write
      const verifyResult = await chrome.storage.local.get(STORAGE_KEY)
      const verifyClips: Clip[] = verifyResult[STORAGE_KEY] || []
      console.log('🔍 [DEBUG] Database: Immediate verification - count:', verifyClips.length)
    } catch (error) {
      console.error('❌ [DEBUG] Database: Failed to add clip:', error)
      throw error
    }
  }

  async getAllClips(): Promise<Clip[]> {
    console.log('🔍 [DEBUG] Database: Starting getAllClips with chrome.storage')
    console.log('🔍 [DEBUG] Database: Context:', this.contextId)
    
    try {
      const result = await chrome.storage.local.get(STORAGE_KEY)
      const clips: Clip[] = result[STORAGE_KEY] || []
      
      console.log('🔍 [DEBUG] Database: Retrieved clips count:', clips.length)
      console.log('🔍 [DEBUG] Database: First few clips:', clips.slice(0, 3))
      
      // Sort by timestamp (most recent first)
      const sortedClips = clips.sort((a, b) => b.timestamp - a.timestamp)
      
      console.log('✅ [DEBUG] Database: Returning sorted clips, count:', sortedClips.length)
      
      return sortedClips
    } catch (error) {
      console.error('❌ [DEBUG] Database: Failed to get clips:', error)
      throw error
    }
  }

  async deleteClip(id: string): Promise<void> {
    console.log('🔍 [DEBUG] Database: Deleting clip:', id)
    
    try {
      const result = await chrome.storage.local.get(STORAGE_KEY)
      const clips: Clip[] = result[STORAGE_KEY] || []
      
      const filteredClips = clips.filter(clip => clip.id !== id)
      
      await chrome.storage.local.set({ [STORAGE_KEY]: filteredClips })
      
      console.log('✅ [DEBUG] Database: Clip deleted successfully')
    } catch (error) {
      console.error('❌ [DEBUG] Database: Failed to delete clip:', error)
      throw error
    }
  }

  async updateClip(clip: Clip): Promise<void> {
    console.log('🔍 [DEBUG] Database: Updating clip:', clip.id)
    
    try {
      const result = await chrome.storage.local.get(STORAGE_KEY)
      const clips: Clip[] = result[STORAGE_KEY] || []
      
      const index = clips.findIndex(c => c.id === clip.id)
      if (index !== -1) {
        clips[index] = clip
        await chrome.storage.local.set({ [STORAGE_KEY]: clips })
        console.log('✅ [DEBUG] Database: Clip updated successfully')
      } else {
        console.warn('⚠️ [DEBUG] Database: Clip not found for update:', clip.id)
      }
    } catch (error) {
      console.error('❌ [DEBUG] Database: Failed to update clip:', error)
      throw error
    }
  }

  async searchClips(query: string): Promise<Clip[]> {
    const allClips = await this.getAllClips()
    
    if (!query.trim()) return allClips
    
    const lowercaseQuery = query.toLowerCase()
    
    return allClips.filter(clip => 
      clip.content.toLowerCase().includes(lowercaseQuery) ||
      clip.pageTitle.toLowerCase().includes(lowercaseQuery) ||
      clip.domain.toLowerCase().includes(lowercaseQuery)
    )
  }
}

export const db = new Database()

