# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy workspace package files (build context is application/)
COPY package.json yarn.lock ./
COPY backend/package.json ./backend/
COPY common-core/package.json ./common-core/
COPY common-ui/package.json ./common-ui/

# Install all workspace dependencies
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

# Copy workspace structure
COPY --from=builder /app/package.json /app/yarn.lock ./

# Copy node_modules (includes all dependencies)
COPY --from=builder /app/node_modules ./node_modules

# Copy built common packages
COPY --from=builder /app/common-core ./common-core
COPY --from=builder /app/common-ui ./common-ui

# Copy backend
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/package.json ./backend/

# Create uploads directory
RUN mkdir -p /app/uploads

EXPOSE 4000

WORKDIR /app/backend

CMD ["node", "dist/main.js"]
