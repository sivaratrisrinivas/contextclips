# Context Clips

A context-aware clipboard manager for the browser that intelligently organizes your copied content by source, type, and time.

## Features

- **Smart Capture**: Automatically captures clipboard content with context (URL, page title, content type)
- **Context Categorization**: Organizes clips by domain, content type, and time
- **Quick Access**: Use `Cmd+Shift+V` to quickly paste from your history
- **Search & Filter**: Find clips instantly with fuzzy search and smart filters
- **Beautiful UI**: Jony Ive-inspired design with smooth animations and dark mode
- **Privacy First**: All data stored locally, no cloud sync

## Installation

1. Clone this repository
2. Run `npm install` to install dependencies
3. Run `npm run build` to build the extension
4. Load the `dist` folder as an unpacked extension in Chrome

## Usage

1. **Copy anything** from any webpage - text, code, links, images
2. **Access your clips** via the side panel or `Cmd+Shift+V` overlay
3. **Search and filter** by domain, content type, or time
4. **Click to paste** any clip back to your clipboard

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check
```

## Architecture

- **Manifest V3** Chrome extension
- **React 18** with TypeScript
- **IndexedDB** for local storage
- **Framer Motion** for animations
- **Tailwind CSS** for styling

## Privacy

- All data stored locally in your browser
- No external API calls or data transmission
- No tracking or analytics
- Open source and auditable

## License

MIT License - see LICENSE file for details
