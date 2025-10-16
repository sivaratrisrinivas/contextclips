// CONTENT SCRIPT v4.0
console.log('%c📋 v4.0 Content Script', 'color: blue; font-size: 16px')

document.addEventListener('copy', () => {
  setTimeout(() => {
    navigator.clipboard.readText().then(text => {
      if (!text) return
      
      chrome.runtime.sendMessage({
        type: 'SAVE',
        content: text,
        domain: location.hostname,
        title: document.title,
        url: location.href
      }, (response) => {
        if (response?.ok) {
          console.log('✅ v4.0 Saved')
        }
      })
    }).catch(err => console.error('v4.0 Error:', err))
  }, 100)
})
