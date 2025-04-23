import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  dialect: 'mysql',
  out: './drizzle/migrations',
  schema: './drizzle/schema.js',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'mysql://localhost.internal:3306/octobees',
  },
  // dbCredentials: {
  //   host: process.env.DB_HOST || 'localhost',
  //   port: Number(process.env.DB_PORT || '3306'),
  //   user: process.env.DB_USERNAME || 'heriyanto',
  //   password: process.env.DB_PASSWORD || "heriyanto",
  //   //password: "",
  //   database: process.env.DB_NAME || 'octobees',
  // },
  verbose: true,
  strict: true,
});

