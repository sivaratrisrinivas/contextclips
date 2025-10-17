# Changelog

All notable changes to Context Clips will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2024

### Complete UI/UX Redesign - Jony Ive Philosophy

A complete redesign of the sidepanel inspired by Apple's minimalist design principles under Jony Ive.

### Design Philosophy

- **Extreme Simplicity** - Reduction of unnecessary UI elements and complexity
- **Content First** - Clips are the hero, UI serves to enhance not compete
- **Material Honesty** - Natural, physics-based animations and interactions
- **Intuitive Design** - Zero learning curve, discoverable interactions

### Added

- **Smart Domain Filtering**
  - Filter clips by website domain with elegant pill buttons
  - "All" view shows everything
  - Individual domain filters for focused browsing
  - Horizontal scrollable domain list
  - Active state clearly indicated with inverted colors

- **Visual Copy Feedback**
  - Card scales to 98% on copy
  - Background color inverts (dark ↔ light)
  - Checkmark badge appears with "Copied" text
  - Returns to normal after 2 seconds
  - Satisfying, tactile feel

- **Progressive Disclosure**
  - Delete buttons only appear on hover
  - Filter count only shows when filtering
  - Footer hints only with clips present
  - Cleaner, less overwhelming interface

- **Enhanced Interactions**
  - Click to copy (most direct action)
  - Cmd/Ctrl + Click to open source page
  - Hover to reveal delete button
  - Smooth slide-in animations

- **Design Documentation**
  - `DESIGN.md` - Complete design philosophy guide
  - Color palette specifications
  - Typography system
  - Animation guidelines
  - Accessibility considerations

### Changed

- **Simplified Interactions**
  - Removed keyboard navigation (arrow keys, enter, delete)
  - Single-click copy instead of enter key
  - Click-based interactions throughout
  - More intuitive for all users

- **Visual Design Overhaul**
  - Clean white/gray-950 backgrounds (light/dark)
  - Minimal color palette focusing on content
  - System fonts for native feel
  - Light font weights (300) for elegance
  - Generous whitespace (8px grid system)
  - Rounded corners (16px border radius)

- **Typography**
  - Header: 24px, font-weight 300
  - Content: 15px with 1.6 line-height
  - Metadata: 12px for domains
  - Timestamps: 11px for hierarchy

- **Search Bar**
  - Refined styling with rounded corners
  - Integrated domain filter pills
  - Cleaner placeholder text
  - Better visual hierarchy

- **Clip Cards**
  - Larger padding (20px)
  - Subtle background colors
  - Smooth hover states
  - Better content readability
  - Metadata positioned for clarity

- **Empty States**
  - Beautiful onboarding with numbered steps
  - Clear instructions for first-time users
  - Different states for no clips vs no results
  - Friendly, welcoming tone

- **Animations**
  - 200-300ms durations
  - Ease-out timing curves
  - Smooth color transitions
  - Natural feeling motion

### Improved

- **Search Functionality**
  - Instant filtering as you type
  - Searches content, domains, and titles
  - Combined with domain filtering
  - Results count display

- **User Experience**
  - No memorization required
  - Natural, discoverable actions
  - Visual feedback for all interactions
  - Reduced cognitive load

- **Accessibility**
  - Proper focus rings for keyboard navigation
  - High contrast ratios (WCAG AAA)
  - Semantic HTML structure
  - System font respect

- **Performance**
  - CSS-only animations
  - No animation libraries
  - Efficient React re-renders
  - Minimal JavaScript bundle

### Removed

- **Keyboard Navigation Complexity**
  - Arrow keys for navigation
  - Enter key to copy
  - Delete key to remove
  - Escape to clear search
  - Selected index state tracking

- **Visual Clutter**
  - Emoji from header (📋)
  - Always-visible keyboard shortcuts
  - Green accent color everywhere
  - Heavy borders and outlines
  - Aggressive hover states

### Technical

- **Component Refactoring**
  - `App.tsx`: Removed keyboard state, added domain filtering
  - `SearchBar.tsx`: Added domain pills, refined styling
  - `ClipItem.tsx`: Added copy feedback, hover states, Cmd+click
  - `ClipList.tsx`: Simplified without selection state
  - `EmptyState.tsx`: Beautiful onboarding design
  - `index.css`: Enhanced scrollbar, animations, focus styles

- **State Management**
  - Added `selectedDomain` state
  - Removed `selectedIndex` state
  - Cleaner filtering logic
  - More efficient re-renders

### Bug Fixes

- Fixed Permissions Policy violation by removing deprecated `unload` event listener
- Chrome automatically handles content script cleanup

---

## [1.0.0] - 2024-10-16

### Major Refactoring Release

Complete rewrite of the extension from vanilla JavaScript to modern React + TypeScript architecture.

### Added

- **React 18 UI Framework**
  - Component-based architecture
  - Full TypeScript type safety
  - Modern hooks-based state management

- **New React Components**
  - `App.tsx` - Main application component with state management
  - `ClipList.tsx` - List container for clips
  - `ClipItem.tsx` - Individual clip display with actions
  - `SearchBar.tsx` - Real-time search input
  - `EmptyState.tsx` - User-friendly empty states

