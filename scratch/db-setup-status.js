const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_IkK4XACPgQa7@ep-soft-wave-aidiaykq.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require",
  ssl: {
    rejectUnauthorized: false
  }
});

async function main() {
  try {
    const client = await pool.connect();
    console.log("Connected!");
    
    // 1. Add status column to user table if it doesn't exist
    console.log("Adding status column to user table...");
    await client.query(`
      ALTER TABLE "user" 
      ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'ONLINE'
    `);
    console.log("status column added or verified!");

    // 2. Update status of existing users to ONLINE
    console.log("Updating existing users status to ONLINE...");
    await client.query(`
      UPDATE "user" 
      SET status = 'ONLINE' 
      WHERE status IS NULL
    `);
    console.log("Status updated!");

    // 3. Let's see all users
    const users = await client.query('SELECT id, name, email, role, status FROM "user"');
    console.log("\nUsers in database:", users.rows);

    client.release();
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

main();
