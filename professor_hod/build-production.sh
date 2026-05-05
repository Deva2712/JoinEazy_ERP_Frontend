#!/bin/bash

# Production Build Script for Funkey Frontend

echo "🚀 Building Funkey Frontend for Production..."

# Clean previous build
echo "📁 Cleaning previous build..."
rm -rf build/

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build for production
echo "🔨 Building for production..."
npm run build

# Check if build was successful
if [ -d "build" ]; then
    echo "✅ Build successful!"
    echo "📁 Build files are in the 'build' directory"
    echo "🌐 You can serve these files with any static file server"
    echo ""
    echo "📋 To test the build locally:"
    echo "   npx serve build"
    echo ""
    echo "📋 To deploy:"
    echo "   Upload the contents of the 'build' directory to your web server"
else
    echo "❌ Build failed!"
    exit 1
fi 