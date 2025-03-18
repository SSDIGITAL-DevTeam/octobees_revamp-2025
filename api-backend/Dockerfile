# Menggunakan Node.js base image
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json dan lock file
COPY package*.json ./

# Install dependencies
RUN npm install

COPY . .

# Expose port aplikasi
EXPOSE 8080

# Jalankan server
CMD ["npm", "start"]
