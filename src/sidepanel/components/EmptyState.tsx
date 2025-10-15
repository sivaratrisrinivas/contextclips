// import React from 'react'
import { motion } from 'framer-motion'

interface EmptyStateProps {
    hasClips: boolean
}

export function EmptyState({ hasClips }: EmptyStateProps) {
    if (hasClips) {
        return (
            <motion.div
                className="flex flex-col items-center justify-center h-full text-center p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    No clips found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Try adjusting your search or filters
                </p>
            </motion.div>
        )
    }

    return (
        <motion.div
            className="flex flex-col items-center justify-center h-full text-center p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="w-20 h-20 bg-gradient-to-br from-accent/20 to-accent/10 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Welcome to Context Clips
            </h3>

            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 max-w-sm">
                Your clipboard history will appear here. Start copying text, code, or links from any website to see them organized by context.
            </p>

            <div className="space-y-3 text-left">
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium text-accent">1</span>
                    </div>
                    <span>Copy any text, code, or link from a webpage</span>
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium text-accent">2</span>
                    </div>
                    <span>Your clips will be automatically captured and categorized</span>
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium text-accent">3</span>
                    </div>
                    <span>Use Cmd+Shift+V to quickly paste from your history</span>
                </div>
            </div>
        </motion.div>
    )
}
