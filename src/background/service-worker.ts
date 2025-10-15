import { db } from '../lib/db'
import { Clip, ClipContext, ContentType } from '../types'

console.log('🚀 [SERVICE WORKER v2.0] Starting up...')
console.log('🚀 [SERVICE WORKER v2.0] Using chrome.storage.local database')

// Helper functions
function generateClipId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

function detectContentType(content: string): ContentType {
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
  
  return 'text'
}

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log('📨 [SERVICE WORKER v2.0] Message received:', message.type)
  
  if (message.type === 'CAPTURE_CLIPBOARD') {
    handleClipboardCapture(message.context, message.clipboardContent, sendResponse)
    return true
  }
  
  if (message.type === 'GET_CLIPS') {
    handleGetClips(sendResponse)
    return true
  }
  
  if (message.type === 'DELETE_CLIP') {
    handleDeleteClip(message.clipId, sendResponse)
    return true
  }
  
  if (message.type === 'UPDATE_CLIP') {
    handleUpdateClip(message.clip, sendResponse)
    return true
  }
  
  console.warn('⚠️ [SERVICE WORKER v2.0] Unknown message type:', message.type)
  return false
})

async function handleClipboardCapture(context: ClipContext, clipboardContent: string, sendResponse: (response: any) => void) {
  try {
    console.log('📋 [SERVICE WORKER v2.0] Capturing clipboard')
    console.log('📋 [SERVICE WORKER v2.0] Content length:', clipboardContent?.length || 0)
    
    if (!clipboardContent || !clipboardContent.trim()) {
      console.log('⚠️ [SERVICE WORKER v2.0] No content')
      sendResponse({ success: false, reason: 'no_content' })
      return
    }
    
    // Create clip
    const clip: Clip = {
      id: generateClipId(),
      content: clipboardContent.trim(),
      timestamp: Date.now(),
      sourceUrl: context.url,
      pageTitle: context.title,
      contentType: detectContentType(clipboardContent),
      domain: context.domain,
      pinned: false,
      tags: []
    }
    
    console.log('📋 [SERVICE WORKER v2.0] Created clip:', clip.id)
    
    // Check for duplicates
    const existingClips = await db.getAllClips()
    console.log('📋 [SERVICE WORKER v2.0] Existing clips:', existingClips.length)
    
    const fiveMinutesAgo = Date.now() - (5 * 60 * 1000)
    const isDuplicate = existingClips.some(existing => 
      existing.content === clip.content && 
      existing.timestamp > fiveMinutesAgo
    )
    
    if (isDuplicate) {
      console.log('⚠️ [SERVICE WORKER v2.0] Duplicate detected')
      sendResponse({ success: false, reason: 'duplicate' })
      return
    }
    
    // Add clip
    await db.addClip(clip)
    console.log('✅ [SERVICE WORKER v2.0] Clip saved')
    
    // Broadcast to sidepanels
    chrome.runtime.sendMessage({ type: 'CLIP_ADDED', clip }).catch(() => {
      console.log('📡 [SERVICE WORKER v2.0] No listeners (sidepanel not open)')
    })
    
    sendResponse({ success: true, clip })
  } catch (error) {
    console.error('❌ [SERVICE WORKER v2.0] Error:', error)
    sendResponse({ success: false, error: (error as Error).message })
  }
}

async function handleGetClips(sendResponse: (response: any) => void) {
  try {
    console.log('📥 [SERVICE WORKER v2.0] Getting clips')
    
    const clips = await db.getAllClips()
    console.log('📥 [SERVICE WORKER v2.0] Retrieved:', clips.length, 'clips')
    
    sendResponse({ success: true, clips })
  } catch (error) {
    console.error('❌ [SERVICE WORKER v2.0] Error:', error)
    sendResponse({ success: false, error: (error as Error).message })
  }
}

async function handleDeleteClip(clipId: string, sendResponse: (response: any) => void) {
  try {
    await db.deleteClip(clipId)
    sendResponse({ success: true })
  } catch (error) {
    console.error('Failed to delete clip:', error)
    sendResponse({ success: false, error: (error as Error).message })
  }
}

async function handleUpdateClip(clip: Clip, sendResponse: (response: any) => void) {
  try {
    await db.updateClip(clip)
    sendResponse({ success: true })
  } catch (error) {
    console.error('Failed to update clip:', error)
    sendResponse({ success: false, error: (error as Error).message })
  }
}

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ windowId: tab.windowId })
})

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener((command) => {
  if (command === 'toggle-clipboard') {
    // Open side panel or trigger overlay
    chrome.sidePanel.open({ windowId: chrome.windows.WINDOW_ID_CURRENT })
  }
})

// Initialize database on startup
chrome.runtime.onStartup.addListener(async () => {
  try {
    await db.init()
  } catch (error) {
    console.error('Failed to initialize database:', error)
  }
})

// Initialize database on install
chrome.runtime.onInstalled.addListener(async () => {
  try {
    await db.init()
  } catch (error) {
    console.error('Failed to initialize database:', error)
  }
})
