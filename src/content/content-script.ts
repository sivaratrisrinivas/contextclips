import { ClipContext } from '../types'

console.log('📋 Content script v3.0 loaded')

// Wait for extension context to be ready
if (!chrome.runtime?.id) {
  console.error('❌ Chrome runtime not available')
  throw new Error('Extension context not available')
}

console.log('✅ Chrome runtime ready:', chrome.runtime.id)

document.addEventListener('copy', () => {
  setTimeout(async () => {
    try {
      // Check runtime is still available
      if (!chrome.runtime?.id) {
        console.error('❌ Runtime lost')
        return
      }

      const text = await navigator.clipboard.readText()
      
      if (!text || !text.trim()) return

      const context: ClipContext = {
        url: window.location.href,
        title: document.title,
        domain: new URL(window.location.href).hostname
      }

      chrome.runtime.sendMessage({
        type: 'SAVE_CLIP',
        content: text,
        context: context
      }, response => {
        if (chrome.runtime.lastError) {
          console.error('❌ Message error:', chrome.runtime.lastError)
          return
        }
        if (response?.success) {
          console.log('✅ Clip captured')
        }
      })
    } catch (err) {
      console.error('❌ Copy capture failed:', err)
    }
  }, 100)
})
