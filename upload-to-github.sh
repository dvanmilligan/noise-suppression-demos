#!/bin/bash

# Upload to GitHub Script
# This script helps you upload the hosted demos to GitHub Pages

set -e

echo "📤 GitHub Pages Upload Helper"
echo ""

# Check if hosted directory exists
if [ ! -d "noise-suppression-demos-hosted" ]; then
  echo "❌ Error: noise-suppression-demos-hosted directory not found"
  echo "Run ./create-hosted-package.sh first"
  exit 1
fi

# Get GitHub username
echo "Enter your GitHub username:"
read -r GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
  echo "❌ Error: GitHub username cannot be empty"
  exit 1
fi

# Get repository name
echo ""
echo "Enter repository name (default: noise-suppression-demos):"
read -r REPO_NAME
REPO_NAME=${REPO_NAME:-noise-suppression-demos}

echo ""
echo "📋 Summary:"
echo "   GitHub Username: $GITHUB_USERNAME"
echo "   Repository Name: $REPO_NAME"
echo "   GitHub Pages URL: https://$GITHUB_USERNAME.github.io/$REPO_NAME/"
echo ""
echo "⚠️  Make sure you've created the repository on GitHub first!"
echo "   Go to: https://github.com/new"
echo "   Name: $REPO_NAME"
echo "   Make it Public"
echo "   Don't initialize with README"
echo ""
read -p "Press Enter when repository is created, or Ctrl+C to cancel..."

# Navigate to hosted directory
cd noise-suppression-demos-hosted

# Initialize git if not already
if [ ! -d ".git" ]; then
  echo ""
  echo "🔧 Initializing git repository..."
  git init
  echo "✅ Git initialized"
fi

# Add all files
echo ""
echo "📦 Adding files..."
git add .

# Commit
echo ""
echo "💾 Committing files..."
git commit -m "Deploy noise suppression demos to GitHub Pages" || echo "No changes to commit"

# Add remote (remove if exists)
echo ""
echo "🔗 Setting up remote..."
git remote remove origin 2>/dev/null || true
git remote add origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

# Rename branch to main
echo ""
echo "🌿 Setting branch to main..."
git branch -M main

# Push to GitHub
echo ""
echo "🚀 Pushing to GitHub..."
git push -u origin main --force

echo ""
echo "✅ Upload complete!"
echo ""
echo "📝 Next steps:"
echo ""
echo "1. Enable GitHub Pages:"
echo "   - Go to: https://github.com/$GITHUB_USERNAME/$REPO_NAME/settings/pages"
echo "   - Under 'Source', select 'main' branch"
echo "   - Click 'Save'"
echo ""
echo "2. Wait 1-2 minutes for GitHub to build"
echo ""
echo "3. Your demos will be available at:"
echo "   https://$GITHUB_USERNAME.github.io/$REPO_NAME/"
echo ""
echo "4. Update OAuth config.json files with these URLs:"
echo "   - baseline: https://$GITHUB_USERNAME.github.io/$REPO_NAME/baseline/"
echo "   - speex: https://$GITHUB_USERNAME.github.io/$REPO_NAME/speex/"
echo "   - rnnoise: https://$GITHUB_USERNAME.github.io/$REPO_NAME/rnnoise/"
echo ""
echo "5. Add these URLs to your OAuth client in Genesys Cloud"
echo ""
echo "6. Re-run this script to push the config changes"
echo ""

