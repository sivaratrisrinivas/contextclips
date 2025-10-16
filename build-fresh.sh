#!/bin/bash

echo "🚀 Creating fresh extension build..."

# Go to the app directory
cd "$(dirname "$0")"

# Clean old builds
echo "📦 Cleaning old builds..."
rm -rf dist dist_v4

# Run build
echo "🔨 Building extension..."
npm run build

# Create v4 copy
echo "📋 Creating dist_v4..."
cp -r dist dist_v4

# Verify
echo ""
echo "✅ Build complete!"
echo ""
echo "📂 Extension is ready in two locations:"
echo "   - /app/dist"
echo "   - /app/dist_v4"
echo ""
echo "🎯 IMPORTANT: Load from dist_v4 to avoid Chrome cache!"
echo ""
echo "Next steps:"
echo "1. Go to chrome://extensions/"
echo "2. Remove any old 'Context Clips' extensions"
echo "3. Click 'Load unpacked'"
echo "4. Select the dist_v4 folder"
echo ""
