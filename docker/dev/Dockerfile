# Base image with Node.js 24
FROM node:24

# Set working directory to /app
WORKDIR /usr/src/app

# Copy package.json to current directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code to current directory
COPY . .

# Build application
RUN npm run build


# Expose port 3000
EXPOSE 3000

# Start application with npm
CMD ["npm", "run", "dev"]


