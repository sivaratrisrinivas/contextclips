import { Clip } from '../types'

const DB_NAME = 'ContextClipsDB'
const DB_VERSION = 1
const STORE_NAME = 'clips'

class Database {
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    console.log('🔍 [DEBUG] Database: Starting initialization')
    console.log('🔍 [DEBUG] Database: DB_NAME:', DB_NAME)
    console.log('🔍 [DEBUG] Database: DB_VERSION:', DB_VERSION)
    console.log('🔍 [DEBUG] Database: STORE_NAME:', STORE_NAME)
    
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)
      
      request.onerror = () => {
        console.error('❌ [DEBUG] Database: Failed to open database:', request.error)
        reject(request.error)
      }
      
      request.onsuccess = () => {
        console.log('✅ [DEBUG] Database: Successfully opened database')
        this.db = request.result
        console.log('🔍 [DEBUG] Database: Database instance set:', !!this.db)
        resolve()
      }
      
      request.onupgradeneeded = (event) => {
        console.log('🔍 [DEBUG] Database: Upgrade needed, creating object store')
        const db = (event.target as IDBOpenDBRequest).result
        
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          console.log('🔍 [DEBUG] Database: Creating object store:', STORE_NAME)
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
          store.createIndex('timestamp', 'timestamp', { unique: false })
          store.createIndex('domain', 'domain', { unique: false })
          store.createIndex('contentType', 'contentType', { unique: false })
          store.createIndex('pinned', 'pinned', { unique: false })
          console.log('✅ [DEBUG] Database: Object store and indexes created')
        } else {
          console.log('🔍 [DEBUG] Database: Object store already exists')
        }
      }
    })
  }

  async addClip(clip: Clip): Promise<void> {
    console.log('🔍 [DEBUG] Database: Starting addClip')
    console.log('🔍 [DEBUG] Database: Clip to add:', clip)
    
    if (!this.db) {
      console.log('🔍 [DEBUG] Database: DB not initialized, calling init()')
      await this.init()
    }
    
    console.log('🔍 [DEBUG] Database: DB initialized, proceeding with add transaction')
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.add(clip)
      
      transaction.oncomplete = () => {
        console.log('✅ [DEBUG] Database: Clip added and transaction completed')
        resolve()
      }
      
      transaction.onerror = () => {
        console.error('❌ [DEBUG] Database: Transaction failed:', transaction.error)
        reject(transaction.error)
      }
      
      request.onerror = () => {
        console.error('❌ [DEBUG] Database: Failed to add clip:', request.error)
        reject(request.error)
      }
    })
  }

  async getAllClips(): Promise<Clip[]> {
    console.log('🔍 [DEBUG] Database: Starting getAllClips')
    console.log('🔍 [DEBUG] Database: Current db state:', !!this.db)
    
    if (!this.db) {
      console.log('🔍 [DEBUG] Database: DB not initialized, calling init()')
      await this.init()
    }
    
    console.log('🔍 [DEBUG] Database: DB initialized, proceeding with transaction')
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.getAll()
      
      transaction.oncomplete = () => {
        const clips = request.result.sort((a, b) => b.timestamp - a.timestamp)
        console.log('🔍 [DEBUG] Database: Transaction complete, sorted clips count:', clips.length)
        console.log('🔍 [DEBUG] Database: First few clips:', clips.slice(0, 3))
        resolve(clips)
      }
      
      transaction.onerror = () => {
        console.error('❌ [DEBUG] Database: Transaction failed:', transaction.error)
        reject(transaction.error)
      }
      
      request.onerror = () => {
        console.error('❌ [DEBUG] Database: Request failed:', request.error)
        reject(request.error)
      }
    })
  }

  async deleteClip(id: string): Promise<void> {
    if (!this.db) await this.init()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.delete(id)
      
      transaction.oncomplete = () => resolve()
      transaction.onerror = () => reject(transaction.error)
      request.onerror = () => reject(request.error)
    })
  }

  async updateClip(clip: Clip): Promise<void> {
    if (!this.db) await this.init()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.put(clip)
      
      transaction.oncomplete = () => resolve()
      transaction.onerror = () => reject(transaction.error)
      request.onerror = () => reject(request.error)
    })
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
