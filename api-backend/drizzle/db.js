import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import * as schema from './schema.js';
import * as relations from './relations.js';
import logger from "../utils/logger.js";
import { ensureBackofficeCompatSchema } from "../src/migrations/backoffice-compat.js";
dotenv.config({ override: true });

// const poolConnection = mysql.createPool(process.env.DATABASE_URL || 'mysql://localhost.internal:3306/octobees');
// const poolConnection = mysql.createPool(process.env.DATABASE_URL || 'mysql://root@localhost:3306/octobees');

const poolConnection = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  socketPath: process.env.DB_SOCKET, // Socket untuk Cloud SQL
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
export { poolConnection };
try {
  // Test the connection
  const connection = await poolConnection.getConnection();
  await connection.ping();
  connection.release();
  await ensureBackofficeCompatSchema(poolConnection, logger);
  logger.info("✅ Database connection successful");
} catch (error) {
  logger.error(`❌ Database connection failed: ${error.message}`, { error });
}

// Just pass the pool directly
// export const db = drizzle(pool, { schema,mode:"default" });
export const db = drizzle(poolConnection, {
  schema: { ...schema, ...relations },
  mode: "default",
});
