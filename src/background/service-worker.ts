import { db } from '../lib/db'
import { Clip, ClipContext, ContentType } from '../types'

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
  console.log('🔍 [DEBUG] Background: Received message:', message)
  console.log('🔍 [DEBUG] Background: Message type:', message.type)
  console.log('🔍 [DEBUG] Background: Sender:', _sender)
  console.log('🔍 [DEBUG] Background: Message listener is active')
  
  if (message.type === 'CAPTURE_CLIPBOARD') {
    console.log('🔍 [DEBUG] Background: Handling CAPTURE_CLIPBOARD')
    handleClipboardCapture(message.context, message.clipboardContent, sendResponse)
    return true // Keep message channel open for async response
  }
  
  if (message.type === 'GET_CLIPS') {
    console.log('🔍 [DEBUG] Background: Handling GET_CLIPS')
    handleGetClips(sendResponse)
    return true
  }
  
  if (message.type === 'DELETE_CLIP') {
    console.log('🔍 [DEBUG] Background: Handling DELETE_CLIP')
    handleDeleteClip(message.clipId, sendResponse)
    return true
  }
  
  if (message.type === 'UPDATE_CLIP') {
    console.log('🔍 [DEBUG] Background: Handling UPDATE_CLIP')
    handleUpdateClip(message.clip, sendResponse)
    return true
  }
  
  console.log('⚠️ [DEBUG] Background: Unknown message type:', message.type)
})

async function handleClipboardCapture(context: ClipContext, clipboardContent: string, sendResponse: (response: any) => void) {
  try {
    console.log('🔍 [DEBUG] Background: Handling clipboard capture with context:', context)
    console.log('🔍 [DEBUG] Background: Clipboard content length:', clipboardContent?.length || 0)
    
    if (!clipboardContent || !clipboardContent.trim()) {
      console.log('⚠️ [DEBUG] Background: No clipboard content provided')
      sendResponse({ success: false, reason: 'no_content' })
      return
    }
    
    // Create clip object directly from the provided content
    const clip = {
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
    
    console.log('🔍 [DEBUG] Background: Created clip:', clip)
    
    // Check for duplicates within 5 minutes
    console.log('🔍 [DEBUG] Background: Checking for duplicates')
    const existingClips = await db.getAllClips()
    console.log('🔍 [DEBUG] Background: Existing clips count:', existingClips.length)
    const fiveMinutesAgo = Date.now() - (5 * 60 * 1000)
    
    const isDuplicate = existingClips.some(existing => 
      existing.content === clip.content && 
      existing.timestamp > fiveMinutesAgo
    )
    
    if (!isDuplicate) {
      console.log('🔍 [DEBUG] Background: No duplicate found, adding clip to database')
      await db.addClip(clip)
      console.log('✅ [DEBUG] Background: Clip added to database successfully')
      
      // Broadcast to all sidepanels that a new clip was added
      chrome.runtime.sendMessage({ type: 'CLIP_ADDED', clip }).catch((error) => {
        // Ignore error if no listeners (sidepanel might not be open)
        console.log('🔍 [DEBUG] Background: No listeners for CLIP_ADDED broadcast (this is normal if sidepanel is closed)')
      })
      
      sendResponse({ success: true, clip })
    } else {
      console.log('⚠️ [DEBUG] Background: Duplicate clip detected, not adding')
      sendResponse({ success: false, reason: 'duplicate' })
    }
  } catch (error) {
    console.error('❌ [DEBUG] Background: Failed to handle clipboard capture:', error)
    sendResponse({ success: false, error: (error as Error).message })
  }
}

async function handleGetClips(sendResponse: (response: any) => void) {
  try {
    console.log('🔍 [DEBUG] Background: Starting to get clips from database')
    console.log('🔍 [DEBUG] Database instance:', !!db)
    
    const clips = await db.getAllClips()
    console.log('🔍 [DEBUG] Background: Retrieved clips from database:', clips.length)
    console.log('🔍 [DEBUG] Background: First few clips:', clips.slice(0, 3))
    
    sendResponse({ success: true, clips })
    console.log('✅ [DEBUG] Background: Successfully sent clips to sidepanel')
  } catch (error) {
    console.error('❌ [DEBUG] Background: Failed to get clips:', error)
    console.error('❌ [DEBUG] Error details:', error)
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
