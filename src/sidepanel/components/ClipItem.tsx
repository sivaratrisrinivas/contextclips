import React, { useState } from "react";
import type { Clip } from "../../types";

interface ClipItemProps {
    clip: Clip;
    onCopy: () => void;
    onDelete: (e: React.MouseEvent) => void;
}

const ClipItem: React.FC<ClipItemProps> = ({ clip, onCopy, onDelete }) => {
    const [isCopied, setIsCopied] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const formatTimeAgo = (timestamp: number): string => {
        const minutes = Math.floor((Date.now() - timestamp) / 60000);
        if (minutes < 1) return "now";
        if (minutes < 60) return `${minutes}m`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days}d`;
        const weeks = Math.floor(days / 7);
        if (weeks < 4) return `${weeks}w`;
        return new Date(timestamp).toLocaleDateString();
    };

    const handleClick = async (e: React.MouseEvent) => {
        // Cmd/Ctrl + Click to open source URL
        if (e.metaKey || e.ctrlKey) {
            e.preventDefault();
            window.open(clip.url, "_blank");
            return;
        }

        // Regular click to copy
        onCopy();
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(e);
    };

    return (
        <div
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative cursor-pointer"
        >
            {/* Main Card */}
            <div
                className={`
                    relative p-5 rounded-2xl transition-all duration-300 ease-out
                    ${
                        isCopied
                            ? "bg-gray-900 dark:bg-white scale-[0.98]"
                            : "bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }
                `}
            >
                {/* Content */}
                <div className="relative">
                    <p
                        className={`
                            text-[15px] leading-relaxed mb-4 transition-colors duration-300
                            ${
                                isCopied
                                    ? "text-white dark:text-gray-900"
                                    : "text-gray-900 dark:text-white"
                            }
                        `}
                    >
                        {clip.content}
                    </p>

                    {/* Metadata */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs">
                            <span
                                className={`
                                    font-medium transition-colors duration-300
                                    ${
                                        isCopied
                                            ? "text-white/70 dark:text-gray-900/70"
                                            : "text-gray-500 dark:text-gray-400"
                                    }
                                `}
                            >
                                {clip.domain}
                            </span>
                            <span
                                className={`
                                    transition-colors duration-300
                                    ${
                                        isCopied
                                            ? "text-white/40 dark:text-gray-900/40"
                                            : "text-gray-400 dark:text-gray-600"
                                    }
                                `}
                            >
                                •
                            </span>
                            <span
                                className={`
                                    transition-colors duration-300
                                    ${
                                        isCopied
                                            ? "text-white/40 dark:text-gray-900/40"
                                            : "text-gray-400 dark:text-gray-600"
                                    }
                                `}
                            >
                                {formatTimeAgo(clip.timestamp)}
                            </span>
                        </div>

                        {/* Delete Button */}
                        <button
                            onClick={handleDelete}
                            className={`
                                p-1.5 rounded-full transition-all duration-200
                                ${
                                    isHovered
                                        ? "opacity-100 translate-x-0"
                                        : "opacity-0 translate-x-2"
                                }
                                ${
                                    isCopied
                                        ? "hover:bg-white/10 dark:hover:bg-gray-900/10"
                                        : "hover:bg-gray-200 dark:hover:bg-gray-700"
                                }
                            `}
                            title="Delete clip"
                        >
                            <svg
                                className={`
                                    w-3.5 h-3.5 transition-colors duration-300
                                    ${
                                        isCopied
                                            ? "text-white/60 dark:text-gray-900/60 hover:text-white dark:hover:text-gray-900"
                                            : "text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400"
                                    }
                                `}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Page Title */}
                    {clip.title && (
                        <div
                            className={`
                                mt-3 pt-3 border-t text-xs truncate transition-colors duration-300
                                ${
                                    isCopied
                                        ? "border-white/10 dark:border-gray-900/10 text-white/50 dark:text-gray-900/50"
                                        : "border-gray-200 dark:border-gray-800 text-gray-400 dark:text-gray-600"
                                }
                            `}
                            title={clip.title}
                        >
                            {clip.title}
                        </div>
                    )}
                </div>

                {/* Copied Indicator */}
                {isCopied && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 dark:bg-gray-900/10 backdrop-blur-sm">
                            <svg
                                className="w-4 h-4 text-white dark:text-gray-900"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                            <span className="text-sm font-medium text-white dark:text-gray-900">
                                Copied
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClipItem;
