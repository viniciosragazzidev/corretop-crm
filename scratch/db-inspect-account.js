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
    
    // 1. Inspect 'account' table columns
    const cols = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'account' AND table_schema = 'public'
    `);
    console.log("\n--- 'account' TABLE COLUMNS ---");
    cols.rows.forEach(r => console.log(`${r.column_name}: ${r.data_type}`));

    // 2. Select accounts data
    const data = await client.query('SELECT * FROM account LIMIT 2');
    console.log("\n--- 'account' DATA ---", data.rows);

    client.release();
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

main();
