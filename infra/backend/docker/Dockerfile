FROM node:20-alpine as builder

WORKDIR /app

# Copy package.json files
COPY ./application/package.json ./
COPY ./application/backend/package.json ./backend/
COPY ./application/common/package.json ./common/

# Install dependencies
RUN yarn install

# Copy source code
COPY ./application/common ./common/
COPY ./application/backend ./backend/

# Build common first (dependency of backend)
RUN yarn workspace e-punch-common build

# Build backend
RUN yarn workspace e-punch-backend build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package.json files
COPY ./application/package.json ./
COPY ./application/backend/package.json ./backend/
COPY ./application/common/package.json ./common/

# Install production dependencies only
RUN yarn install --production

# Copy built artifacts
COPY --from=builder /app/common/dist ./common/dist
COPY --from=builder /app/backend/dist ./backend/dist

# Set environment variables with defaults that can be overridden
ENV NODE_ENV=production
ENV APP_HOST=0.0.0.0 
ENV APP_PORT=8080

# Create a run script that sets up environment variables properly
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'cd /app' >> /app/start.sh && \
    echo 'node backend/dist/main.js' >> /app/start.sh && \
    chmod +x /app/start.sh

# Expose both development and production ports
EXPOSE 3001
EXPOSE 8080

# Command to run the application
CMD ["/app/start.sh"] 