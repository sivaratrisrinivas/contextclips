import { Clip } from '../types'

const STORAGE_KEY = 'clips_v3'

export class Storage {
  async saveClip(clip: Clip): Promise<void> {
    const clips = await this.getAllClips()
    clips.unshift(clip)
    await chrome.storage.local.set({ [STORAGE_KEY]: clips })
    console.log('✅ Saved clip. Total:', clips.length)
  }

  async getAllClips(): Promise<Clip[]> {
    const result = await chrome.storage.local.get(STORAGE_KEY)
    return result[STORAGE_KEY] || []
  }

  async deleteClip(id: string): Promise<void> {
    const clips = await this.getAllClips()
    const filtered = clips.filter(c => c.id !== id)
    await chrome.storage.local.set({ [STORAGE_KEY]: filtered })
  }
}

export const storage = new Storage()
