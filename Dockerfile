# Use the official Node.js image for ARM (works on Raspberry Pi)
FROM node:18-slim

# Create app directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# If using .env files, uncomment below to copy
COPY .env .env

# Deploy commands
CMD ["node", "deploy-commands.js"]
# Start the bot
CMD ["node", "index.js"]
