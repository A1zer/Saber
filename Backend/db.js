import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { createPool } from "mysql2";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../info.env") });

// Create a connection pool
const pool = createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test připojení k databázi při startu aplikace
pool
  .promise()
  .getConnection()
  .then((connection) => {
    console.log("Database connection successful!");
    connection.release(); // Uvolní připojení zpět do poolu
  })
  .catch((err) => console.error("!!! DATABASE CONNECTION ERROR:", err));

// Export the pool for use in other files
export default pool.promise();
