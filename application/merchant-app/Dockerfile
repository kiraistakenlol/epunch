# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy workspace package files (build context is application/)
COPY package.json yarn.lock ./
COPY merchant-app/package.json ./merchant-app/
COPY common-core/package.json ./common-core/
COPY common-ui/package.json ./common-ui/

# Install all workspace dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY common-core ./common-core
COPY common-ui ./common-ui
COPY merchant-app ./merchant-app

# Build common packages
WORKDIR /app/common-core
RUN yarn build

WORKDIR /app/common-ui
RUN yarn build

# Build app with environment variables
WORKDIR /app/merchant-app

# Accept build args
ARG VITE_API_URL
ARG VITE_USER_APP_URL

# Set as environment variables for Vite
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_USER_APP_URL=$VITE_USER_APP_URL

RUN yarn build

# Production stage - serve with nginx
FROM nginx:alpine

# Copy built static files
COPY --from=builder /app/merchant-app/dist /usr/share/nginx/html

# Copy nginx config from build context
COPY merchant-app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
