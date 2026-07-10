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

    // 1. Add coparticipacao column (boolean)
    console.log("Adding coparticipacao column to planos table...");
    await client.query(`
      ALTER TABLE planos 
      ADD COLUMN IF NOT EXISTS coparticipacao BOOLEAN DEFAULT FALSE
    `);
    console.log("coparticipacao column added or verified!");

    // 2. Add cidades column (text)
    console.log("Adding cidades column to planos table...");
    await client.query(`
      ALTER TABLE planos 
      ADD COLUMN IF NOT EXISTS cidades TEXT
    `);
    console.log("cidades column added or verified!");

    client.release();
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

main();
