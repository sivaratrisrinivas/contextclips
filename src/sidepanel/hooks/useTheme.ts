import { useState, useEffect } from 'react'
import { themeManager } from '../../lib/theme'

export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>(themeManager.getTheme())

  useEffect(() => {
    const handleThemeChange = (event: CustomEvent) => {
      setTheme(event.detail.theme)
    }

    window.addEventListener('themechange', handleThemeChange as EventListener)
    
    return () => {
      window.removeEventListener('themechange', handleThemeChange as EventListener)
    }
  }, [])

  const toggleTheme = () => {
    themeManager.toggleTheme()
  }

  return {
    theme,
    toggleTheme,
    isDark: theme === 'dark'
  }
}
