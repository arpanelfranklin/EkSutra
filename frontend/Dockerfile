# --- Stage 1: Build Stage ---
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies first to leverage Docker layer caching
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the application source code and build
COPY . .
RUN npm run build

# --- Stage 2: Production Stage ---
FROM nginx:alpine AS runner

# Copy built static files from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]