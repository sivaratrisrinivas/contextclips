# Development Guide

This guide will help you set up and develop Context Clips locally.

## Prerequisites

- **Node.js**: Version 16 or higher
- **npm**: Comes with Node.js
- **Chrome Browser**: For testing the extension
- **Git**: For version control

## Initial Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd contextclips
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Build the extension**:
   ```bash
   npm run build
   ```

4. **Load in Chrome**:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right corner)
   - Click "Load unpacked"
   - Select the `dist` folder from the project

## Development Workflow

### Running in Development Mode

For active development with hot reload:

```bash
npm run dev
```

This starts Vite's development server. After making changes:
1. The extension will rebuild automatically
2. Click the reload icon on the extension card in `chrome://extensions/`
3. Test your changes

### Type Checking

Run TypeScript type checking without building:

```bash
npm run type-check
```

### Building for Production

Create an optimized production build:

```bash
npm run build
```

The output will be in the `dist` folder.

### Clean Build

Remove the dist folder and rebuild:

```bash
npm run clean
npm run build
```

## Project Structure

```
contextclips/
├── src/
│   ├── background/
│   │   └── service-worker.ts      # Background service worker (handles storage)
│   ├── content/
│   │   └── content-script.ts      # Content script (captures copy events)
│   ├── sidepanel/
│   │   ├── components/            # React components
│   │   │   ├── ClipItem.tsx       # Individual clip display
│   │   │   ├── ClipList.tsx       # List of clips
│   │   │   ├── SearchBar.tsx      # Search input
│   │   │   └── EmptyState.tsx     # Empty state display
│   │   ├── App.tsx                # Main app component
│   │   ├── main.tsx               # React entry point
│   │   ├── index.html             # HTML template
│   │   └── index.css              # Tailwind CSS styles
│   └── types/
│       └── index.ts               # TypeScript type definitions
├── public/
│   └── icons/                     # Extension icons
├── manifest.json                  # Chrome extension manifest
├── vite.config.ts                 # Vite build configuration
├── tailwind.config.js             # Tailwind CSS configuration
├── tsconfig.json                  # TypeScript configuration
└── package.json                   # Dependencies and scripts
```

## Key Technologies

- **React 18**: UI framework
- **TypeScript**: Type safety
- **Vite**: Fast build tool with HMR
- **Tailwind CSS**: Utility-first CSS
- **@crxjs/vite-plugin**: Chrome extension support for Vite
- **Chrome Extension Manifest V3**: Latest extension API

## Architecture Overview

### Service Worker (Background)
- Manages chrome.storage.local for persistence
- Handles messages from content script and sidepanel
- Coordinates data flow between components

### Content Script
- Injected into all web pages
- Listens for `copy` events
- Captures clipboard content with context
- Sends data to service worker

### Sidepanel
- React-based UI
- Displays all saved clips
- Provides search and keyboard navigation
- Handles clip operations (copy, delete, clear)

## Message Flow

```
Web Page (copy event)
    ↓
Content Script
    ↓ (SAVE_CLIP message)
Service Worker
    ↓ (stores in chrome.storage.local)
    ↓ (CLIPS_UPDATED message)
Sidepanel (React UI)
```

## Debugging

### Service Worker
1. Go to `chrome://extensions/`
2. Click "Inspect views: service worker"
3. View console logs and debug

### Content Script
1. Open DevTools on any webpage (F12)
2. Check Console for content script logs
3. Look for messages prefixed with "📋"

### Sidepanel
1. Open the sidepanel
2. Right-click anywhere → Inspect
3. DevTools will open for the sidepanel

## Common Issues

### Extension not loading
- Ensure you've run `npm run build` first
- Check for errors in `chrome://extensions/`
- Try disabling and re-enabling the extension

### Changes not reflecting
- Rebuild with `npm run build`
- Click reload icon on extension card
- Hard refresh the test page (Ctrl+Shift+R)

### TypeScript errors
- Run `npm run type-check` to see all errors
- Ensure all imports have proper types
- Check `src/types/index.ts` for type definitions

### Clips not saving
- Check service worker console for errors
- Verify clipboard permissions in manifest.json
- Test on different websites (some may block clipboard access)

## Testing Checklist

Before submitting changes, test:

- [ ] Copy text from multiple websites
- [ ] Clips appear in sidepanel
- [ ] Search functionality works
- [ ] Keyboard navigation (↑↓ Enter Delete Esc)
- [ ] Click to copy works
- [ ] Delete individual clips
- [ ] Clear all clips
- [ ] Reload extension maintains data
- [ ] No console errors in any context

## Code Style

- Use TypeScript for all new code
- Follow existing naming conventions
- Use functional React components with hooks
- Keep components small and focused
- Add JSDoc comments for complex functions
- Use Tailwind CSS for styling (avoid custom CSS)

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Run type-check: `npm run type-check`
5. Build: `npm run build`
6. Submit a pull request

## Resources

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Guide](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)