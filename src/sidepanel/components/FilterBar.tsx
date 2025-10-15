// import React from 'react'
import { motion } from 'framer-motion'
import { SearchFilters, Clip } from '../../types'

interface FilterBarProps {
    filters: SearchFilters
    onFiltersChange: (filters: SearchFilters) => void
    clips: Clip[]
}

export function FilterBar({ filters, onFiltersChange, clips }: FilterBarProps) {
    const domains = [...new Set(clips.map(clip => clip.domain))].sort()
    const contentTypes = [...new Set(clips.map(clip => clip.contentType))].sort()

    const formatContentType = (type: string) => {
        const typeMap: { [key: string]: string } = {
            'text': 'Text',
            'code': 'Code',
            'url': 'Links',
            'image': 'Images',
            'html': 'HTML'
        }
        return typeMap[type] || type
    }

    const clearFilters = () => {
        onFiltersChange({})
    }

    const hasActiveFilters = Object.values(filters).some(value => value !== undefined)

    return (
        <motion.div
            className="mt-3 flex flex-wrap gap-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
        >
            {/* Domain Filter */}
            <select
                value={filters.domain || ''}
                onChange={(e) => onFiltersChange({ ...filters, domain: e.target.value || undefined })}
                className="text-xs bg-white/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-accent/20"
            >
                <option value="">All domains</option>
                {domains.map(domain => (
                    <option key={domain} value={domain}>
                        {domain}
                    </option>
                ))}
            </select>

            {/* Content Type Filter */}
            <select
                value={filters.contentType || ''}
                onChange={(e) => onFiltersChange({ ...filters, contentType: e.target.value as any || undefined })}
                className="text-xs bg-white/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-accent/20"
            >
                <option value="">All types</option>
                {contentTypes.map(type => (
                    <option key={type} value={type}>
                        {formatContentType(type)}
                    </option>
                ))}
            </select>

            {/* Pinned Filter */}
            <button
                onClick={() => onFiltersChange({ ...filters, pinned: filters.pinned === undefined ? true : undefined })}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${filters.pinned === true
                        ? 'bg-accent/10 border-accent text-accent'
                        : 'bg-white/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50 text-gray-600 dark:text-gray-400'
                    }`}
            >
                Pinned
            </button>

            {/* Clear Filters */}
            {hasActiveFilters && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={clearFilters}
                    className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                    Clear
                </motion.button>
            )}
        </motion.div>
    )
}
