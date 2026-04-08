# Use official Node.js 22 image
FROM node:22

# Set working directory inside the container
WORKDIR /app

# Copy package.json & package-lock.json first for better caching
COPY package*.json ./

# Install project dependencies inside container
RUN npm install

# Copy all project files
COPY . .

# Expose port 5000 to access frontend
EXPOSE 5173

# Run commands to start frontend server
CMD ["npm", "run", "dev"]
