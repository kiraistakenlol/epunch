#!/bin/bash

set -e

echo "📋 Storing current branch..."
PREV_BRANCH=$(git rev-parse --abbrev-ref HEAD)

echo "🔄 Checking out to master branch..."
git checkout master

echo "📥 Pulling latest changes from origin/master..."
git pull origin master

echo "🔀 Merging dev branch into master..."
git merge dev

echo "📤 Pushing changes to origin/master..."
git push origin master

echo "🔙 Switching back to previous branch ($PREV_BRANCH)..."
git checkout $PREV_BRANCH

echo "✅ Successfully merged dev into master and pushed changes!" 