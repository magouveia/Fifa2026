FROM node:20-alpine

WORKDIR /app

# Install build dependencies for better-sqlite3
RUN apk add --no-cache python3 make g++

COPY package*.json ./

RUN npm install

COPY . .

# Build the frontend
RUN npm run build

EXPOSE 5173

# Start the server
CMD ["npm", "start"]
