# Implementation Notes

## General
- Minimalistic approach: implement only what is necessary.
- Avoid leaving comments.
- No formatting tools at first.
- No tests at all.
- Always use types, avoid `any`.
- Centralize config
- Store secrets in `.env`.
- Use yarn as the package manager.
- Project structured as a monorepo using Yarn Workspaces.
- All shared dev dependencies (e.g., typescript) are kept in the root package.json for the workspace.

## User App (Frontend)
- All logic for backend calls is in a single `apiClient`