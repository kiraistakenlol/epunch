# Frontend to User-App Renaming Plan

## Directory & File Renames

-   [ ] Rename directory `application/frontend` to `application/user-app`
-   [ ] Rename directory `infra/frontend` to `infra/user-app`
-   [ ] Rename file `run-frontend.sh` to `run-user-app.sh`

## Code & Configuration Updates

### Root Directory Files

-   **`.vscode/launch.json`**:
    -   [X] Update `name`: "Frontend" to "User App"
    -   [X] Update `runtimeArgs`: "./run-frontend.sh" to "./run-user-app.sh"
    -   [X] Update compound `configurations`: "Frontend" to "User App"
-   **`README.md`**:
    -   [X] Update Tech Stack: "Frontend:" to "User App (Frontend):"
    -   [X] Update Infrastructure: "Frontend Hosting:" (no change needed if Vercel hosts both)
    -   [X] Update Infrastructure Files: `infra/frontend/` to `infra/user-app/`
    -   [X] Update Project Structure (ASCII diagram): `frontend/` to `user-app/` (multiple places)
    -   [X] Update Project Structure description: `frontend/` to `user-app/`
    -   [X] Update Frontend Directory Structure heading: `application/frontend/src/` to `application/user-app/src/`
    -   [X] Update "Key Principles for Frontend Structure" (no change to heading text needed)
    -   [X] Update "Frontend" (Implementation Guidelines section heading) to "User App (Frontend)"
-   **`build-all.sh`**:
    -   [X] Update comment: "# Build frontend" to "# Build user-app"
    -   [X] Update echo: "Building frontend..." to "Building user-app..."
    -   [X] Update yarn workspace command: `e-punch-frontend` to `e-punch-user-app`
-   **`application/package.json`** (workspace config):
    -   [X] Update workspace array: `"frontend"` to `"user-app"`
-   **`application/package-lock.json`**: (Skipped for now - will be regenerated after directory rename)
    -   [ ] ~~Update workspace array: `"frontend"` to `"user-app"`~~
    -   [ ] ~~Update package entry: `"frontend": { ... }` to `"user-app": { ... }`~~
    -   [ ] ~~Update package name inside: `"name": "e-punch-frontend"` to `"name": "e-punch-user-app"`~~
    -   [ ] ~~Update path: `"node_modules/e-punch-frontend"` to `"node_modules/e-punch-user-app"` (if it refers to the workspace package itself)~~~
    -   [ ] ~~Update resolved path: `"resolved": "frontend"` to `"resolved": "user-app"`~~

### `application/frontend` (soon to be `application/user-app`)

-   **`vercel.json`**:
    -   [ ] Update `name`: "e-punch-frontend" to "e-punch-user-app"
    -   [ ] Update `buildCommand`: `cd ../frontend` to `cd ../user-app`
-   **`package.json`**:
    -   [ ] Update `name`: "e-punch-frontend" to "e-punch-user-app"
-   **`src/styles/global.css`**:
    -   [ ] Update comment: `/* application/frontend/src/styles/global.css */` to `/* application/user-app/src/styles/global.css */` (This is optional, as it's just a comment, but good for consistency)

### `infra/frontend` (soon to be `infra/user-app`)

-   **`README.md`**:
    -   [ ] Update heading: "# E-PUNCH.io Frontend Infrastructure" to "# E-PUNCH.io User App Infrastructure"
    -   [ ] Update description: "...E-PUNCH.io frontend application." to "...E-PUNCH.io user application."
    -   [ ] Update directory example: `frontend/` to `user-app/`

### Other Files

-   **`IMPLEMENTATION_NOTES.md`**:
    -   [X] Update heading: "## Frontend" to "## User App (Frontend)" 