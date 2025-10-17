import React from "react";

interface EmptyStateProps {
    hasClips: boolean;
    isFiltered: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({ hasClips, isFiltered }) => {
    if (hasClips && isFiltered) {
        // User has clips but filter/search returned no results
        return (
            <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center mb-6">
                    <svg
                        className="w-7 h-7 text-gray-400 dark:text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>
                <h3 className="text-lg font-light text-gray-900 dark:text-white mb-2">
                    No clips found
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-500 max-w-xs">
                    Try adjusting your search or filter to find what you're
                    looking for
                </p>
            </div>
        );
    }

    // No clips at all - onboarding state
    return (
        <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
            {/* Icon */}
            <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center mb-8">
                <svg
                    className="w-9 h-9 text-gray-400 dark:text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                </svg>
            </div>

            {/* Title */}
            <h3 className="text-xl font-light tracking-tight text-gray-900 dark:text-white mb-3">
                Your clips will appear here
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-12 max-w-sm leading-relaxed">
                Copy any text from a webpage and it will be automatically saved
                with context
            </p>

            {/* Instructions */}
            <div className="w-full max-w-sm space-y-6">
                <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-gray-900 dark:bg-white flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-white dark:text-gray-900">
                            1
                        </span>
                    </div>
                    <div className="flex-1 text-left">
                        <p className="text-sm text-gray-900 dark:text-white font-medium mb-1">
                            Copy text
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 leading-relaxed">
                            Select and copy any text from any webpage using{" "}
                            <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-900 rounded text-[10px] font-mono">
                                ⌘C
                            </kbd>{" "}
                            or{" "}
                            <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-900 rounded text-[10px] font-mono">
                                Ctrl+C
                            </kbd>
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-gray-900 dark:bg-white flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-white dark:text-gray-900">
                            2
                        </span>
                    </div>
                    <div className="flex-1 text-left">
                        <p className="text-sm text-gray-900 dark:text-white font-medium mb-1">
                            Automatic save
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 leading-relaxed">
                            Your clip is saved instantly with the page title,
                            domain, and timestamp
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-gray-900 dark:bg-white flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-white dark:text-gray-900">
                            3
                        </span>
                    </div>
                    <div className="flex-1 text-left">
                        <p className="text-sm text-gray-900 dark:text-white font-medium mb-1">
                            Quick access
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 leading-relaxed">
                            Click any clip to copy it back to your clipboard in
                            an instant
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmptyState;
