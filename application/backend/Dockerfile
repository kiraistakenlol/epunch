# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy workspace package files
COPY ../package.json ../yarn.lock ./
COPY backend/package.json ./backend/
COPY common-core/package.json ./common-core/
COPY common-ui/package.json ./common-ui/

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY common-core ./common-core
COPY common-ui ./common-ui
COPY backend ./backend

# Build common packages
WORKDIR /app/common-core
RUN yarn build

WORKDIR /app/common-ui
RUN yarn build

# Build backend
WORKDIR /app/backend
RUN yarn build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install curl for healthcheck
RUN apk add --no-cache curl

# Copy built application
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/node_modules ./node_modules
COPY --from=builder /app/backend/package.json ./

# Create uploads directory
RUN mkdir -p /app/uploads

EXPOSE 4000

CMD ["node", "dist/main.js"]
