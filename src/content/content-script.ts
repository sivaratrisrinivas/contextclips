import { ClipContext } from '../types'

// Track the last copied content to avoid duplicate captures
// Track clipboard state for future enhancements
// TODO: Implement duplicate detection logic when needed

// Log that content script is loaded
console.log('🔍 [DEBUG] Content Script: Context Clips content script loaded')
console.log('🔍 [DEBUG] Content Script: Current URL:', window.location.href)
console.log('🔍 [DEBUG] Content Script: Chrome runtime available:', !!chrome.runtime)

// Listen for copy events
document.addEventListener('copy', async (event) => {
  console.log('🔍 [DEBUG] Content Script: Copy event detected')
  console.log('🔍 [DEBUG] Content Script: Event details:', {
    type: event.type,
    bubbles: event.bubbles,
    cancelable: event.cancelable,
    target: event.target?.constructor?.name
  })
  console.log('🔍 [DEBUG] Content Script: Chrome runtime available:', !!chrome.runtime)
  console.log('🔍 [DEBUG] Content Script: Chrome runtime ID:', chrome.runtime?.id)
  
  // Small delay to ensure clipboard is updated
  setTimeout(async () => {
    try {
      console.log('🔍 [DEBUG] Content Script: Extracting context after copy')
      const context = extractContext()
      console.log('🔍 [DEBUG] Content Script: Extracted context:', context)
      
      // Capture clipboard content directly in content script
      console.log('🔍 [DEBUG] Content Script: Attempting to read clipboard')
      let clipboardContent = ''
      
      try {
        if (navigator.clipboard && navigator.clipboard.readText) {
          clipboardContent = await navigator.clipboard.readText()
          console.log('🔍 [DEBUG] Content Script: Clipboard content:', clipboardContent.substring(0, 100) + '...')
        } else {
          console.log('⚠️ [DEBUG] Content Script: Clipboard API not available')
        }
      } catch (clipboardError) {
        console.error('❌ [DEBUG] Content Script: Failed to read clipboard:', clipboardError)
      }
      
      if (!clipboardContent.trim()) {
        console.log('⚠️ [DEBUG] Content Script: No clipboard content to save')
        return
      }
      
      // Send message to background script with clipboard content
      console.log('🔍 [DEBUG] Content Script: Sending CAPTURE_CLIPBOARD message to background')
      console.log('🔍 [DEBUG] Content Script: Message payload:', { 
        type: 'CAPTURE_CLIPBOARD', 
        context,
        clipboardContent: clipboardContent.trim()
      })
      
      if (!chrome.runtime?.id) {
        console.error('❌ [DEBUG] Content Script: Chrome runtime not available')
        return
      }
      
      chrome.runtime.sendMessage({
        type: 'CAPTURE_CLIPBOARD',
        context,
        clipboardContent: clipboardContent.trim()
      }, (response) => {
        console.log('🔍 [DEBUG] Content Script: Background script response:', response)
        console.log('🔍 [DEBUG] Content Script: Chrome runtime last error:', chrome.runtime.lastError)
        
        if (chrome.runtime.lastError) {
          console.error('❌ [DEBUG] Content Script: Chrome runtime error:', chrome.runtime.lastError.message)
        }
        
        if (response?.success) {
          console.log('✅ [DEBUG] Content Script: Clipboard captured successfully')
        } else if (response?.reason !== 'duplicate') {
          console.log('⚠️ [DEBUG] Content Script: Failed to capture clipboard:', response?.reason)
        } else {
          console.log('⚠️ [DEBUG] Content Script: Duplicate clip detected')
        }
      })
    } catch (error) {
      console.error('❌ [DEBUG] Content Script: Error during copy handling:', error)
    }
  }, 100)
})

// Listen for paste events to track usage
document.addEventListener('paste', (_event) => {
  // Could track paste events for analytics/learning
  console.log('Paste event detected')
})

function extractContext(): ClipContext {
  const url = window.location.href
  const title = document.title
  const domain = new URL(url).hostname
  
  // Try to get selected text if any
  const selection = window.getSelection()?.toString().trim()
  
  return {
    url,
    title,
    domain,
    selection: selection || undefined
  }
}

// Also listen for keyboard shortcuts that might indicate copying
document.addEventListener('keydown', (event) => {
  // Cmd/Ctrl + C
  if ((event.metaKey || event.ctrlKey) && event.key === 'c') {
    // Mark that a copy operation is happening
    // TODO: Implement copy tracking when needed
  }
})

// Listen for selection changes to track what might be copied
document.addEventListener('selectionchange', () => {
  const selection = window.getSelection()
  if (selection && selection.toString().trim()) {
    // TODO: Track selection for future duplicate detection
  }
})
