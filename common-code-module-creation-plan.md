# Plan for Separating `common` into `common-core` and `common-ui`

This document outlines the plan to refactor the shared `common` package into two distinct packages:

1.  **`e-punch-common-core`**: A minimal library containing only DTOs, types, and enums. It will have no React dependencies and will be consumable by both backend and frontend applications.
2.  **`e-punch-common-ui`**: A library containing shared React components, hooks, and UI-related utilities. It will depend on `e-punch-common-core` and React. The existing `application/common` folder and its Vite build setup will be repurposed for this package.

**Phase 1: Create `common-core` Package (Minimal DTO Library)**

1.  **Create Directory Structure for `common-core`**:
    *   `application/common-core/`
    *   `application/common-core/src/`
    *   `application/common-core/src/dto/`
    *   `application/common-core/src/index.ts`

2.  **Create `application/common-core/package.json`**:
    *   **Name**: `"e-punch-common-core"`
    *   **Version**: `"1.0.0"`
    *   **Build Script**: `"build": "tsc"`
    *   **Output Configuration**:
        *   `"main": "./dist/index.js"`
        *   `"types": "./dist/index.d.ts"`
    *   **Files**: `["dist"]`
    *   **Dependencies**: None
    *   **DevDependencies**: `"typescript": "^5.0.0"` (match root version)

3.  **Create `application/common-core/tsconfig.json`**:
    *   **`compilerOptions`**:
        *   `"target": "ES2020"`
        *   `"module": "CommonJS"`
        *   `"lib": ["ES2020"]`
        *   `"declaration": true`
        *   `"declarationMap": true`
        *   `"sourceMap": true`
        *   `"outDir": "./dist"`
        *   `"rootDir": "./src"`
        *   `"strict": true`
        *   `"esModuleInterop": true`
        *   `"skipLibCheck": true`
        *   `"forceConsistentCasingInFileNames": true`
        *   `"moduleResolution": "node"`
    *   `"include": ["src/**/*"]`
    *   `"exclude": ["node_modules", "dist"]`

