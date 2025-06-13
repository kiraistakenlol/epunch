FROM --platform=linux/amd64 node:20-alpine as builder

WORKDIR /app

# Copy root and relevant package.json files
COPY ./application/package.json ./
COPY ./application/common-core/package.json ./common-core/
COPY ./application/backend/package.json ./backend/

# Install ALL dependencies for build (including dev for common-core)
# yarn install will look at workspaces and use yarn.lock from root
RUN yarn install --frozen-lockfile

# Copy source code for common-core and backend
COPY ./application/common-core ./common-core/
COPY ./application/backend ./backend/

# Build common-core (dependency of backend)
RUN yarn workspace e-punch-common-core build

# Build backend
RUN yarn workspace e-punch-backend build

# Production stage
FROM --platform=linux/amd64 node:20-alpine

WORKDIR /app

# Copy root and relevant package.json files for prod dependencies
COPY ./application/package.json ./
COPY ./application/yarn.lock ./
COPY ./application/common-core/package.json ./common-core/
COPY ./application/backend/package.json ./backend/

# Install production dependencies only for relevant workspaces.
# This should correctly install backend's deps, including resolving e-punch-common-core
# to the local workspace package by linking to ./common-core.
RUN yarn install --production --frozen-lockfile

# Copy the pre-built dist folders from the builder stage.
# The yarn install above should have created the necessary symlinks in node_modules.
# Now we place the actual built code where those symlinks point.
COPY --from=builder /app/common-core/dist ./common-core/dist
COPY --from=builder /app/backend/dist ./backend/dist

# Set default environment variables (App Runner will override these)
ENV NODE_ENV=production
ENV APP_HOST=0.0.0.0
ENV APP_PORT=4000

# Create a run script that uses the PORT environment variable
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'cd /app' >> /app/start.sh && \
    echo 'echo "Starting backend on port $APP_PORT"' >> /app/start.sh && \
    echo 'node backend/dist/main.js' >> /app/start.sh && \
    chmod +x /app/start.sh

# Expose the port (App Runner will override this)
EXPOSE $APP_PORT

# Command to run the application
CMD ["/app/start.sh"] 