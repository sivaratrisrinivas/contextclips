import { useEffect, useCallback } from 'react'

interface KeyboardShortcuts {
  onToggleOverlay?: () => void
  onSearch?: () => void
  onEscape?: () => void
}

export function useKeyboard({ onToggleOverlay, onSearch, onEscape }: KeyboardShortcuts) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Cmd/Ctrl + Shift + V - Toggle overlay
    if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key === 'V') {
      event.preventDefault()
      onToggleOverlay?.()
      return
    }

    // Cmd/Ctrl + K - Focus search
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault()
      onSearch?.()
      return
    }

    // Escape - Close overlay or clear search
    if (event.key === 'Escape') {
      event.preventDefault()
      onEscape?.()
      return
    }
  }, [onToggleOverlay, onSearch, onEscape])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return {
    handleKeyDown
  }
}
