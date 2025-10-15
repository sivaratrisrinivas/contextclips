import { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { motion } from 'framer-motion'
import { Clip, SearchFilters } from '../types'
import { SearchBar } from './components/SearchBar'
import { FilterBar } from './components/FilterBar'
import { ClipCard } from './components/ClipCard'
import { EmptyState } from './components/EmptyState'
import { useClipboard } from './hooks/useClipboard'
import './App.css'

function App() {
    const [clips, setClips] = useState<Clip[]>([])
    const [filteredClips, setFilteredClips] = useState<Clip[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [filters, setFilters] = useState<SearchFilters>({})
    const [loading, setLoading] = useState(true)
    const [selectedClipId, setSelectedClipId] = useState<string | null>(null)

    const {
        getAllClips,
        deleteClip,
        updateClip,
        searchClips,
        writeToClipboard
    } = useClipboard()

    useEffect(() => {
        loadClips()
        
        // Listen for new clips from background script
        const handleMessage = (message: any) => {
            if (message.type === 'CLIP_ADDED') {
                console.log('📥 [DEBUG] App: New clip added, refreshing...')
                loadClips()
            }
        }
        
        chrome.runtime.onMessage.addListener(handleMessage)
        
        return () => {
            chrome.runtime.onMessage.removeListener(handleMessage)
        }
    }, [])

    useEffect(() => {
        if (searchQuery.trim()) {
            searchClips(searchQuery).then(setFilteredClips)
        } else {
            setFilteredClips(clips)
        }
    }, [searchQuery, clips])

    // Keyboard shortcuts handler
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Ctrl+C or Cmd+C to copy selected clip
            if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
                if (selectedClipId) {
                    const selectedClip = clips.find(clip => clip.id === selectedClipId)
                    if (selectedClip) {
                        event.preventDefault()
                        handleCopyClip(selectedClip.content)
                        console.log('✅ [DEBUG] App: Copied selected clip with Ctrl+C')
                    }
                }
            }
            
            // Arrow keys to navigate clips
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                event.preventDefault()
                const currentIndex = filteredClips.findIndex(clip => clip.id === selectedClipId)
                
                if (event.key === 'ArrowDown') {
                    const nextIndex = currentIndex < filteredClips.length - 1 ? currentIndex + 1 : 0
                    setSelectedClipId(filteredClips[nextIndex]?.id || null)
                } else {
                    const prevIndex = currentIndex > 0 ? currentIndex - 1 : filteredClips.length - 1
                    setSelectedClipId(filteredClips[prevIndex]?.id || null)
                }
            }
            
            // Enter to copy selected clip
            if (event.key === 'Enter' && selectedClipId) {
                const selectedClip = clips.find(clip => clip.id === selectedClipId)
                if (selectedClip) {
                    handleCopyClip(selectedClip.content)
                }
            }
            
            // Delete to remove selected clip
            if (event.key === 'Delete' && selectedClipId) {
                handleDeleteClip(selectedClipId)
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [selectedClipId, clips, filteredClips])

    const loadClips = async () => {
        try {
            console.log('🔍 [DEBUG] App: Starting to load clips')
            setLoading(true)
            const allClips = await getAllClips()
            console.log('🔍 [DEBUG] App: Received clips from hook:', allClips.length)
            console.log('🔍 [DEBUG] App: First few clips:', allClips.slice(0, 3))
            setClips(allClips)
            setFilteredClips(allClips)
            console.log('✅ [DEBUG] App: Successfully set clips in state')
        } catch (error) {
            console.error('❌ [DEBUG] App: Failed to load clips:', error)
            console.error('❌ [DEBUG] App: Error details:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteClip = async (clipId: string) => {
        try {
            await deleteClip(clipId)
            setClips(prev => prev.filter(clip => clip.id !== clipId))
            setFilteredClips(prev => prev.filter(clip => clip.id !== clipId))
            // Clear selection if deleted clip was selected
            if (selectedClipId === clipId) {
                setSelectedClipId(null)
            }
        } catch (error) {
            console.error('Failed to delete clip:', error)
        }
    }

    const handleTogglePin = async (clip: Clip) => {
        try {
            const updatedClip = { ...clip, pinned: !clip.pinned }
            await updateClip(updatedClip)

            setClips(prev => prev.map(c => c.id === clip.id ? updatedClip : c))
            setFilteredClips(prev => prev.map(c => c.id === clip.id ? updatedClip : c))
        } catch (error) {
            console.error('Failed to toggle pin:', error)
        }
    }

    const handleCopyClip = async (content: string) => {
        try {
            await writeToClipboard(content)
            console.log('✅ [DEBUG] App: Successfully copied to clipboard')
            // Optional: Show a toast notification here
        } catch (error) {
            console.error('Failed to copy to clipboard:', error)
        }
    }

    const handleClipClick = (clipId: string) => {
        setSelectedClipId(clipId)
    }

    const handleFiltersChange = (newFilters: SearchFilters) => {
        setFilters(newFilters)
        // Apply filters to clips
        let filtered = clips

        if (newFilters.domain) {
            filtered = filtered.filter(clip => clip.domain === newFilters.domain)
        }
        if (newFilters.contentType) {
            filtered = filtered.filter(clip => clip.contentType === newFilters.contentType)
        }
        if (newFilters.pinned !== undefined) {
            filtered = filtered.filter(clip => clip.pinned === newFilters.pinned)
        }

        setFilteredClips(filtered)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
            </div>
        )
    }

    return (
        <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
            {/* Header */}
            <div className="flex-shrink-0 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
                <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search clips..."
                />
                <FilterBar
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                    clips={clips}
                />
                {/* Keyboard shortcuts hint */}
                {filteredClips.length > 0 && (
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        💡 Tip: Use <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600">↑</kbd> <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600">↓</kbd> to navigate, <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600">Ctrl+C</kbd> or <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600">Enter</kbd> to copy
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                {filteredClips.length === 0 ? (
                    <EmptyState hasClips={clips.length > 0} />
                ) : (
                    <motion.div
                        className="p-4 space-y-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                    >
                        {filteredClips.map((clip, index) => (
                            <motion.div
                                key={clip.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.3,
                                    delay: index * 0.05,
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 30
                                }}
                            >
                                <ClipCard
                                    clip={clip}
                                    onDelete={handleDeleteClip}
                                    onTogglePin={handleTogglePin}
                                    onCopy={handleCopyClip}
                                    isSelected={selectedClipId === clip.id}
                                    onClick={() => handleClipClick(clip.id)}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    )
}

// Initialize React app
const container = document.getElementById('root')
if (container) {
    const root = createRoot(container)
    root.render(<App />)
}
