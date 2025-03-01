# Use the official Node.js image (Alpine version for a smaller image)
FROM node:18-alpine

# Set environment variables
ENV NODE_ENV=production

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available) first to leverage Docker caching
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy the entire project files (except those in .dockerignore)
COPY . .

# Expose the application port (same as in server.js)
EXPOSE 5000

# Command to start the app
CMD ["npm", "start"]
