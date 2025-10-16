// SERVICE WORKER v4.0 - ULTRA SIMPLE
console.log('%c🚀 v4.0 STARTED', 'color: green; font-size: 20px')

const STORAGE_KEY = 'clips_v4'

chrome.runtime.onMessage.addListener((msg, _sender, respond) => {
  console.log('📨 v4.0 Message:', msg.type)
  
  if (msg.type === 'SAVE') {
    chrome.storage.local.get(STORAGE_KEY, (result) => {
      const clips = result[STORAGE_KEY] || []
      const newClip = {
        id: Date.now().toString(),
        content: msg.content,
        timestamp: Date.now(),
        domain: msg.domain,
        title: msg.title,
        url: msg.url
      }
      clips.unshift(newClip)
      chrome.storage.local.set({ [STORAGE_KEY]: clips }, () => {
        console.log('✅ v4.0 Saved! Total:', clips.length)
        respond({ ok: true })
        chrome.runtime.sendMessage({ type: 'REFRESH' }).catch(() => {})
      })
    })
    return true
  }
  
  if (msg.type === 'GET') {
    chrome.storage.local.get(STORAGE_KEY, (result) => {
      const clips = result[STORAGE_KEY] || []
      console.log('📤 v4.0 Sending:', clips.length, 'clips')
      respond({ clips })
    })
    return true
  }
  
  if (msg.type === 'DELETE') {
    chrome.storage.local.get(STORAGE_KEY, (result) => {
      const clips = (result[STORAGE_KEY] || []).filter((c: any) => c.id !== msg.id)
      chrome.storage.local.set({ [STORAGE_KEY]: clips }, () => {
        respond({ ok: true })
      })
    })
    return true
  }
})

chrome.action.onClicked.addListener(() => {
  chrome.sidePanel.open({ windowId: chrome.windows.WINDOW_ID_CURRENT })
})
