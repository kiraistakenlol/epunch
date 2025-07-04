#!/bin/bash

if [ $# -ne 3 ]; then
    echo "Usage: $0 <source_branch> into <target_branch>"
    echo "Example: $0 analytics into dev"
    exit 1
fi

SOURCE_BRANCH=$1
INTO=$2
TARGET_BRANCH=$3

if [ "$INTO" != "into" ]; then
    echo "Error: Second parameter must be 'into'"
    echo "Usage: $0 <source_branch> into <target_branch>"
    exit 1
fi

echo "Merging $SOURCE_BRANCH into $TARGET_BRANCH as a single commit..."

git checkout $TARGET_BRANCH
if [ $? -ne 0 ]; then
    echo "Error: Failed to checkout $TARGET_BRANCH"
    exit 1
fi

git pull origin $TARGET_BRANCH
if [ $? -ne 0 ]; then
    echo "Error: Failed to pull latest changes for $TARGET_BRANCH"
    exit 1
fi

git merge --squash $SOURCE_BRANCH
if [ $? -ne 0 ]; then
    echo "Error: Failed to squash merge $SOURCE_BRANCH"
    exit 1
fi

git commit -m "Merge $SOURCE_BRANCH into $TARGET_BRANCH"
if [ $? -ne 0 ]; then
    echo "Error: Failed to commit the squash merge"
    exit 1
fi

echo "Successfully merged $SOURCE_BRANCH into $TARGET_BRANCH as a single commit"
echo "You can now push the changes with: git push origin $TARGET_BRANCH" 