- **Enhanced Features**
  - Real-time search filtering
  - Keyboard navigation (↑↓ for navigation, Enter to copy, Delete to remove)
  - Visual feedback for selected clips
  - Time-ago formatting (just now, Xm ago, Xh ago, Xd ago)
  - Hover effects and smooth transitions
  - Clear all clips functionality

- **Type Safety**
  - Comprehensive TypeScript types in `src/types/index.ts`
  - Message type definitions
  - Response type definitions
  - Utility types for common operations

- **Documentation**
  - `DEVELOPMENT.md` - Comprehensive development guide
  - `QUICKSTART.md` - Fast setup instructions
  - `REFACTORING_SUMMARY.md` - Detailed refactoring documentation
  - `CHANGELOG.md` - This file
  - `LICENSE` - MIT License

- **Build Improvements**
  - Vite build system with HMR
  - Tailwind CSS for styling
  - @crxjs/vite-plugin for Chrome extension support

### Changed

- **Service Worker** (`src/background/service-worker.ts`)
  - Rewritten with async/await
  - Better error handling
  - Structured message handling
  - Improved logging
  - Added MAX_CLIPS constant (1000)
  - Storage key changed from `clips_v4` to `contextclips_data`

- **Content Script** (`src/content/content-script.ts`)
  - Added debouncing to prevent duplicate captures
  - Better clipboard access error handling
  - Duplicate detection
  - Proper cleanup on unload

- **Manifest** (`manifest.json`)
  - Updated to version 1.0.0
  - Cleaned up formatting
  - Better descriptions
  - Added module type to service worker
  - Optimized content script injection

- **Package Configuration** (`package.json`)
  - Removed unused dependency: framer-motion
  - Added proper metadata
  - Improved scripts
  - Better organization

- **Git Configuration** (`.gitignore`)
  - Fixed broken duplicate entries
  - Added comprehensive ignore patterns
  - Added Chrome extension package patterns

- **README.md**
  - Complete rewrite
  - Added emoji icons
  - Expanded all sections
  - Added project structure
  - Added keyboard shortcuts documentation
  - Added troubleshooting section
  - Added roadmap

### Removed

- **Unnecessary Documentation Files** (10 files)
  - `DEBUG_INSTRUCTIONS.md`
  - `FIXES_SUMMARY.md`
  - `FRESH_START_v3.md`
  - `QUICK_FIX.md`
  - `RELOAD_INSTRUCTIONS.md`
  - `RULES.md`
  - `TESTING_GUIDE.md`
  - `USE_DIST_V4.md`
  - `V4_FINAL.md`
  - `debug-instructions.md`

- **Old Build Artifacts**
  - `dist_v4/` folder
  - `.emergent/` folder
  - `.gitconfig` file

- **Inline Code from HTML**
  - Removed 114 lines of inline JavaScript
  - Removed 30 lines of inline CSS
  - Replaced with React components

- **Unused Dependencies**
  - `framer-motion` package

### Fixed

- Broken `.gitignore` with duplicate entries
- Missing type definitions
- Inconsistent error handling
- Memory leaks in event listeners
- Duplicate clip captures

### Technical Details

- **Lines of Code**
  - Deleted: ~500 lines (docs + old code)
  - Modified: ~200 lines (refactored)
  - Added: ~800 lines (new components)
  - Net: +300 lines of production code

- **Type Coverage**
  - Before: 0% (vanilla JS)
  - After: 100% (TypeScript)

- **Component Count**
  - Before: 1 monolithic file
  - After: 6 focused components

### Breaking Changes

⚠️ **Storage Key Change**
- Old: `clips_v4`
- New: `contextclips_data`
- Existing clips will NOT be migrated automatically

⚠️ **Message Type Names**
- Old: `SAVE`, `GET`, `DELETE`
- New: `SAVE_CLIP`, `GET_CLIPS`, `DELETE_CLIP`, `CLEAR_ALL`

### Migration Notes

If upgrading from a previous version and want to preserve clips:
1. Export old clips manually before upgrading
2. Or manually migrate storage key in browser DevTools

## [0.x.x] - Pre-release versions

Previous versions were prototypes with vanilla JavaScript. This changelog starts from the 1.0.0 refactoring.

---

## Roadmap

### [1.1.0] - Planned
- [ ] Export/import clips functionality
- [ ] Categories and tags
- [ ] Rich content support (images, formatted text)
- [ ] Custom keyboard shortcuts

### [1.2.0] - Planned
- [ ] Dark/light theme toggle
- [ ] Advanced search with filters
- [ ] Clip favorites/pinning
- [ ] Statistics dashboard

### [2.0.0] - Future
- [ ] Optional cloud sync
- [ ] Multi-device support
- [ ] Browser sync integration
- [ ] Mobile companion app

---

**Legend:**
- `Added` for new features
- `Changed` for changes in existing functionality
- `Deprecated` for soon-to-be removed features
- `Removed` for removed features
- `Fixed` for bug fixes
- `Security` for vulnerability fixes