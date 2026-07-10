const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_IkK4XACPgQa7@ep-soft-wave-aidiaykq.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require",
  ssl: {
    rejectUnauthorized: false
  }
});

async function main() {
  try {
    console.log("Connecting to database...");
    const client = await pool.connect();
    console.log("Connected!");

    console.log("Clearing all leads from database...");
    await client.query("TRUNCATE TABLE leads RESTART IDENTITY CASCADE");
    console.log("All leads cleared!");

    client.release();
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

main();
