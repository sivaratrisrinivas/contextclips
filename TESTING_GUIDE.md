# Testing Guide for Context Clips Bug Fixes

## Setup Instructions

### 1. Build the Extension
```bash
cd /app
npm install
npm run build
```

### 2. Load Extension in Chrome
1. Open Chrome browser
2. Navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top-right corner)
4. Click "Load unpacked"
5. Navigate to and select the `/app/dist` folder
6. The extension should now appear in your extensions list

## Test Cases

### Test Case 1: Copy Items with Ctrl+C ✅

**Objective:** Verify that users can copy clips using Ctrl+C keyboard shortcut

**Steps:**
1. Open any website (e.g., https://example.com)
2. Select some text and press `Ctrl+C` (or `Cmd+C` on Mac)
3. Click the Context Clips extension icon to open sidepanel
4. Verify the copied text appears as a clip
5. Use arrow keys (`↑` and `↓`) to navigate to the clip you want
6. Press `Ctrl+C` (or `Cmd+C`)
7. Go to any text field and paste (`Ctrl+V`)

**Expected Result:**
- The clip content should be copied to clipboard
- You should be able to paste it successfully
- Selected clip should have a blue border/ring

**Alternative Test:**
- Navigate to a clip using arrow keys
- Press `Enter` instead of `Ctrl+C`
- Should also copy the clip

### Test Case 2: See Clip Items in Sidepanel ✅

**Objective:** Verify that clips appear in the sidepanel

**Steps:**
1. Open a website
2. Copy several different pieces of text:
   - Plain text
   - A URL
   - Some code snippet
   - HTML content
3. Click the extension icon to open sidepanel
4. Verify all clips appear in the list

**Expected Result:**
- All copied items should be visible
- Each clip should show:
  - Content preview
  - Content type icon (📄, 💻, 🔗, etc.)
  - Domain name
  - Time stamp
- Clips should be sorted by most recent first

### Test Case 3: Real-time Updates

**Objective:** Verify that new clips appear automatically

**Steps:**
1. Open sidepanel
2. Keep sidepanel open
3. Go to another tab
4. Copy some text
5. Return to sidepanel

**Expected Result:**
- New clip should appear automatically without manual refresh
- No need to close and reopen sidepanel

### Test Case 4: Keyboard Navigation

**Objective:** Verify all keyboard shortcuts work

**Shortcuts to test:**

| Key | Action | Test Steps |
|-----|--------|------------|
| `↑` | Navigate up | Open sidepanel with multiple clips, press `↑`, verify selection moves up |
| `↓` | Navigate down | Press `↓`, verify selection moves down |
| `Ctrl+C` | Copy selected | Select a clip with arrows, press `Ctrl+C`, paste in text field |
| `Enter` | Copy selected | Select a clip, press `Enter`, paste in text field |
| `Delete` | Delete selected | Select a clip, press `Delete`, verify it's removed |

**Expected Result:**
- All shortcuts should work as described
- Visual feedback (blue border) should follow the selection

### Test Case 5: Click to Copy (Original Functionality)

**Objective:** Verify original click-to-copy still works

**Steps:**
1. Open sidepanel
2. Click directly on a clip card

**Expected Result:**
- Clip should be copied to clipboard
- Clip should be visually selected (blue border)
- Should be able to paste the content

## Visual Verification

### Selected Clip Appearance
When a clip is selected:
- Should have a **blue border** (or dark blue in dark mode)
- Should have a subtle **blue ring/glow** around it
- Should be clearly distinguishable from unselected clips

### Keyboard Shortcuts Hint
At the top of the sidepanel (when clips exist):
- Should see a helpful hint: "💡 Tip: Use ↑ ↓ to navigate, Ctrl+C or Enter to copy"
- Should be in small, gray text

## Troubleshooting

### Clips Not Appearing
1. Check browser console (F12) for errors
2. Look for debug messages starting with `🔍 [DEBUG]`
3. Verify clipboard permissions are granted
4. Try reloading the extension

### Keyboard Shortcuts Not Working
1. Make sure sidepanel has focus (click inside it)
2. Check that no other extension is intercepting the shortcuts
3. Try clicking on a clip first to ensure focus

### Copy Not Working
1. Verify clipboard permissions in `chrome://extensions`
2. Check browser console for permission errors
3. Try manual copy (click on clip) first

## Debug Console Messages

Expected console messages:
```
🔍 [DEBUG] Content Script: Copy event detected
🔍 [DEBUG] Background: Handling CAPTURE_CLIPBOARD
✅ [DEBUG] Background: Clip added to database successfully
📥 [DEBUG] App: New clip added, refreshing...
✅ [DEBUG] App: Successfully copied to clipboard
```

## Success Criteria

All tests pass if:
- ✅ Clips appear in sidepanel after copying
- ✅ Ctrl+C copies selected clip
- ✅ Arrow keys navigate between clips
- ✅ Enter key copies selected clip
- ✅ Delete key removes selected clip
- ✅ Visual selection feedback is clear
- ✅ Real-time updates work without refresh
- ✅ Original click-to-copy still works

## Known Limitations

1. Extension only works on web pages, not on Chrome internal pages (chrome://)
2. Some websites may have their own clipboard handling that conflicts
3. First copy after browser start may take slightly longer (database initialization)

## Performance Notes

- Clips are stored in IndexedDB for persistence
- Duplicate clips within 5 minutes are automatically filtered
- No external network requests (all processing is local)
