# How to Get dist_v4 on Your Local Machine

## Option 1: Pull from Git (Easiest)

Since you can see `dist_v4` on GitHub, just pull it:

```bash
cd /path/to/contextclips
git pull
```

Then load the extension from the `dist_v4` folder.

## Option 2: Build It Yourself

If you want to rebuild fresh:

### On Mac/Linux:
```bash
cd /path/to/contextclips
./build-fresh.sh
```

### On Windows:
```cmd
cd C:\path\to\contextclips
build-fresh.bat
```

This will:
1. Clean old builds
2. Build fresh
3. Create both `dist` and `dist_v4` folders

## Option 3: Just Copy dist to dist_v4

If you just need the folder quickly:

### Mac/Linux:
```bash
cd /path/to/contextclips
cp -r dist dist_v4
```

### Windows:
```cmd
cd C:\path\to\contextclips
xcopy /E /I /Y dist dist_v4
```

## After You Have dist_v4

1. **Remove** all old "Context Clips" extensions from `chrome://extensions/`
2. Click **"Load unpacked"**
3. Navigate to your local `contextclips/dist_v4` folder
4. Select it
5. **Verify** service worker shows: `🚀 v4.0 STARTED` (in green)

## Why dist_v4?

Chrome caches extensions by directory path. Using a DIFFERENT folder name (`dist_v4` instead of `dist`) forces Chrome to treat it as a brand new extension with a new ID, avoiding all cache issues.

## Quick Test

After loading:
1. Go to https://example.com
2. Copy some text (Ctrl+C)
3. Click extension icon
4. Your text should appear in the sidepanel!

## If Still Not Working

Make sure you're looking at the RIGHT console:
- Click "Service Worker" link under the extension
- Should see GREEN text: `🚀 v4.0 STARTED`
- NOT: `[DEBUG]` messages (that's old code!)
