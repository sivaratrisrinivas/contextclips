import React, { useState, useEffect, useCallback } from "react";
import type { Clip } from "../types";
import ClipList from "./components/ClipList";
import SearchBar from "./components/SearchBar";
import EmptyState from "./components/EmptyState";

const App: React.FC = () => {
    const [clips, setClips] = useState<Clip[]>([]);
    const [filteredClips, setFilteredClips] = useState<Clip[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDomain, setSelectedDomain] = useState<string>("all");
    const [isLoading, setIsLoading] = useState(true);

    // Load clips from background
    const loadClips = useCallback(async () => {
        try {
            const response = await chrome.runtime.sendMessage({
                type: "GET_CLIPS",
            });
            if (response?.success) {
                setClips(response.clips);
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Error loading clips:", error);
            setIsLoading(false);
        }
    }, []);

    // Initial load
    useEffect(() => {
        loadClips();
    }, [loadClips]);

    // Listen for updates from background
    useEffect(() => {
        const handleMessage = (message: any) => {
            if (message.type === "CLIPS_UPDATED") {
                loadClips();
            }
        };

        chrome.runtime.onMessage.addListener(handleMessage);
        return () => chrome.runtime.onMessage.removeListener(handleMessage);
    }, [loadClips]);

    // Get unique domains from clips
    const domains = Array.from(
        new Set(clips.map((clip) => clip.domain)),
    ).sort();

    // Filter clips based on search query and domain
    useEffect(() => {
        let filtered = clips;

        // Filter by domain
        if (selectedDomain !== "all") {
            filtered = filtered.filter(
                (clip) => clip.domain === selectedDomain,
            );
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (clip) =>
                    clip.content.toLowerCase().includes(query) ||
                    clip.domain.toLowerCase().includes(query) ||
                    clip.title.toLowerCase().includes(query),
            );
        }

        setFilteredClips(filtered);
    }, [searchQuery, selectedDomain, clips]);

    const handleCopy = async (clip: Clip) => {
        try {
            await navigator.clipboard.writeText(clip.content);
            // Visual feedback handled in ClipItem
        } catch (error) {
            console.error("Failed to copy:", error);
        }
    };

    const handleDelete = async (clipId: string) => {
        try {
            const response = await chrome.runtime.sendMessage({
                type: "DELETE_CLIP",
                clipId,
            });

            if (response?.success) {
                const newClips = clips.filter((c) => c.id !== clipId);
                setClips(newClips);
            }
        } catch (error) {
            console.error("Error deleting clip:", error);
        }
    };

    const handleClearAll = async () => {
        try {
            const response = await chrome.runtime.sendMessage({
                type: "CLEAR_ALL",
            });
            if (response?.success) {
                setClips([]);
                setFilteredClips([]);
            }
        } catch (error) {
            console.error("Error clearing clips:", error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-950">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-gray-300 dark:border-gray-700 border-t-gray-900 dark:border-t-white rounded-full animate-spin"></div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        Loading clips...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            {/* Header */}
            <div className="sticky top-0 z-20 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-light tracking-tight text-gray-900 dark:text-white">
                            Clips
                        </h1>
                        {clips.length > 0 && (
                            <button
                                onClick={handleClearAll}
                                className="text-xs font-medium text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                            >
                                Clear All
                            </button>
                        )}
                    </div>

                    <SearchBar
                        value={searchQuery}
                        onChange={setSearchQuery}
                        selectedDomain={selectedDomain}
                        onDomainChange={setSelectedDomain}
                        domains={domains}
                        totalClips={clips.length}
                        filteredClips={filteredClips.length}
                    />
                </div>
            </div>

            {/* Content */}
            <div className="px-6 py-4">
                {filteredClips.length === 0 ? (
                    <EmptyState
                        hasClips={clips.length > 0}
                        isFiltered={
                            searchQuery.trim() !== "" ||
                            selectedDomain !== "all"
                        }
                    />
                ) : (
                    <ClipList
                        clips={filteredClips}
                        onCopy={handleCopy}
                        onDelete={handleDelete}
                    />
                )}
            </div>

            {/* Footer hint - only show when there are clips */}
            {filteredClips.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white dark:from-gray-950 via-white/90 dark:via-gray-950/90 to-transparent py-6 px-6 pointer-events-none">
                    <div className="text-center text-xs text-gray-400 dark:text-gray-600">
                        Click to copy • Hold ⌘/Ctrl to open source
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
