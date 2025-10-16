import React from 'react';
import type { Clip } from '../../types';

interface ClipItemProps {
  clip: Clip;
  isSelected: boolean;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

const ClipItem: React.FC<ClipItemProps> = ({
  clip,
  isSelected,
  onClick,
  onDelete,
}) => {
  const formatTimeAgo = (timestamp: number): string => {
    const minutes = Math.floor((Date.now() - timestamp) / 60000);
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(e);
  };

  return (
    <div
      onClick={onClick}
      className={`
        group relative p-4 rounded-lg border-2 cursor-pointer transition-all
        ${
          isSelected
            ? 'border-green-500 bg-green-950 bg-opacity-30'
            : 'border-gray-700 bg-gray-800 hover:border-green-500 hover:bg-gray-750'
        }
      `}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="text-sm text-white mb-2 break-words line-clamp-3">
            {clip.content}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="truncate">{clip.domain}</span>
            <span>•</span>
            <span>{formatTimeAgo(clip.timestamp)}</span>
          </div>
        </div>

        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-red-500 hover:bg-opacity-20 rounded"
          title="Delete clip"
        >
          <svg
            className="w-4 h-4 text-gray-400 hover:text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>

      {clip.title && (
        <div className="mt-2 text-xs text-gray-500 truncate" title={clip.title}>
          {clip.title}
        </div>
      )}
    </div>
  );
};

export default ClipItem;
