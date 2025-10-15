import { ClipContext } from '../types'

console.log('📋 Content script v3.0 loaded')

document.addEventListener('copy', () => {
  setTimeout(async () => {
    try {
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
        if (response?.success) {
          console.log('✅ Clip captured')
        }
      })
    } catch (err) {
      console.error('❌ Copy capture failed:', err)
    }
  }, 100)
})
