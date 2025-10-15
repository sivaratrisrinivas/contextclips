import { storage } from './storage'
import { Clip, ClipContext } from '../types'

console.log('🚀 SERVICE WORKER v3.0 STARTED')

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('📨 Message:', message.type)

  if (message.type === 'SAVE_CLIP') {
    const context: ClipContext = message.context
    const content: string = message.content

    if (!content || !content.trim()) {
      sendResponse({ success: false })
      return
    }

    const clip: Clip = {
      id: generateId(),
      content: content.trim(),
      timestamp: Date.now(),
      domain: context.domain,
      pageTitle: context.title,
      sourceUrl: context.url
    }

    storage.saveClip(clip).then(() => {
      console.log('✅ Clip saved')
      // Notify sidepanel
      chrome.runtime.sendMessage({ type: 'CLIPS_UPDATED' }).catch(() => {})
      sendResponse({ success: true })
    }).catch(err => {
      console.error('❌ Save failed:', err)
      sendResponse({ success: false })
    })

    return true
  }

  if (message.type === 'GET_CLIPS') {
    storage.getAllClips().then(clips => {
      console.log('📤 Returning', clips.length, 'clips')
      sendResponse({ clips })
    }).catch(err => {
      console.error('❌ Get failed:', err)
      sendResponse({ clips: [] })
    })
    return true
  }

  if (message.type === 'DELETE_CLIP') {
    storage.deleteClip(message.id).then(() => {
      sendResponse({ success: true })
    })
    return true
  }
})

// Open sidepanel on icon click
chrome.action.onClicked.addListener(() => {
  chrome.sidePanel.open({ windowId: chrome.windows.WINDOW_ID_CURRENT })
})
