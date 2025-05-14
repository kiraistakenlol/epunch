# Merchant App Creation Plan

This plan outlines the steps to create the `merchant-app` module, using the `user-app` as a template for its structure and setup.

## 1. Refactor `apiClient` to Common Module

*   [ ] **Move `apiClient.ts`**:
    *   Move `application/user-app/src/apiClient.ts` to `application/common/src/apiClient.ts`.
*   [ ] **Update `apiClient.ts` imports**:
    *   Ensure any relative paths within the moved `apiClient.ts` (if any) are still valid or update them.
*   [ ] **Export `apiClient` from `common` module**:
    *   Update `application/common/src/index.ts` (create if it doesn't exist) to export the `apiClient`. Example: `export * from './apiClient';`
    *   Ensure `application/common/package.json` has `"main": "dist/index.js"` and `"types": "dist/index.d.ts"`.
    *   Ensure `application/common/tsconfig.json` is configured to build `index.ts` and `apiClient.ts` into the `dist` directory.
*   [ ] **Update `user-app`**:
    *   Modify `application/user-app/src/features/dev/DevPage.tsx` (and any other files) to import `apiClient` from `e-punch-common` (e.g., `import { apiClient } from 'e-punch-common';`).
*   [ ] **Build and Test `common` and `user-app`**:
    *   Run `yarn workspace e-punch-common build`.
    *   Run `yarn workspace e-punch-user-app build`.
    *   Test `user-app` to ensure `apiClient` calls still work.

## 2. Directory & File Creation for `merchant-app`

*   **Create Core Directories:**
    *   [ ] Create directory `application/merchant-app`
    *   [ ] Create directory `application/merchant-app/src`
    *   [ ] Create directory `application/merchant-app/public`
    *   [ ] Create directory `infra/merchant-app`
    *   [ ] Create directory `infra/merchant-app/vercel` (assuming Vercel will also host this, adjust if different)

*   **Create Basic Configuration Files** (based on `user-app` versions, with modifications):
    *   [ ] **`application/merchant-app/package.json`**:
        *   Create based on `application/user-app/package.json`.
        *   Update `name` to `"e-punch-merchant-app"`.
        *   Ensure `e-punch-common` is a dependency.
        *   Initially, keep other dependencies the same; review and prune later if necessary.
    *   [ ] **`application/merchant-app/vite.config.ts`**:
        *   Create based on `application/user-app/vite.config.ts`.
        *   (No immediate changes likely needed unless paths are hardcoded).
    *   [ ] **`application/merchant-app/tsconfig.json`**:
        *   Create based on `application/user-app/tsconfig.json`. Ensure `paths` correctly reference `e-punch-common` if used.
        *   (No other immediate changes likely needed).
    *   [ ] **`application/merchant-app/tsconfig.node.json`**:
        *   Create based on `application/user-app/tsconfig.node.json`.
        *   (No immediate changes likely needed).
    *   [ ] **`application/merchant-app/index.html`**:
        *   Create based on `application/user-app/index.html`.
        *   Update `<title>` to "E-PUNCH Merchant".
    *   [ ] **`application/merchant-app/public/vite.svg`**:
        *   Create by copying `application/user-app/public/vite.svg` (or use a new placeholder).
    *   [ ] **`infra/merchant-app/vercel/vercel.json`**:
        *   Create based on `infra/user-app/vercel/vercel.json`.
        *   Update `name` to `"e-punch-merchant-app"`.
        *   Update `buildCommand`: `cd ../../common && yarn build && cd ../../merchant-app && yarn build`. (Adjust path based on actual location of vercel.json relative to workspace root).
    *   [ ] **`infra/merchant-app/README.md`**:
        *   Create a basic README, similar in structure to `infra/user-app/README.md`, but referencing the "Merchant App".

*   **Create Basic Source Files** (based on `user-app` versions where applicable):
    *   [ ] **`application/merchant-app/src/main.tsx`**:
        *   Create based on `application/user-app/src/main.tsx`.
        *   Ensure it imports and renders a root `App` component for the merchant app.
    *   [ ] **`application/merchant-app/src/App.tsx`**:
        *   Create a basic placeholder `App.tsx` component.
        *   Example:
            ```tsx
            import './styles/global.css'; // Will be created next
            import { apiClient } from 'e-punch-common'; // Example import

            function App() {
              // Example usage of apiClient
              // apiClient.someMerchantSpecificCall(); 

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
        *   Create by copying `application/user-app/src/vite-env.d.ts`.
    *   [ ] **`application/merchant-app/src/styles/global.css`**:
        *   Create a basic `global.css`. Can be minimal or based on `user-app/src/styles/global.css` initially.

## 3. Workspace & Build Configuration Updates

*   **`application/package.json`** (main workspace config):
    *   [ ] Add `"merchant-app"` to the `workspaces` array.
*   **`build-all.sh`**:
    *   [ ] Add build steps for `merchant-app` (ensure it's after `common`):
        ```bash
        # Build merchant-app
        echo "Building merchant-app..."
        yarn workspace e-punch-merchant-app build
        ```
*   **`reinstall-all.sh`**:
    *   [ ] Add `application/merchant-app/node_modules` to the removal list:
        ```bash
        if [ -d "application/merchant-app/node_modules" ]; then
          echo "Removing application/merchant-app/node_modules/"
          rm -rf application/merchant-app/node_modules
        fi
        ```
*   **`.vscode/launch.json`** (Optional - for local dev):
    *   [ ] Add a new launch configuration for "Merchant App".
        *   `name`: "Merchant App"
        *   `runtimeArgs`: ["-c", "./run-merchant-app.sh"] (script to be created)
    *   [ ] Add "Merchant App" to the "Fullstack" compound configuration.
*   **`run-merchant-app.sh`** (New script):
    *   [ ] Create `run-merchant-app.sh` in the root directory.
        *   Should `cd application`.
        *   Build `e-punch-common`.
        *   Run `yarn workspace e-punch-merchant-app dev`.

## 4. Documentation Updates

*   **`README.md`** (Root):
    *   [ ] Update "Tech Stack" to list "Merchant App (Frontend)".
    *   [ ] Update "Infrastructure Files" to include `infra/merchant-app/`.
    *   [ ] Update "Project Structure" (ASCII diagram and description) to include `merchant-app/`.
    *   [ ] Add a new "Merchant App Directory Structure" section, similar to the user app's, outlining its initial structure.
    *   [ ] Add a "Merchant App (Frontend)" section under "Implementation Guidelines" if distinct guidelines are needed.

## 5. Post-Setup Steps

*   [ ] Run `yarn install` from the `application` directory (or project root if your setup prefers it for workspaces) to install dependencies for the new `merchant-app` workspace and update the lockfile.
*   [ ] Test `build-all.sh`.
*   [ ] Test `./run-merchant-app.sh`.
*   [ ] Verify Vercel deployment configuration for the new merchant app and potentially set up a new Vercel project for it. 