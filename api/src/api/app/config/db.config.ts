import * as mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 8306,
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'letmein',
  database: process.env.DB_NAME || "fisc_db",
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 20
});

export default pool;