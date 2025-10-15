import { useCallback } from 'react'
import { Clip } from '../../types'

export function useClipboard() {
  // const [loading, setLoading] = useState(false)

  const getAllClips = useCallback(async (): Promise<Clip[]> => {
    return new Promise((resolve, reject) => {
      console.log('🔍 [DEBUG] Sidepanel: Requesting clips from background script')
      console.log('🔍 [DEBUG] Chrome runtime available:', !!chrome.runtime)
      console.log('🔍 [DEBUG] Chrome runtime ID:', chrome.runtime.id)
      
      chrome.runtime.sendMessage({ type: 'GET_CLIPS' }, (response) => {
        console.log('🔍 [DEBUG] Sidepanel: Received response from background:', response)
        console.log('🔍 [DEBUG] Response type:', typeof response)
        console.log('🔍 [DEBUG] Response success:', response?.success)
        console.log('🔍 [DEBUG] Response clips count:', response?.clips?.length || 0)
        console.log('🔍 [DEBUG] Chrome runtime last error:', chrome.runtime.lastError)
        
        if (response?.success) {
          console.log('✅ [DEBUG] Sidepanel: Successfully got clips:', response.clips?.length || 0)
          console.log('✅ [DEBUG] First few clips:', response.clips?.slice(0, 3))
          resolve(response.clips)
        } else {
          console.error('❌ [DEBUG] Sidepanel: Failed to get clips:', response?.error)
          console.error('❌ [DEBUG] Chrome runtime error:', chrome.runtime.lastError)
          reject(new Error(response?.error || 'Failed to get clips'))
        }
      })
    })
  }, [])

  const deleteClip = useCallback(async (clipId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ 
        type: 'DELETE_CLIP', 
        clipId 
      }, (response) => {
        if (response?.success) {
          resolve()
        } else {
          reject(new Error(response?.error || 'Failed to delete clip'))
        }
      })
    })
  }, [])

  const updateClip = useCallback(async (clip: Clip): Promise<void> => {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ 
        type: 'UPDATE_CLIP', 
        clip 
      }, (response) => {
        if (response?.success) {
          resolve()
        } else {
          reject(new Error(response?.error || 'Failed to update clip'))
        }
      })
    })
  }, [])

  const searchClips = useCallback(async (query: string): Promise<Clip[]> => {
    // For now, implement client-side search
    // In the future, this could be moved to the background script
    const allClips = await getAllClips()
    
    if (!query.trim()) return allClips
    
    const lowercaseQuery = query.toLowerCase()
    
    return allClips.filter(clip => 
      clip.content.toLowerCase().includes(lowercaseQuery) ||
      clip.pageTitle.toLowerCase().includes(lowercaseQuery) ||
      clip.domain.toLowerCase().includes(lowercaseQuery)
    )
  }, [getAllClips])

  const writeToClipboard = useCallback(async (content: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(content)
    } catch (error) {
      console.error('Failed to write to clipboard:', error)
      throw error
    }
  }, [])

  return {
    getAllClips,
    deleteClip,
    updateClip,
    searchClips,
    writeToClipboard
  }
}
