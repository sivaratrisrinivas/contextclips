# Debug Instructions for Clips Not Showing Issue

## Critical: You Must Reload the Extension!

**BEFORE TESTING:**
1. Go to `chrome://extensions/`
2. Find "Context Clips" extension
3. Click the **circular reload button** (🔄) on the extension card
4. DO NOT just refresh the page - you must reload the extension itself!

## Enhanced Diagnostic Logging

I've added comprehensive logging to identify the issue. Here's what to look for:

### Step 1: Copy Some Text
1. Go to any webpage
2. Select and copy text (Ctrl+C)
3. Open DevTools (F12) and switch to Console tab

### Step 2: Check Service Worker Logs
Look for these key log messages in the service worker console:

```
🔍 [DEBUG] Database Module: Loaded in context: <context-id>
🔍 [DEBUG] Database: Starting initialization in context: <context-id>
🔍 [DEBUG] Database: Database name: ContextClipsDB
🔍 [DEBUG] Database: Database version: 1
🔍 [DEBUG] Database: Object stores: ["clips"]
🔍 [DEBUG] Database: Using database: ContextClipsDB version: 1
🔍 [DEBUG] Database: Available stores: ["clips"]
✅ [DEBUG] Database: Clip added and transaction completed
🔍 [DEBUG] Database: Immediate count after write: <number>
```

**Key Questions:**
- What is the "Immediate count after write"? (Should be > 0)
- Does the database have the correct name and version?
- Are the object stores present?

### Step 3: Check Sidepanel Logs
1. Open the sidepanel (click extension icon)
2. Right-click inside the sidepanel and select "Inspect"
3. This opens a separate DevTools for the sidepanel
4. Check the Console tab

Look for:
```
🔍 [DEBUG] Database Module: Loaded in context: <context-id>
🔍 [DEBUG] Database: Starting getAllClips
🔍 [DEBUG] Database: Caller context: <where it was called from>
🔍 [DEBUG] Database: Using database: ContextClipsDB version: 1
🔍 [DEBUG] Database: Available stores: ["clips"]
🔍 [DEBUG] Database: Total records in store: <number>
🔍 [DEBUG] Database: Transaction complete, sorted clips count: <number>
```

**Key Questions:**
- Is the context ID the same as service worker? (Might be different, that's OK)
- What is "Total records in store"? (Should match the count from service worker)
- What is "sorted clips count"? (This is what we're not seeing)

### Step 4: Compare Context IDs

**Critical Check:**
- Service Worker Context ID: `________________`
- Sidepanel Context ID: `________________`

Even if they're different, both should access the same IndexedDB database named "ContextClipsDB".

### Step 5: Manual IndexedDB Inspection

In the sidepanel DevTools:
1. Go to "Application" tab
2. Expand "Storage" → "IndexedDB"
3. Look for "ContextClipsDB"
4. Expand it and click on "clips" object store
5. **How many records do you see?**

This will tell us if:
- ✅ Data is being written but not read correctly
- ❌ Data is not being written at all
- ❌ Data is in a different database

### What to Report Back

Please provide:
1. Screenshot of service worker console showing the "Immediate count after write" log
2. Screenshot of sidepanel console showing the "Total records in store" log
3. Screenshot of Application → IndexedDB → ContextClipsDB → clips showing the records
4. The context IDs from both logs

This will definitively show us where the breakdown is happening.

## Possible Outcomes

### Outcome A: Count after write = 0
**Problem:** Data not being written at all
**Next Step:** Check database initialization and permissions

### Outcome B: Count after write > 0, but sidepanel count = 0
**Problem:** Database context isolation - different databases being used
**Next Step:** Investigate Chrome extension storage architecture

### Outcome C: Count after write > 0, sidepanel count > 0, but UI shows nothing
**Problem:** UI rendering issue, not database issue
**Next Step:** Check React state management

### Outcome D: Manual inspection shows records, but queries return 0
**Problem:** Query logic or transaction issue
**Next Step:** Investigate getAll() implementation

## Quick Test: Force Database Check

In the sidepanel console, paste this:
```javascript
(async () => {
  const request = indexedDB.open('ContextClipsDB', 1);
  request.onsuccess = () => {
    const db = request.result;
    const tx = db.transaction(['clips'], 'readonly');
    const store = tx.objectStore('clips');
    const countReq = store.count();
    countReq.onsuccess = () => {
      console.log('🧪 Manual check - Clips in DB:', countReq.result);
    };
    const getAllReq = store.getAll();
    getAllReq.onsuccess = () => {
      console.log('🧪 Manual check - Retrieved clips:', getAllReq.result);
    };
  };
})();
```

This will directly query IndexedDB bypassing our code.
