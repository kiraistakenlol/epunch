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

## Frontend
- All logic for backend calls is in a single `apiClient` file.
- All API calls use the `/api/v1` prefix, configured globally.
- API endpoint (host and port) is configured via environment variables and a `.env` file.
- Use Redux for state management.

## Backend
- Uses TypeORM for database connection.
- Host and port are configured via environment variables and a `.env` file.
- Uses Joi for configuration validation.
- No DTO validation.
- All API responses are wrapped in an `ApiResponse<T>` class:
  ```typescript
  export class ApiResponse<T> {
      data: T | null;
      constructor(data: T | null) {
          this.data = data;
      }
  }
  ```
- Uses an `ApiResponseInterceptor` to wrap responses and handle `NotFoundException` as 200 OK with `null` data.
- Uses a `GlobalHttpExceptionFilter` to handle and log all exceptions, returning a consistent error response shape.
- Consistent error handling: yes.
- No migration scripts: manage schema manually and keep one initial SQL DDL in sync. 