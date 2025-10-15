# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy workspace package files
COPY ../../package.json ../../yarn.lock ./
COPY package.json ./application/admin-app/
COPY ../common-core/package.json ./application/common-core/
COPY ../common-ui/package.json ./application/common-ui/

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY ../common-core ./application/common-core
COPY ../common-ui ./application/common-ui
COPY . ./application/admin-app

# Build common packages
WORKDIR /app/application/common-core
RUN yarn build

WORKDIR /app/application/common-ui
RUN yarn build

# Build app with environment variables
WORKDIR /app/application/admin-app

# Accept build args
ARG VITE_API_URL

# Set as environment variables for Vite
ENV VITE_API_URL=$VITE_API_URL

RUN yarn build

# Production stage - serve with nginx
FROM nginx:alpine

# Copy built static files
COPY --from=builder /app/application/admin-app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
