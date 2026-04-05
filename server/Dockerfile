FROM node:20-slim

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Exposure port (default 8080)
EXPOSE 8080

# Run the application
CMD ["npm", "start"]
