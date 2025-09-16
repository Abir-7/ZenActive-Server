# Use official Node.js 20 image
FROM node:20

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json first (for caching layers)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Default command (overridden by docker-compose)
CMD ["npm", "run", "dev"]
