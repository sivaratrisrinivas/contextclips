# CRITICAL: How to Properly Reload the Extension

## The Problem
Chrome aggressively caches extension code. Just clicking "Reload" might not be enough. You need to force a complete refresh.

## The Solution - Follow These Exact Steps:

### Step 1: Remove the Extension
1. Go to `chrome://extensions/`
2. Find "Context Clips"
3. Click **"Remove"** button (trash icon)
4. Confirm removal

### Step 2: Clear Extension Cache (Important!)
1. Still on `chrome://extensions/`
2. Click "Clear all" or "Developer mode" toggle off then on

### Step 3: Load Fresh Extension
1. Click **"Load unpacked"** button
2. Navigate to `/app/dist` folder
3. Select it and click "Select Folder"

### Step 4: Verify New Code is Running
1. Click on "Service Worker" link under the extension
2. Look for these EXACT log messages in the console:
   ```
   🚀 [SERVICE WORKER v2.0] Starting up...
   🚀 [SERVICE WORKER v2.0] Using chrome.storage.local database
   🚀 [STORAGE v2.0] Loading chrome.storage.local database layer
   🚀 [STORAGE v2.0] Version: 2.0-chrome-storage
   🚀 [STORAGE v2.0] Database ready!
   ```

**If you DON'T see these messages with "v2.0", the old code is still cached!**

### Step 5: Test
1. Go to any webpage
2. Copy some text (Ctrl+C)
3. You should see in service worker console:
   ```
   📋 [SERVICE WORKER v2.0] Capturing clipboard
   ➕ [STORAGE v2.0] Adding clip: ...
   ✅ [STORAGE v2.0] Clip added. New total: 1
   ```

4. Click extension icon to open sidepanel
5. Right-click in sidepanel and select "Inspect"
6. In sidepanel console, you should see:
   ```
   🚀 [STORAGE v2.0] Loading chrome.storage.local database layer
   📥 [STORAGE v2.0] Getting all clips
   📊 [STORAGE v2.0] Retrieved X clips
   ```

## What Changed in v2.0?

1. **Removed IndexedDB completely** - It was causing context isolation issues
2. **Using chrome.storage.local** - Shared across all extension contexts
3. **Version tracking** - You can now verify which code is running
4. **Cleaner logs** - Easier to debug with v2.0 markers

## If It Still Doesn't Work

Try this nuclear option:

1. Close ALL Chrome windows
2. Delete extension data:
   - On Mac: `~/Library/Application Support/Google/Chrome/Default/Extensions/`
   - On Windows: `%LOCALAPPDATA%\Google\Chrome\User Data\Default\Extensions\`
   - On Linux: `~/.config/google-chrome/Default/Extensions/`
3. Restart Chrome
4. Load extension fresh

## Quick Verification Script

Paste this in the service worker console to verify storage is working:

```javascript
// Add a test clip
await chrome.storage.local.set({ contextClips: [{ id: 'test', content: 'Test clip', timestamp: Date.now(), domain: 'test.com', pageTitle: 'Test', sourceUrl: 'http://test.com', contentType: 'text', pinned: false, tags: [] }] });

// Retrieve it
const result = await chrome.storage.local.get('contextClips');
console.log('Test clips:', result.contextClips);
```

If this works, the storage layer is fine and it's a code loading issue.
