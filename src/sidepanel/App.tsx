import { useState, useEffect } from 'react'
import { Clip } from '../types'

export function App() {
  const [clips, setClips] = useState<Clip[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const loadClips = () => {
    chrome.runtime.sendMessage({ type: 'GET_CLIPS' }, response => {
      if (response?.clips) {
        console.log('📊 Loaded', response.clips.length, 'clips')
        setClips(response.clips)
      }
      setLoading(false)
    })
  }

  useEffect(() => {
    loadClips()

    // Listen for updates
    const listener = (message: any) => {
      if (message.type === 'CLIPS_UPDATED') {
        loadClips()
      }
    }
    chrome.runtime.onMessage.addListener(listener)
    return () => chrome.runtime.onMessage.removeListener(listener)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!selectedId) return

      // Ctrl+C or Cmd+C or Enter - copy
      if ((e.ctrlKey || e.metaKey) && e.key === 'c' || e.key === 'Enter') {
        e.preventDefault()
        const clip = clips.find(c => c.id === selectedId)
        if (clip) {
          navigator.clipboard.writeText(clip.content)
          console.log('✅ Copied')
        }
      }

      // Arrow keys - navigate
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        const idx = clips.findIndex(c => c.id === selectedId)
        if (e.key === 'ArrowDown' && idx < clips.length - 1) {
          setSelectedId(clips[idx + 1].id)
        } else if (e.key === 'ArrowUp' && idx > 0) {
          setSelectedId(clips[idx - 1].id)
        }
      }

      // Delete key
      if (e.key === 'Delete') {
        handleDelete(selectedId)
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [selectedId, clips])

  const handleCopy = (clip: Clip) => {
    setSelectedId(clip.id)
    navigator.clipboard.writeText(clip.content)
  }

  const handleDelete = (id: string) => {
    chrome.runtime.sendMessage({ type: 'DELETE_CLIP', id }, () => {
      setClips(clips.filter(c => c.id !== id))
      if (selectedId === id) setSelectedId(null)
    })
  }

  const formatTime = (ts: number) => {
    const mins = Math.floor((Date.now() - ts) / 60000)
    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    return new Date(ts).toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading...</div>
      </div>
    )
  }

  if (clips.length === 0) {
    return (
      <div className="container">
        <div className="empty">
          <h2>📋 Context Clips</h2>
          <p>Copy any text from a webpage and it will appear here.</p>
          <div className="hint">
            <strong>Tip:</strong> Use arrow keys to navigate, Ctrl+C or Enter to copy
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Context Clips</h1>
        <div className="hint">Use ↑↓ to navigate, Ctrl+C or Enter to copy, Delete to remove</div>
      </div>
      
      <div className="clips">
        {clips.map(clip => (
          <div
            key={clip.id}
            className={`clip ${selectedId === clip.id ? 'selected' : ''}`}
            onClick={() => handleCopy(clip)}
          >
            <div className="clip-content">{clip.content}</div>
            <div className="clip-meta">
              <span className="domain">{clip.domain}</span>
              <span className="time">{formatTime(clip.timestamp)}</span>
            </div>
            <button
              className="delete-btn"
              onClick={(e) => {
                e.stopPropagation()
                handleDelete(clip.id)
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
