# Stage 1: Build
FROM node:20 AS build

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Set environment variables for build
ARG VITE_API_BASE_URL=http://localhost:8080
ARG VITE_OLLAMA_MODEL=llama3
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_OLLAMA_MODEL=$VITE_OLLAMA_MODEL

# Build the application
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build artifacts to Nginx html folder
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
