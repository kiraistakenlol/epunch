# Application Implementation Plan

> **Note:** This plan must be kept in sync after each implementation step. Mark steps as complete and update as needed.

## Goal

Implement basic frontend, backend, and shared common modules that are runnable.  
By the end, you should be able to access `localhost:5000/hello-world` in your browser and see a page that requests `/api/v1/hello-world` from the backend and displays the string returned from the backend.

## Notes

- This project is structured as a monorepo using Yarn Workspaces.
- **Decision:** After exploring alternatives, we are committing to using Yarn Workspaces for managing dependencies between `frontend`, `backend`, and `common`. Initial setup faced some challenges likely related to conflicting configurations (e.g., TS paths) or Yarn version nuances, which we aim to resolve with this fresh start.
- All code and dependencies are contained within the `application/` directory.
- All shared dev dependencies (e.g., typescript) are kept in the `application/package.json` for the workspace.

## Application Base Structure Initialization Plan

- [x] Create `application/` directory in the project root.
- [x] Create an `application/package.json` with yarn workspaces configured for `backend`, `frontend`, and `common`.
- [x] Inside `application/`, create:
  - [x] `backend/` (for NestJS backend)
  - [x] `frontend/` (for React frontend)
  - [x] `common/` (for shared TypeScript code)
- [x] Initialize a new Node.js project (`package.json`) in each of `backend/`, `frontend/`, and `common/` using yarn.
- [x] Set up TypeScript in all three modules.
- [x] Configure `common/` as a library package (with its own `package.json` and `tsconfig.json`).
- [x] Set up TypeScript path aliases or local npm linking so both `backend/` and `frontend/` can import from `common/`.
- [x] Add a minimal `.env` file to both `backend/` and `frontend/` for config.
- [x] Add a minimal README in each module describing its purpose.
- [x] Implement a `/hello-world` page in the frontend that calls `/api/v1/hello-world` on the backend and displays the result.
- [x] Implement a `/api/v1/hello-world` endpoint in the backend that returns a string.
- [x] Ensure that running `tsc` in each module works without errors.
- [x] Create two scripts in the project root:
  - [x] `run-frontend.sh` to start/restart the frontend service.
  - [x] `run-backend.sh` to start/restart the backend service.

## Sub-Plan: Minimal Backend/Common Setup (Yarn Workspaces)

- [ ] Re-create `application/` directory.
- [ ] Create `application/package.json` with Yarn Workspaces configured for `backend` and `common`. Add `typescript` as a root dev dependency.
- [ ] Create `application/common/` and `application/backend/`.
- [ ] Initialize `package.json` in `common` (name: `e-punch-common`, version: `1.0.0`) and `backend` (name: `e-punch-backend`).
- [ ] Set up basic `tsconfig.json` in `common` (outputting to `dist`, declaring `composite: true`, `declaration: true`).
- [ ] Set up basic `tsconfig.json` in `backend` (referencing `common`, no `paths` alias).
- [ ] Add minimal code:
  - [ ] `common/src/constants.ts`: Export a simple constant string.
  - [ ] `common/src/index.ts`: Export everything from `constants.ts`.
  - [ ] `common/package.json`: Add `build` script (`tsc`) and define `main`, `types` pointing to `dist/index.js` / `dist/index.d.ts`.
  - [ ] `backend/src/main.ts`: Import the constant from `e-punch-common` and log it.
  - [ ] `backend/package.json`: Add dependency `e-punch-common: "1.0.0"`. Add `build` (`tsc`) and `start` (`node dist/main.js`) scripts.
- [ ] Run `yarn install` in `application/`.
- [ ] Run `yarn workspace e-punch-common build`.
- [ ] Run `yarn workspace e-punch-backend build`.
- [ ] Run `yarn workspace e-punch-backend start` and verify output. 