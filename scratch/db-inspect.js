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
    
    // 1. List all tables
    const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log("\n--- TABLES ---");
    tablesRes.rows.forEach(r => console.log(r.table_name));
    
    // 2. Inspect 'user' table columns
    console.log("\n--- 'user' TABLE COLUMNS ---");
    const userCols = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'user' AND table_schema = 'public'
    `);
    userCols.rows.forEach(r => console.log(`${r.column_name}: ${r.data_type}`));

    // 3. Inspect 'leads' table columns
    console.log("\n--- 'leads' TABLE COLUMNS ---");
    const leadsCols = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'leads' AND table_schema = 'public'
    `);
    leadsCols.rows.forEach(r => console.log(`${r.column_name}: ${r.data_type}`));
    
    // 4. Inspect some users
    console.log("\n--- USERS DATA ---");
    const usersData = await client.query("SELECT id, name, email, role FROM \"user\" LIMIT 5");
    usersData.rows.forEach(r => console.log(r));

    // 5. Inspect some leads
    console.log("\n--- LEADS DATA ---");
    const leadsData = await client.query("SELECT * FROM \"leads\" LIMIT 5");
    leadsData.rows.forEach(r => console.log(r));

    client.release();
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

main();
