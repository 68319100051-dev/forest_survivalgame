FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies (including only production deps)
COPY package*.json ./
RUN npm ci --only=production

# Copy app source code
COPY . .

# Expose port (default 3000)
EXPOSE 3000

# Set environment variable for port (optional)
ENV PORT=3000

# Start the server
CMD ["node", "server.js"]
