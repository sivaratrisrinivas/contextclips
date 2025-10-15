export class ThemeManager {
  private static instance: ThemeManager
  private currentTheme: 'light' | 'dark' = 'light'

  static getInstance(): ThemeManager {
    if (!ThemeManager.instance) {
      ThemeManager.instance = new ThemeManager()
    }
    return ThemeManager.instance
  }

  init(): void {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('context-clips-theme') as 'light' | 'dark' | null
    
    if (savedTheme) {
      this.setTheme(savedTheme)
    } else {
      // Use system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      this.setTheme(prefersDark ? 'dark' : 'light')
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('context-clips-theme')) {
        this.setTheme(e.matches ? 'dark' : 'light')
      }
    })
  }

  setTheme(theme: 'light' | 'dark'): void {
    this.currentTheme = theme
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('context-clips-theme', theme)
    
    // Dispatch custom event for components to listen to
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }))
  }

  getTheme(): 'light' | 'dark' {
    return this.currentTheme
  }

  toggleTheme(): void {
    this.setTheme(this.currentTheme === 'light' ? 'dark' : 'light')
  }
}

export const themeManager = ThemeManager.getInstance()
