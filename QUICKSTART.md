# Quick Start Guide

Get Context Clips up and running in 5 minutes!

## Prerequisites

- Node.js 16+ installed
- Chrome browser
- Git (optional)

## Installation

### Step 1: Get the Code

```bash
# Clone or download the repository
git clone <repository-url>
cd contextclips
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Build the Extension

```bash
npm run build
```

This creates a `dist` folder with the compiled extension.

### Step 4: Load in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right corner)
3. Click **Load unpacked**
4. Select the `dist` folder from your project directory
5. You should see "Context Clips" appear in your extensions list

## Usage

### Start Capturing Clips

1. Visit any website
2. Copy some text (`Ctrl+C` or `Cmd+C`)
3. Click the Context Clips icon in your toolbar
4. See your clip appear in the side panel!

### Keyboard Shortcuts

- **↑ / ↓** - Navigate between clips
- **Enter** - Copy selected clip to clipboard
- **Delete** - Remove selected clip
- **Esc** - Clear search

### Search

Type in the search bar to filter clips by:
- Content text
- Website domain
- Page title

## Development

### Hot Reload Development

```bash
npm run dev
```

After making changes:
1. Save your files
2. Go to `chrome://extensions/`
3. Click the reload icon on Context Clips
4. Test your changes

### Check for Errors

```bash
npm run type-check
```

## Troubleshooting

### Extension not loading?

- Make sure you built it: `npm run build`
- Check for errors in `chrome://extensions/`
- Try clicking "Reload" on the extension

### Clips not saving?

- Check the service worker console (click "Inspect views: service worker")
- Make sure clipboard permissions are granted
- Try on a different website

### Build failing?

```bash
# Clean and rebuild
npm run clean
npm install
npm run build
```

## Next Steps

- Read [README.md](README.md) for full documentation
- Check [DEVELOPMENT.md](DEVELOPMENT.md) for detailed development guide
- See [REFACTORING_SUMMARY.md](REFACTORING_SUMMARY.md) for architecture details

## Support

Found a bug? Have a feature request? Open an issue on GitHub!

---

**That's it! You're ready to use Context Clips! 🎉**