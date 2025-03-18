import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import * as schema from './schema.js';
dotenv.config();

// const poolConnection = mysql.createPool(process.env.DATABASE_URL || 'mysql://localhost.internal:3306/octobees');
const poolConnection = mysql.createPool(process.env.DATABASE_URL || 'mysql://root@localhost:3306/octobees');
// Just pass the pool directly
// export const db = drizzle(pool, { schema,mode:"default" });
export const db = drizzle(poolConnection,{ schema,mode:"default" });

