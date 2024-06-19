# Use the official Node.js image as the base image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json for installing dependencies
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy Prisma schema file
COPY prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Copy all other files to the working directory
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# Expose the port that the application will use
EXPOSE 3000

# Command to run the application in production mode
CMD ["npm", "run", "start"]
