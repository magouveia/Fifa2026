FROM node:20-alpine

WORKDIR /app

# Install build dependencies for better-sqlite3
RUN apk add --no-cache python3 make g++

COPY package*.json ./

RUN npm install

COPY . .

# Build the frontend
RUN npm run build

EXPOSE 3000

# Start the server
CMD ["npm", "start"]
