import React from 'react';

interface EmptyStateProps {
  hasClips: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({ hasClips }) => {
  if (hasClips) {
    // User has clips but search returned no results
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <svg
          className="w-16 h-16 text-gray-600 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-300 mb-2">
          No clips found
        </h3>
        <p className="text-sm text-gray-500">
          Try a different search term or clear your search
        </p>
      </div>
    );
  }

  // No clips at all
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="text-6xl mb-4">📋</div>
      <h3 className="text-lg font-medium text-gray-300 mb-2">
        No clips yet
      </h3>
      <p className="text-sm text-gray-500 mb-6 max-w-sm">
        Start copying text from any webpage and it will appear here automatically
      </p>
      <div className="bg-gray-800 rounded-lg p-4 max-w-md">
        <h4 className="text-sm font-medium text-gray-300 mb-3">
          How to use:
        </h4>
        <ol className="text-xs text-gray-400 space-y-2 text-left">
          <li className="flex items-start gap-2">
            <span className="text-green-400 font-bold">1.</span>
            <span>Copy any text from a webpage (Ctrl+C / Cmd+C)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 font-bold">2.</span>
            <span>Your clip will be saved automatically with context</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 font-bold">3.</span>
            <span>Click any clip to copy it back to your clipboard</span>
          </li>
        </ol>
      </div>
    </div>
  );
};

export default EmptyState;
