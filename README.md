# Context Clips

A modern, context-aware clipboard manager Chrome extension that intelligently organizes your copied content by source, type, and time.

## ✨ Features

- **🎯 Smart Capture**: Automatically captures clipboard content with rich context (URL, page title, timestamp)
- **📂 Organized History**: View all your clips in a clean, searchable interface
- **⚡ Quick Access**: Fast keyboard navigation with arrow keys
- **🔍 Powerful Search**: Find clips instantly by content, domain, or page title
- **🎨 Beautiful UI**: Modern dark theme with smooth interactions
- **🔒 Privacy First**: All data stored locally in your browser - no cloud, no tracking
- **⌨️ Keyboard Shortcuts**: Full keyboard navigation support

## 🚀 Installation

### From Source

1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd contextclips
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

4. Load in Chrome:
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder

## 💡 Usage

### Capturing Clips

Simply copy text from any webpage using `Ctrl+C` (Windows/Linux) or `Cmd+C` (Mac). The extension automatically captures:
- The copied text content
- Source domain
- Page title
- Full URL
- Timestamp

### Accessing Clips

Click the extension icon in your toolbar to open the side panel with all your clips.

### Keyboard Shortcuts

- `↑` / `↓` - Navigate between clips
- `Enter` - Copy selected clip to clipboard
- `Delete` - Remove selected clip
- `Esc` - Clear search filter

### Searching

Use the search bar to filter clips by:
- Content text
- Website domain
- Page title

## 🛠️ Development

### Prerequisites

- Node.js 16+ and npm
- Chrome browser

### Development Mode

Run the development server with hot reload:

```bash
npm run dev
```

Then load the extension in Chrome as described in the Installation section.

### Build for Production

```bash
npm run build
```

### Type Checking

```bash
npm run type-check
```

## 📁 Project Structure

```
contextclips/
├── src/
│   ├── background/
│   │   └── service-worker.ts      # Background service worker
│   ├── content/
│   │   └── content-script.ts      # Content script for capture
│   ├── sidepanel/
│   │   ├── components/            # React components
│   │   ├── App.tsx                # Main app component
│   │   ├── main.tsx               # Entry point
│   │   ├── index.html             # HTML template
│   │   └── index.css              # Styles
│   └── types/
│       └── index.ts               # TypeScript types
├── public/
│   └── icons/                     # Extension icons
├── manifest.json                  # Extension manifest
├── vite.config.ts                 # Vite configuration
├── tailwind.config.js             # Tailwind CSS config
└── tsconfig.json                  # TypeScript config
```

## 🏗️ Architecture

- **Manifest V3**: Modern Chrome extension architecture
- **React 18**: UI framework with TypeScript
- **Vite**: Fast build tool with HMR
- **Tailwind CSS**: Utility-first CSS framework
- **Chrome Storage API**: Local data persistence
- **TypeScript**: Full type safety

## 🔒 Privacy & Security

- ✅ All data stored locally in your browser
- ✅ No external API calls
- ✅ No data collection or tracking
- ✅ No analytics
- ✅ Open source and auditable
- ✅ No permissions beyond clipboard and storage

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see LICENSE file for details

## 🐛 Known Issues

None at the moment. Please report issues on the GitHub repository.

## 🗺️ Roadmap

- [ ] Export/import clips
- [ ] Custom keyboard shortcuts
- [ ] Rich content support (images, links)
- [ ] Categories and tags
- [ ] Sync across devices (optional)
- [ ] Dark/light theme toggle

## 💬 Support

For bugs, questions, or feature requests, please open an issue on GitHub.