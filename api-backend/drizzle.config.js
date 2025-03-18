import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  dialect: 'mysql',
  out: './drizzle',
  schema: './drizzle/schema.ts',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'mysql://localhost.internal:3306/octobees',
  },

  verbose: true,
  strict: true,
});
