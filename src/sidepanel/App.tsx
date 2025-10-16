import React, { useState, useEffect, useCallback } from 'react';
import type { Clip } from '../types';
import ClipList from './components/ClipList';
import SearchBar from './components/SearchBar';
import EmptyState from './components/EmptyState';

const App: React.FC = () => {
  const [clips, setClips] = useState<Clip[]>([]);
  const [filteredClips, setFilteredClips] = useState<Clip[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Load clips from background
  const loadClips = useCallback(async () => {
    try {
      const response = await chrome.runtime.sendMessage({ type: 'GET_CLIPS' });
      if (response?.success) {
        setClips(response.clips);
        setFilteredClips(response.clips);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error loading clips:', error);
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
      if (message.type === 'CLIPS_UPDATED') {
        loadClips();
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);
    return () => chrome.runtime.onMessage.removeListener(handleMessage);
  }, [loadClips]);

  // Filter clips based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredClips(clips);
      setSelectedIndex(0);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = clips.filter(
      (clip) =>
        clip.content.toLowerCase().includes(query) ||
        clip.domain.toLowerCase().includes(query) ||
        clip.title.toLowerCase().includes(query)
    );

    setFilteredClips(filtered);
    setSelectedIndex(0);
  }, [searchQuery, clips]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (filteredClips.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % filteredClips.length);
          break;

        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredClips.length - 1
          );
          break;

        case 'Enter':
          e.preventDefault();
          if (filteredClips[selectedIndex]) {
            handleCopy(filteredClips[selectedIndex]);
          }
          break;

        case 'Delete':
          e.preventDefault();
          if (filteredClips[selectedIndex]) {
            handleDelete(filteredClips[selectedIndex].id);
          }
          break;

        case 'Escape':
          e.preventDefault();
          setSearchQuery('');
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [filteredClips, selectedIndex]);

  const handleCopy = async (clip: Clip) => {
    try {
      await navigator.clipboard.writeText(clip.content);
      console.log('✅ Copied to clipboard');

      // Visual feedback could be added here
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleDelete = async (clipId: string) => {
    try {
      const response = await chrome.runtime.sendMessage({
        type: 'DELETE_CLIP',
        clipId,
      });

      if (response?.success) {
        // Update local state immediately for better UX
        const newClips = clips.filter((c) => c.id !== clipId);
        setClips(newClips);

        // Adjust selected index if needed
        if (selectedIndex >= newClips.length && selectedIndex > 0) {
          setSelectedIndex(selectedIndex - 1);
        }
      }
    } catch (error) {
      console.error('Error deleting clip:', error);
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to clear all clips?')) {
      return;
    }

    try {
      const response = await chrome.runtime.sendMessage({ type: 'CLEAR_ALL' });
      if (response?.success) {
        setClips([]);
        setFilteredClips([]);
        setSelectedIndex(0);
      }
    } catch (error) {
      console.error('Error clearing clips:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="sticky top-0 z-10 bg-gray-900 border-b border-gray-800">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-semibold text-green-400 flex items-center gap-2">
              📋 Context Clips
            </h1>
            {clips.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-xs text-gray-500 hover:text-red-400 transition-colors"
              >
                Clear All
              </button>
            )}
          </div>

          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            totalClips={clips.length}
            filteredClips={filteredClips.length}
          />

          <div className="text-xs text-gray-500 mt-2">
            ↑↓ Navigate • Enter Copy • Del Delete • Esc Clear Search
          </div>
        </div>
      </div>

      <div className="p-4">
        {filteredClips.length === 0 ? (
          <EmptyState hasClips={clips.length > 0} />
        ) : (
          <ClipList
            clips={filteredClips}
            selectedIndex={selectedIndex}
            onCopy={handleCopy}
            onDelete={handleDelete}
            onSelect={setSelectedIndex}
          />
        )}
      </div>
    </div>
  );
};

export default App;
