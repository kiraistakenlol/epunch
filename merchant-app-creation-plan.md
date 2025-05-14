# Merchant App Creation Plan

This plan outlines the steps to create the `merchant-app` module, mirroring the structure and setup of the `user-app`.

## Directory & File Creation

1.  **Create Core Directories:**
    *   [ ] Create directory `application/merchant-app`
    *   [ ] Create directory `application/merchant-app/src`
    *   [ ] Create directory `application/merchant-app/public`
    *   [ ] Create directory `infra/merchant-app`
    *   [ ] Create directory `infra/merchant-app/vercel` (assuming Vercel will also host this, adjust if different)

2.  **Create Basic Configuration Files (by copying and modifying from `user-app`):**
    *   [ ] **`application/merchant-app/package.json`**:
        *   Copy from `application/user-app/package.json`.
        *   Update `name` to `"e-punch-merchant-app"`.
        *   Review and adjust dependencies if needed (initially, keep them the same).
    *   [ ] **`application/merchant-app/vite.config.ts`**:
        *   Copy from `application/user-app/vite.config.ts`.
        *   (No immediate changes likely needed, but review paths if any are hardcoded).
    *   [ ] **`application/merchant-app/tsconfig.json`**:
        *   Copy from `application/user-app/tsconfig.json`.
        *   (No immediate changes likely needed).
    *   [ ] **`application/merchant-app/tsconfig.node.json`**:
        *   Copy from `application/user-app/tsconfig.node.json`.
        *   (No immediate changes likely needed).
    *   [ ] **`application/merchant-app/index.html`**:
        *   Copy from `application/user-app/index.html`.
        *   Update `<title>` to "E-PUNCH Merchant".
    *   [ ] **`application/merchant-app/public/vite.svg`**:
        *   Copy from `application/user-app/public/vite.svg` (or use a new placeholder).
    *   [ ] **`infra/merchant-app/vercel/vercel.json`**:
        *   Copy from `infra/user-app/vercel/vercel.json`.
        *   Update `name` to `"e-punch-merchant-app"`.
        *   Update `buildCommand`: `cd ../common && yarn build && cd ../merchant-app && yarn build`.
    *   [ ] **`infra/merchant-app/README.md`**:
        *   Create a basic README, similar to `infra/user-app/README.md`, but referencing the "Merchant App".

3.  **Create Basic Source Files:**
    *   [ ] **`application/merchant-app/src/main.tsx`**:
        *   Copy from `application/user-app/src/main.tsx`.
        *   Adjust `App` import if the main component will be named differently or in a different initial location.
    *   [ ] **`application/merchant-app/src/App.tsx`**:
        *   Create a basic placeholder `App.tsx` component for the merchant app.
        *   Example:
            ```tsx
            import './styles/global.css'; // Assuming you'll create this

            function App() {
              return (
                <div>
                  <h1>Merchant App</h1>
                  <p>Welcome to the E-PUNCH Merchant Application.</p>
                </div>
              );
            }

            export default App;
            ```
    *   [ ] **`application/merchant-app/src/vite-env.d.ts`**:
        *   Copy from `application/user-app/src/vite-env.d.ts`.
    *   [ ] **`application/merchant-app/src/styles/global.css`**:
        *   Create a basic `global.css`, perhaps copying from `user-app` initially or starting fresh.

## Workspace & Build Configuration Updates

1.  **`application/package.json`** (main workspace config):
    *   [ ] Add `"merchant-app"` to the `workspaces` array.
2.  **`build-all.sh`**:
    *   [ ] Add build steps for `merchant-app`:
        ```bash
        # Build merchant-app
        echo "Building merchant-app..."
        yarn workspace e-punch-merchant-app build
        ```
3.  **`reinstall-all.sh`**:
    *   [ ] Add `application/merchant-app/node_modules` to the removal list:
        ```bash
        if [ -d "application/merchant-app/node_modules" ]; then
          echo "Removing application/merchant-app/node_modules/"
          rm -rf application/merchant-app/node_modules
        fi
        ```
4.  **`.vscode/launch.json`** (Optional - for local dev):
    *   [ ] Add a new launch configuration for "Merchant App", similar to "User App".
        *   `name`: "Merchant App"
        *   `runtimeArgs`: ["-c", "./run-merchant-app.sh"] (assuming a new script will be created)
    *   [ ] Add "Merchant App" to the "Fullstack" compound configuration.
5.  **`run-merchant-app.sh`** (New script):
    *   [ ] Create `run-merchant-app.sh` in the root directory, similar to `run-user-app.sh`, to run the merchant app's dev server.
        *   It should `cd application`.
        *   Build `e-punch-common`.
        *   Run `yarn workspace e-punch-merchant-app dev`.

## Documentation Updates

1.  **`README.md`** (Root):
    *   [ ] Update "Tech Stack" to list "Merchant App (Frontend)".
    *   [ ] Update "Infrastructure Files" to include `infra/merchant-app/`.
    *   [ ] Update "Project Structure" (ASCII diagram and description) to include `merchant-app/`.
    *   [ ] Add a new "Merchant App Directory Structure" section if its structure will differ significantly or if you want to document its basic layout.
    *   [ ] Add a "Merchant App (Frontend)" section under "Implementation Guidelines" if needed.

## Post-Setup Steps

1.  [ ] Run `yarn install` in the `application` directory to install dependencies for the new `merchant-app` workspace.
2.  [ ] Test `build-all.sh`.
3.  [ ] Test `./run-merchant-app.sh` (once created).
4.  [ ] Verify Vercel deployment configuration for the new merchant app. 