4.  **Move DTO Files**:
    *   Copy all files from `application/common/src/dto/` to `application/common-core/src/dto/`.
        *   `api-response.dto.ts`
        *   `create-punch.dto.ts`
        *   `punch-card.dto.ts` (and `PunchCardStatusDto` type alias if it's separate or move it here)
        *   `punch-operation-result.dto.ts`

5.  **Populate `application/common-core/src/index.ts`**:
    *   Export all DTOs and related types from the copied files.
    ```typescript
    // application/common-core/src/index.ts
    export * from './dto/api-response.dto';
    export * from './dto/create-punch.dto';
    export * from './dto/punch-card.dto';
    export * from './dto/punch-operation-result.dto';
    // Ensure PunchCardStatusDto is also exported if defined in one of these files or add its export.
    ```

**Phase 2: Adapt Existing `common` Folder to Become the `common-ui` Package**

1.  **Rename Package in `application/common/package.json`**:
    *   Change `"name": "e-punch-common"` to `"name": "e-punch-common-ui"`.

2.  **Update Dependencies in `application/common/package.json`**:
    *   Add `"e-punch-common-core": "workspace:^"` to `dependencies`.
    *   Retain existing `axios`, `react`, `react-dom` configurations (`axios` in `dependencies` if UI components use it, `react`/`react-dom` in `peerDependencies` and `devDependencies`).

3.  **Clean and Update `application/common/src/`**:
    *   Delete the `application/common/src/dto` directory.
    *   Remove DTO exports from `application/common/src/index.ts`.
    *   Update imports in remaining UI files: DTOs/types should be imported from `"e-punch-common-core"`.

4.  **Verify `application/common/vite.config.mts`**: No changes anticipated; it's configured for a React library.

5.  **Update `application/common/tsconfig.json`**:
    *   Add a project reference to `common-core`:
    ```json
    "references": [
      { "path": "../common-core" }
      // any other existing references if present
    ]
    ```

**Phase 3: Update Workspace and Consuming Packages**

1.  **Update Root `application/package.json`**:
    *   Add `"common-core"` to the `workspaces` array.

2.  **Update `application/backend/package.json`**:
    *   Remove dependency on `"e-punch-common"`.
    *   Add dependency: `"e-punch-common-core": "workspace:^"`.

3.  **Update `application/backend/tsconfig.json`**:
    *   Change project reference from `{ "path": "../common" }` to `{ "path": "../common-core" }`.

4.  **Update Backend Code (`application/backend/src/**/*.ts`)**:
    *   Find and replace imports from `e-punch-common` to `e-punch-common-core`.

5.  **Update Frontend Apps (`user-app` & `merchant-app`)**:
    *   **`package.json` files**:
        *   Change dependency `"e-punch-common"` to `"e-punch-common-ui": "workspace:^"`.
        *   Add dependency: `"e-punch-common-core": "workspace:^"`.
    *   **`tsconfig.json` files**:
        *   Change project reference from `{ "path": "../common" }` to:
        ```json
        "references": [
          { "path": "../common-core" },
          { "path": "../common" } // This directory now builds "e-punch-common-ui"
        ]
        ```
    *   **Source Code (`src/**/*.ts`, `src/**/*.tsx`)**:
        *   DTO/type imports: from `e-punch-common` to `e-punch-common-core`.
        *   UI component/hook imports: from `e-punch-common` to `e-punch-common-ui`.
    *   **`vite.config.mts` files**:
        *   `optimizeDeps.include`: Change from `['e-punch-common']` to `['e-punch-common-ui', 'e-punch-common-core']` (or just `e-punch-common-ui` if `e-punch-common-core` doesn't need explicit optimization).
        *   `build.commonjsOptions.include`: Review `include` patterns to correctly point to the `e-punch-common-ui` dist if needed (e.g., `/common\/dist/` or `/e-punch-common-ui\/dist/`).

**Phase 4: Installation, Build, and Test**

1.  **Clean Slate**: Delete all `node_modules` folders (root and workspaces) and lock files (`yarn.lock`, `package-lock.json`).
2.  **Install Dependencies**: Run `npm install` or `yarn install` in the root `application` directory.
3.  **Build Packages (in order)**:
    1.  `e-punch-common-core`
    2.  `e-punch-common-ui`
    3.  `e-punch-backend`
    4.  `e-punch-user-app` and `e-punch-merchant-app`
    (Use workspace commands like `npm run build -w <package-name>` or `yarn workspace <package-name> build`)
4.  **Test**: Thoroughly test all applications to ensure functionality and correct linking.

**Phase 5: Update Build and Deployment Scripts**

This phase ensures that all automation scripts and the Docker build process are updated to reflect the new `common-core` and `common-ui` package structure. The package in the `application/common` directory is now named `e-punch-common-ui`.

1.  **Update `application/package.json` (Root Workspace)**:
    *   Ensure the `workspaces` array includes `"common-core"` and `"common"` (where `"common"` directory now houses the `e-punch-common-ui` package).
    *   Review root `scripts` if any directly referenced `e-punch-common` by its old name for build order.

2.  **Update `reinstall-all.sh`**:
    *   Add a step to remove `application/common-core/node_modules` if it exists.
    ```bash
    # Add this block:
    if [ -d "application/common-core/node_modules" ]; then
      echo "Removing application/common-core/node_modules/"
      rm -rf application/common-core/node_modules
    fi
    ```
    *   The `cd application && yarn install` step should correctly pick up the new workspace structure if the root `package.json` is updated.

3.  **Update `build-common.sh`**:
    *   This script was specific to the old `e-punch-common`. It needs to be re-evaluated.
    *   **Option A (Recommended):** Rename it to `build-common-libs.sh` (or similar) and have it build both `e-punch-common-core` and `e-punch-common-ui`.
        ```bash
        # ... (navigation to application directory)
        echo "Building common-core package..."
        yarn workspace e-punch-common-core build

        echo "Building common-ui package..."
        yarn workspace e-punch-common-ui build # Assuming 'e-punch-common-ui' is the new name in application/common/package.json

        # ... (rest of the script, like cleaning Vite caches)
        ```
    *   **Option B:** Keep it as `build-common.sh` but update it to build `e-punch-common-ui` (since it lives in the `common` folder). Create a separate `build-common-core.sh` or integrate `common-core` build into `build-all.sh`. Option A is cleaner.

4.  **Update `build-all.sh`**:
    *   Adjust the build order and package names. `common-core` should be built first, then `common-ui`.
    ```bash
    # ... (navigation to application directory)
    echo "Building common-core package..."
    yarn workspace e-punch-common-core build

    echo "Building common-ui package..." # Assuming 'e-punch-common-ui' is package name in application/common/package.json
    yarn workspace e-punch-common-ui build

    echo "Building backend..."
    yarn workspace e-punch-backend build
    # ... (rest of the frontend app builds)
    ```

5.  **Update `infra/backend/docker/Dockerfile`**:
    *   **Copy `common-core` files:**
        ```dockerfile
        # Add these lines for common-core
        COPY ./application/common-core/package.json ./common-core/
        # If common-core has its own dependencies (it shouldn't have many beyond typescript for dev)
        # ensure yarn install picks them up if it needs them during build.
        ```
    *   **Copy `common-core` source code:**
        ```dockerfile
        # Add this line
        COPY ./application/common-core ./common-core/
        ```
    *   **Build `common-core` first:**
        ```dockerfile
        # Build common-core first
        RUN yarn workspace e-punch-common-core build
        ```
    *   **Adjust for `common-ui` (previously `e-punch-common`):**
        *   Ensure paths for `COPY ./application/common/package.json ./common/` are still correct if `common` directory houses `e-punch-common-ui`.
        *   The build step `RUN yarn workspace e-punch-common build` should be changed to `RUN yarn workspace e-punch-common-ui build`.
    *   **Copy built artifacts:**
        ```dockerfile
        # Add this for common-core
        COPY --from=builder /app/common-core/dist ./common-core/dist
        # Adjust for common-ui
        COPY --from=builder /app/common/dist ./common-ui/dist # Or just ./common/dist if structure is kept
        ```
    *   **Node Modules in Production Stage:**
        *   The `yarn install --production` step needs to correctly install dependencies for `backend`, including its dependency on `e-punch-common-core`.
        *   Ensure `COPY ./application/common-core/package.json ./common-core/` is also in the production stage if `yarn install --production` needs it to resolve workspace dependencies correctly (though typically it would rely on the lockfile and already built artifacts). This area can be tricky with workspaces and multi-stage Docker builds; testing is key.

6.  **Update `run-backend.sh`**:
    *   Adjust the build order for common libraries.
    ```bash
    # ...
    echo "Building common-core package..."
    yarn workspace e-punch-common-core build

    echo "Building common-ui package..." # If backend dev needs UI assets (unlikely, but if common was used for more)
    yarn workspace e-punch-common-ui build # Or remove if backend truly only needs common-core

    # Run backend
    # ...
    ```
    *   **Simplification:** If the backend *only* depends on `common-core` (which it should after the refactor), then `run-backend.sh` only needs to ensure `common-core` is built:
    ```bash
    # ...
    echo "Building common-core package..."
    yarn workspace e-punch-common-core build

    # Run backend
    echo "Starting backend..."
    yarn workspace e-punch-backend start:dev
    ```

7.  **Update `deploy-backend.sh`**:
    *   No direct changes usually needed in this script itself, as it calls `infra/backend/fly/deploy.sh`. The critical part is that the `Dockerfile` (used by `fly deploy`) is correct.

8.  **Review `infra/backend/fly/fly.toml`**:
    *   No direct changes usually needed related to package structure, as it points to the Dockerfile. Ensure the Dockerfile builds correctly.

**Important Considerations for Dockerfile:**
*   The `yarn install` in the `builder` stage needs access to all `package.json` files of the workspaces it intends to build (`common-core`, `common-ui`, `backend`).
*   The `COPY --from=builder` instructions must use the correct paths for the `dist` directories of `common-core` and `common-ui`.
*   If `e-punch-common-ui` is the new name in `application/common/package.json`, all `yarn workspace` commands must use `e-punch-common-ui` instead of `e-punch-common`. 