import React, { useState, useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import { motion, AnimatePresence } from 'framer-motion'
import { Clip } from '../types'
import { useClipboard } from '../sidepanel/hooks/useClipboard'
import { useKeyboard } from '../sidepanel/hooks/useKeyboard'
import './QuickPaste.css'

function QuickPaste() {
    const [clips, setClips] = useState<Clip[]>([])
    const [filteredClips, setFilteredClips] = useState<Clip[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [isVisible, setIsVisible] = useState(false)
    const searchInputRef = useRef<HTMLInputElement>(null)

    const { getAllClips, writeToClipboard } = useClipboard()

    useEffect(() => {
        loadClips()

        // Listen for messages from background script
        const handleMessage = (message: any) => {
            if (message.type === 'TOGGLE_OVERLAY') {
                setIsVisible(prev => !prev)
                if (!isVisible) {
                    setTimeout(() => searchInputRef.current?.focus(), 100)
                }
            }
        }

        chrome.runtime.onMessage.addListener(handleMessage)
        return () => chrome.runtime.onMessage.removeListener(handleMessage)
    }, [isVisible])

    useEffect(() => {
        if (searchQuery.trim()) {
            const filtered = clips.filter(clip =>
                clip.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                clip.pageTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                clip.domain.toLowerCase().includes(searchQuery.toLowerCase())
            )
            setFilteredClips(filtered)
        } else {
            setFilteredClips(clips)
        }
        setSelectedIndex(0)
    }, [searchQuery, clips])

    const loadClips = async () => {
        try {
            const allClips = await getAllClips()
            setClips(allClips)
            setFilteredClips(allClips)
        } catch (error) {
            console.error('Failed to load clips:', error)
        }
    }

    const handleKeyDown = (event: React.KeyboardEvent) => {
        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault()
                setSelectedIndex(prev => Math.min(prev + 1, filteredClips.length - 1))
                break
            case 'ArrowUp':
                event.preventDefault()
                setSelectedIndex(prev => Math.max(prev - 1, 0))
                break
            case 'Enter':
                event.preventDefault()
                if (filteredClips[selectedIndex]) {
                    handleSelectClip(filteredClips[selectedIndex])
                }
                break
            case 'Escape':
                event.preventDefault()
                setIsVisible(false)
                break
        }
    }

    const handleSelectClip = async (clip: Clip) => {
        try {
            await writeToClipboard(clip.content)
            setIsVisible(false)

            // Notify background script that we're done
            chrome.runtime.sendMessage({ type: 'OVERLAY_CLOSED' })
        } catch (error) {
            console.error('Failed to copy clip:', error)
        }
    }

    const handleClose = () => {
        setIsVisible(false)
        chrome.runtime.sendMessage({ type: 'OVERLAY_CLOSED' })
    }

    useKeyboard({
        onToggleOverlay: () => setIsVisible(prev => !prev),
        onEscape: handleClose
    })

    if (!isVisible) return null

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-[9999] flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
            >
                {/* Backdrop */}
                <motion.div
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    onClick={handleClose}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                />

                {/* Overlay */}
                <motion.div
                    className="relative w-full max-w-2xl mx-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30
                    }}
                    onKeyDown={handleKeyDown}
                    tabIndex={-1}
                >
                    {/* Header */}
                    <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    Quick Paste
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {filteredClips.length} clip{filteredClips.length !== 1 ? 's' : ''} available
                                </p>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="p-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search clips..."
                                className="w-full pl-10 pr-4 py-3 text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Clips List */}
                    <div className="max-h-96 overflow-y-auto">
                        {filteredClips.length === 0 ? (
                            <div className="p-8 text-center">
                                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <p className="text-gray-500 dark:text-gray-400">
                                    {searchQuery ? 'No clips match your search' : 'No clips available'}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-1 p-2">
                                {filteredClips.map((clip, index) => (
                                    <motion.div
                                        key={clip.id}
                                        className={`p-3 rounded-lg cursor-pointer transition-all ${index === selectedIndex
                                                ? 'bg-accent/10 border border-accent/20'
                                                : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                                            }`}
                                        onClick={() => handleSelectClip(clip)}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.02 }}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                                    {clip.contentType === 'text' ? '📄' :
                                                        clip.contentType === 'code' ? '💻' :
                                                            clip.contentType === 'url' ? '🔗' :
                                                                clip.contentType === 'image' ? '🖼️' : '🌐'}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm text-gray-900 dark:text-gray-100 line-clamp-2">
                                                    {clip.content}
                                                </div>
                                                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                    <span>{clip.domain}</span>
                                                    <span>•</span>
                                                    <span>{new Date(clip.timestamp).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50">
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-4">
                                <span>↑↓ Navigate</span>
                                <span>↵ Select</span>
                                <span>⎋ Close</span>
                            </div>
                            <div>
                                {filteredClips.length > 0 && (
                                    <span>{selectedIndex + 1} of {filteredClips.length}</span>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

// Initialize React app
const container = document.getElementById('root')
if (container) {
    const root = createRoot(container)
    root.render(<QuickPaste />)
}
