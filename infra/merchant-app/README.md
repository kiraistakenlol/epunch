# E-PUNCH.io Merchant App Infrastructure

This directory contains infrastructure configuration for the E-PUNCH.io merchant application.

## Deployment

The merchant application is planned to be deployed on Vercel. Configuration can be found in the `vercel` subdirectory.

## Directory Structure

```
merchant-app/
  └── vercel/
      └── vercel.json  # Vercel deployment configuration
```

## Running the Merchant App

To run the Merchant App locally for development:

1.  **Ensure Dependencies are Installed:**
    From the root of the monorepo, run `yarn install` (or `cd application && yarn install` if you prefer) if you haven't already after pulling changes or adding the new workspace.
    You can also run the `reinstall-all.sh` script from the root directory to clean and reinstall all dependencies.

2.  **Set Environment Variables:**
    The merchant app requires the `VITE_API_URL` environment variable to be set. This should point to your backend API. You can create a `.env` file in the `application/merchant-app/` directory with this variable.
    Example `.env` file content:
    ```
    VITE_API_URL=http://localhost:3000/api/v1
    ```

3.  **Run the Development Server:**
    From the root of the monorepo, execute the script:
    ```bash
    ./run-merchant-app.sh
    ```
    This script will build the common module and then start the Vite development server for the merchant app.
    The application will typically be available at `http://localhost:5173` (or another port if 5173 is busy or configured differently in `vite.config.mts`).

## Environment Variables

*   `VITE_API_URL`: (Required) The base URL for the E-PUNCH backend API.
*   `VITE_PORT`: (Optional) Port for the Vite development server. Defaults to `5173`.
*   `VITE_HOST`: (Optional) Host for the Vite development server. Defaults to `localhost`. 