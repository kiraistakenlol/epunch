# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy workspace package files
COPY ../../package.json ../../yarn.lock ./
COPY package.json ./application/backend/
COPY ../common-core/package.json ./application/common-core/
COPY ../common-ui/package.json ./application/common-ui/

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY ../common-core ./application/common-core
COPY ../common-ui ./application/common-ui
COPY . ./application/backend

# Build common packages
WORKDIR /app/application/common-core
RUN yarn build

WORKDIR /app/application/common-ui
RUN yarn build

# Build backend
WORKDIR /app/application/backend
RUN yarn build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install curl for healthcheck
RUN apk add --no-cache curl

# Copy built application
COPY --from=builder /app/application/backend/dist ./dist
COPY --from=builder /app/application/backend/node_modules ./node_modules
COPY --from=builder /app/application/backend/package.json ./

# Create uploads directory
RUN mkdir -p /app/uploads

EXPOSE 4000

CMD ["node", "dist/main.js"]
