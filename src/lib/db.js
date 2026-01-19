import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
  },
});

// Test connection
pool
  .query("SELECT 1")
  .then(() => {
    console.log("✅ Neon PostgreSQL connected successfully");
  })
  .catch((err) => {
    console.error("❌ Neon PostgreSQL connection failed", err);
  });

export default pool;
