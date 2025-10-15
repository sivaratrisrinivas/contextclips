import { Clip } from '../types'

const STORAGE_KEY = 'contextClips'
const VERSION_KEY = 'dbVersion'
const CURRENT_VERSION = '2.0-chrome-storage'

// Log that we're using the new storage system
console.log('🚀 [STORAGE v2.0] Loading chrome.storage.local database layer')
console.log('🚀 [STORAGE v2.0] Version:', CURRENT_VERSION)

class ChromeStorageDatabase {
  async init(): Promise<void> {
    // Verify we're using the right version
    const versionCheck = await chrome.storage.local.get(VERSION_KEY)
    const currentVersion = versionCheck[VERSION_KEY]
    
    if (currentVersion !== CURRENT_VERSION) {
      console.log('🚀 [STORAGE v2.0] First run or version upgrade detected')
      await chrome.storage.local.set({ [VERSION_KEY]: CURRENT_VERSION })
    }
    
    console.log('✅ [STORAGE v2.0] Initialized successfully')
  }

  async addClip(clip: Clip): Promise<void> {
    console.log('➕ [STORAGE v2.0] Adding clip:', clip.id)
    
    // Get current clips
    const result = await chrome.storage.local.get(STORAGE_KEY)
    const clips: Clip[] = result[STORAGE_KEY] || []
    
    console.log('📊 [STORAGE v2.0] Current clips:', clips.length)
    
    // Add new clip at the beginning
    clips.unshift(clip)
    
    // Save
    await chrome.storage.local.set({ [STORAGE_KEY]: clips })
    
    console.log('✅ [STORAGE v2.0] Clip added. New total:', clips.length)
  }

  async getAllClips(): Promise<Clip[]> {
    console.log('📥 [STORAGE v2.0] Getting all clips')
    
    const result = await chrome.storage.local.get(STORAGE_KEY)
    const clips: Clip[] = result[STORAGE_KEY] || []
    
    console.log('📊 [STORAGE v2.0] Retrieved', clips.length, 'clips')
    
    // Already in order (newest first) since we unshift on add
    return clips
  }

  async deleteClip(id: string): Promise<void> {
    console.log('🗑️ [STORAGE v2.0] Deleting clip:', id)
    
    const result = await chrome.storage.local.get(STORAGE_KEY)
    const clips: Clip[] = result[STORAGE_KEY] || []
    
    const filtered = clips.filter(c => c.id !== id)
    
    await chrome.storage.local.set({ [STORAGE_KEY]: filtered })
    
    console.log('✅ [STORAGE v2.0] Clip deleted')
  }

  async updateClip(clip: Clip): Promise<void> {
    console.log('✏️ [STORAGE v2.0] Updating clip:', clip.id)
    
    const result = await chrome.storage.local.get(STORAGE_KEY)
    const clips: Clip[] = result[STORAGE_KEY] || []
    
    const index = clips.findIndex(c => c.id === clip.id)
    if (index !== -1) {
      clips[index] = clip
      await chrome.storage.local.set({ [STORAGE_KEY]: clips })
      console.log('✅ [STORAGE v2.0] Clip updated')
    } else {
      console.warn('⚠️ [STORAGE v2.0] Clip not found:', clip.id)
    }
  }

  async searchClips(query: string): Promise<Clip[]> {
    const clips = await this.getAllClips()
    
    if (!query.trim()) return clips
    
    const q = query.toLowerCase()
    return clips.filter(clip => 
      clip.content.toLowerCase().includes(q) ||
      clip.pageTitle.toLowerCase().includes(q) ||
      clip.domain.toLowerCase().includes(q)
    )
  }
}

export const db = new ChromeStorageDatabase()

// Initialize immediately
db.init().then(() => {
  console.log('🚀 [STORAGE v2.0] Database ready!')
}).catch(err => {
  console.error('❌ [STORAGE v2.0] Init failed:', err)
})


