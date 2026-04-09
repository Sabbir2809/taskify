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

# Generate Prisma client for database access
RUN npx prisma generate

# Expose port 5000 to access backend
EXPOSE 5000

# Run commands to setup DB and start backend server
CMD ["sh", "-c", "npm run db:generate && npm run db:push && npm run db:seed && npm run dev"]