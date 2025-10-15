import { useState } from 'react'
import { motion } from 'framer-motion'
import { Clip } from '../../types'

interface ClipCardProps {
    clip: Clip
    onDelete: (id: string) => void
    onTogglePin: (clip: Clip) => void
    onCopy: (content: string) => void
}

export function ClipCard({ clip, onDelete, onTogglePin, onCopy }: ClipCardProps) {
    const [isHovered, setIsHovered] = useState(false)
    // const [showActions, setShowActions] = useState(false)

    const formatTime = (timestamp: number) => {
        const now = Date.now()
        const diff = now - timestamp
        const minutes = Math.floor(diff / 60000)
        const hours = Math.floor(diff / 3600000)
        const days = Math.floor(diff / 86400000)

        if (minutes < 1) return 'Just now'
        if (minutes < 60) return `${minutes}m ago`
        if (hours < 24) return `${hours}h ago`
        if (days < 7) return `${days}d ago`
        return new Date(timestamp).toLocaleDateString()
    }

    const getContentTypeIcon = (type: string) => {
        const icons: { [key: string]: string } = {
            'text': '📄',
            'code': '💻',
            'url': '🔗',
            'image': '🖼️',
            'html': '🌐'
        }
        return icons[type] || '📄'
    }

    const handleCopy = () => {
        onCopy(clip.content)
        // Could add a brief success animation here
    }

    return (
        <motion.div
            className="group relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-4 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.01]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCopy}
        >
            {/* Pin indicator */}
            {clip.pinned && (
                <div className="absolute top-3 right-3">
                    <svg className="h-4 w-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z" />
                    </svg>
                </div>
            )}

            {/* Content */}
            <div className="pr-8">
                <div className="clip-preview mb-3">
                    {clip.content}
                </div>

                {/* Metadata */}
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="metadata-pill">
                        {getContentTypeIcon(clip.contentType)} {clip.contentType}
                    </span>
                    <span className="metadata-pill">
                        {clip.domain}
                    </span>
                    <span className="metadata-pill">
                        {formatTime(clip.timestamp)}
                    </span>
                </div>
            </div>

            {/* Actions */}
            <motion.div
                className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
            >
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        onTogglePin(clip)
                    }}
                    className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    title={clip.pinned ? 'Unpin' : 'Pin'}
                >
                    <svg
                        className={`h-3 w-3 ${clip.pinned ? 'text-accent' : 'text-gray-500'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z" />
                    </svg>
                </button>

                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        onDelete(clip.id)
                    }}
                    className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-red-100 dark:hover:bg-red-900/20 text-gray-500 hover:text-red-500 transition-colors"
                    title="Delete"
                >
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </motion.div>
        </motion.div>
    )
}
