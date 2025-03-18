# Menggunakan image Node.js sebagai base image
FROM node:18-alpine

# Menentukan working directory di dalam container
WORKDIR /usr/src/app

# Menyalin package.json dan package-lock.json untuk install dependensi
COPY package*.json ./

# Menyalin folder prisma sebelum install dependensi
COPY prisma ./prisma

# Menginstall dependensi
RUN npm install && npm cache clean --force

# Menjalankan Prisma generate setelah dependensi terinstal
RUN npx prisma generate --schema=prisma/schema.prisma

# Menyalin seluruh file dari proyek lokal ke dalam container
COPY . .

# Menyediakan port untuk aplikasi
EXPOSE 8080

ENV PORT=8080

# Jalankan Express server
CMD ["sh", "-c", "npm run db:deploy && npm run start"]
# CMD ["npm", "run", "start"]