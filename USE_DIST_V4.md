# 🚨 CRITICAL - Use This Exact Process

## The Problem
Chrome is caching the old extension code AGGRESSIVELY. Even removing and reloading doesn't clear it because Chrome uses the extension ID to cache.

## The Solution - NEW FOLDER

I've created a **completely separate build folder** called `dist_v4` so Chrome will treat it as a brand new extension with a new ID.

## Installation Steps (DO EXACTLY THIS)

### Step 1: Remove ALL Old Extensions
1. Open: `chrome://extensions/`
2. Find **ANY** extension with "Context" or "Clips" in the name
3. Click **Remove** on EACH one
4. Make sure the list is completely empty of clipboard/context extensions

### Step 2: Clear Chrome Cache
1. Click Chrome menu → Settings
2. Privacy and security → Clear browsing data
3. Select "Cached images and files"
4. Click "Clear data"

### Step 3: Load From NEW Folder
1. Go back to `chrome://extensions/`
2. Enable "Developer mode" (top right)
3. Click **"Load unpacked"**
4. Navigate to: `/app/dist_v4` (NOT dist, use dist_v4!)
5. Click "Select Folder"

### Step 4: Verify v4.0 is ACTUALLY Running

**This is CRITICAL - you MUST verify:**

1. Click **"Service Worker"** link under the extension
2. The console MUST show:

```
🚀 v4.0 STARTED
```

**In GREEN text, large size**

**If you see ANY of these, STOP:**
- ❌ "[DEBUG]" anything
- ❌ "Database" anything  
- ❌ "IndexedDB" anything
- ❌ "Transaction" anything
- ❌ No colored text

**Only proceed if you see the GREEN "🚀 v4.0 STARTED"**

## Testing

1. Open **NEW** tab: https://example.com
2. Select text and copy (Ctrl+C)
3. Service worker console shows:
   ```
   📨 v4.0 Message: SAVE
   ✅ v4.0 Saved! Total: 1
   ```
4. Click extension icon
5. Sidepanel opens with your text!

## What to Look For

### ✅ CORRECT (v4.0 running):
```
Service Worker Console:
🚀 v4.0 STARTED (green, large)
📨 v4.0 Message: SAVE
✅ v4.0 Saved! Total: 1
```

### ❌ WRONG (old code still cached):
```
Service Worker Console:
[DEBUG] Database: Starting initialization
[DEBUG] Database: DB_NAME: ContextClipsDB
... any [DEBUG] messages
```

## If You STILL See Old Code

This means Chrome is being extremely stubborn. Try:

### Nuclear Option 1: Use Incognito
1. Load extension in incognito mode
2. Enable "Allow in incognito" in extension details
3. Test in incognito window

### Nuclear Option 2: Different Chrome Profile
1. Chrome menu → Settings → Add person
2. Create new profile
3. Load extension in new profile

### Nuclear Option 3: Different Build Hash
```bash
cd /app
# Change a character in the manifest
echo " " >> dist_v4/manifest.json
# This changes the file hash, forcing Chrome to reload
```

## Why dist_v4 Instead of dist?

Chrome caches extensions by their directory path. By using a DIFFERENT directory (`dist_v4` instead of `dist`), Chrome is forced to treat this as a completely NEW extension with a NEW extension ID.

## Verify Extension ID Changed

1. Look at the extension in `chrome://extensions/`
2. Click "Details"
3. The ID should be DIFFERENT from any previous "Context Clips" extension
4. If it's the same ID, Chrome is somehow still linking to the old one

## Expected File Sizes

To verify you're loading the right files:

```
dist_v4/
├── assets/
│   ├── content-script.ts-46bc1f5d.js  (0.40 KB)
│   └── service-worker.ts-b4e76001.js  (0.94 KB)
└── src/sidepanel/index.html           (3.34 KB)
```

Total: ~5KB (vs hundreds of KB for old version)

## Success Criteria

Extension is working if:
- ✅ Service worker shows "v4.0" in green
- ✅ No "[DEBUG]" messages anywhere
- ✅ Copying text shows "v4.0 Saved"
- ✅ Sidepanel shows clips
- ✅ Keyboard shortcuts work
- ✅ Extension name is "Context Clips v4"

## Last Resort

If NOTHING works:
1. Close ALL Chrome windows completely
2. Delete: `~/.config/google-chrome/Default/Extensions/` (Linux/Mac)
   or `%LOCALAPPDATA%\Google\Chrome\User Data\Default\Extensions\` (Windows)
3. Restart Chrome
4. Load from `/app/dist_v4`

---

**Remember:** Load from `/app/dist_v4` NOT `/app/dist`!
