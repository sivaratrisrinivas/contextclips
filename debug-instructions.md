# Debug Instructions for Context Clips

## Testing Steps

### 1. **Test Database Initialization**
1. Open the extension sidepanel
2. Open Chrome DevTools (F12)
3. Go to the **Console** tab
4. Look for these debug messages:
   - `🔍 [DEBUG] Database: Starting initialization`
   - `✅ [DEBUG] Database: Successfully opened database`

### 2. **Test Message Passing**
1. With sidepanel open, look for these messages in console:
   - `🔍 [DEBUG] Sidepanel: Requesting clips from background script`
   - `🔍 [DEBUG] Background: Received message: {type: 'GET_CLIPS'}`
   - `🔍 [DEBUG] Background: Starting to get clips from database`

### 3. **Test Clipboard Capture**
1. Go to any webpage
2. Copy some text (Ctrl+C or Cmd+C)
3. Look for these messages in console:
   - `🔍 [DEBUG] Content Script: Copy event detected`
   - `🔍 [DEBUG] Content Script: Sending CAPTURE_CLIPBOARD message to background`
   - `🔍 [DEBUG] Background: Attempting to capture clipboard with context`

### 4. **Test Database Storage**
After copying text, look for:
- `🔍 [DEBUG] Database: Starting addClip`
- `✅ [DEBUG] Database: Clip added successfully`

## Expected Debug Flow

**When opening sidepanel:**
```
🔍 [DEBUG] App: Starting to load clips
🔍 [DEBUG] Sidepanel: Requesting clips from background script
🔍 [DEBUG] Background: Received message: {type: 'GET_CLIPS'}
🔍 [DEBUG] Background: Starting to get clips from database
🔍 [DEBUG] Database: Starting getAllClips
🔍 [DEBUG] Database: Transaction successful, raw result: [...]
✅ [DEBUG] App: Successfully set clips in state
```

**When copying text:**
```
🔍 [DEBUG] Content Script: Copy event detected
🔍 [DEBUG] Content Script: Sending CAPTURE_CLIPBOARD message to background
🔍 [DEBUG] Background: Attempting to capture clipboard with context
🔍 [DEBUG] Database: Starting addClip
✅ [DEBUG] Database: Clip added successfully
```

## Common Issues to Look For

1. **No database initialization logs** → Database not initializing
2. **No message passing logs** → Communication broken between sidepanel and background
3. **No copy event logs** → Content script not injecting or not detecting copy events
4. **Database errors** → IndexedDB issues
5. **Chrome runtime errors** → Extension permissions or manifest issues

## Next Steps

After running these tests, share the console output and I'll help identify the exact issue and implement the fix.
