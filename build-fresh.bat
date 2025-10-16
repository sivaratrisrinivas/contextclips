@echo off
echo.
echo 🚀 Creating fresh extension build...
echo.

cd /d "%~dp0"

echo 📦 Cleaning old builds...
if exist dist rmdir /s /q dist
if exist dist_v4 rmdir /s /q dist_v4

echo 🔨 Building extension...
call npm run build

echo 📋 Creating dist_v4...
xcopy /E /I /Y dist dist_v4

echo.
echo ✅ Build complete!
echo.
echo 📂 Extension is ready in two locations:
echo    - dist
echo    - dist_v4
echo.
echo 🎯 IMPORTANT: Load from dist_v4 to avoid Chrome cache!
echo.
echo Next steps:
echo 1. Go to chrome://extensions/
echo 2. Remove any old 'Context Clips' extensions
echo 3. Click 'Load unpacked'
echo 4. Select the dist_v4 folder
echo.
pause
