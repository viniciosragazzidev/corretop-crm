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

    // 1. Create operadoras table
    console.log("Creating operadoras table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS operadoras (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) UNIQUE NOT NULL,
        logo_url VARCHAR(255)
      )
    `);

    // 2. Create planos table (including carencias)
    console.log("Creating planos table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS planos (
        id SERIAL PRIMARY KEY,
        "operadoraId" INTEGER REFERENCES operadoras(id) ON DELETE CASCADE,
        nome VARCHAR(255) NOT NULL,
        "tipoContratacao" VARCHAR(50) DEFAULT 'CNPJ', -- 'ADESAO' or 'CNPJ'
        segmentacao VARCHAR(50) DEFAULT 'GLOBAL', -- 'AMBULATORIAL', 'HOSPITALAR', 'GLOBAL'
        abrangencia VARCHAR(100) DEFAULT 'REGIONAL', -- 'REGIONAL', 'NACIONAL'
        beneficios TEXT,
        "carenciaUrgencia" INTEGER DEFAULT 24, -- hours
        "carenciaConsultas" INTEGER DEFAULT 30, -- days
        "carenciaExamesSimples" INTEGER DEFAULT 30, -- days
        "carenciaAltaComplexidade" INTEGER DEFAULT 180, -- days
        "carenciaPreexistencias" INTEGER DEFAULT 720 -- days
      )
    `);

    // 3. Create precos table
    console.log("Creating precos table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS precos (
        id SERIAL PRIMARY KEY,
        "planoId" INTEGER REFERENCES planos(id) ON DELETE CASCADE UNIQUE,
        "faixa0a18" NUMERIC(10,2) DEFAULT 0,
        "faixa19a23" NUMERIC(10,2) DEFAULT 0,
        "faixa24a28" NUMERIC(10,2) DEFAULT 0,
        "faixa29a33" NUMERIC(10,2) DEFAULT 0,
        "faixa34a38" NUMERIC(10,2) DEFAULT 0,
        "faixa39a43" NUMERIC(10,2) DEFAULT 0,
        "faixa44a48" NUMERIC(10,2) DEFAULT 0,
        "faixa49a53" NUMERIC(10,2) DEFAULT 0,
        "faixa54a58" NUMERIC(10,2) DEFAULT 0,
        "faixa59mais" NUMERIC(10,2) DEFAULT 0
      )
    `);

    console.log("Tables created successfully!");

    // 4. Seed Operadoras
    const opsCount = await client.query('SELECT COUNT(*) FROM operadoras');
    if (parseInt(opsCount.rows[0].count) === 0) {
      console.log("Seeding operadoras...");
      const ops = [
        { nome: 'Amil', logo_url: '/logos/amil.svg' },
        { nome: 'Bradesco Saúde', logo_url: '/logos/bradesco.svg' },
        { nome: 'Unimed', logo_url: '/logos/unimed.svg' },
        { nome: 'Amep Saúde', logo_url: '/logos/amep.svg' }
      ];
      for (const op of ops) {
        await client.query('INSERT INTO operadoras (nome, logo_url) VALUES ($1, $2)', [op.nome, op.logo_url]);
      }
      console.log("Seeded operadoras!");
    }

    // 5. Seed Planos & Precos for each operadora
    const planosCount = await client.query('SELECT COUNT(*) FROM planos');
    if (parseInt(planosCount.rows[0].count) === 0) {
      console.log("Seeding planos and precos...");
      const opList = await client.query('SELECT * FROM operadoras');
      
      for (const op of opList.rows) {
        let p1Name = '', p2Name = '';
        if (op.nome === 'Amil') {
          p1Name = 'Smart 200 PME';
          p2Name = 'Amil Fácil S60 PME';
        } else if (op.nome === 'Bradesco Saúde') {
          p1Name = 'Efetivo IV Adesão';
          p2Name = 'Nacional Flex CNPJ';
        } else if (op.nome === 'Unimed') {
          p1Name = 'Unifácil Regional';
          p2Name = 'Unimax Nacional';
        } else if (op.nome === 'Amep Saúde') {
          p1Name = 'Ideal Adesão';
          p2Name = 'Ideal PME';
        }

        // Insert Plano 1
        const p1Res = await client.query(`
          INSERT INTO planos ("operadoraId", nome, "tipoContratacao", segmentacao, abrangencia, beneficios, "carenciaUrgencia", "carenciaConsultas", "carenciaExamesSimples", "carenciaAltaComplexidade", "carenciaPreexistencias")
          VALUES ($1, $2, 'CNPJ', 'GLOBAL', 'REGIONAL', 'Desconto em medicamentos e reembolso de consultas externas.', 24, 30, 30, 180, 720)
          RETURNING id
        `, [op.id, p1Name]);
        const p1Id = p1Res.rows[0].id;

        // Insert Prices 1
        await client.query(`
          INSERT INTO precos ("planoId", "faixa0a18", "faixa19a23", "faixa24a28", "faixa29a33", "faixa34a38", "faixa39a43", "faixa44a48", "faixa49a53", "faixa54a58", "faixa59mais")
          VALUES ($1, 138.74, 145.67, 160.24, 176.26, 197.42, 221.11, 276.38, 317.84, 365.52, 493.45)
        `, [p1Id]);

        // Insert Plano 2
        const p2Res = await client.query(`
          INSERT INTO planos ("operadoraId", nome, "tipoContratacao", segmentacao, abrangencia, beneficios, "carenciaUrgencia", "carenciaConsultas", "carenciaExamesSimples", "carenciaAltaComplexidade", "carenciaPreexistencias")
          VALUES ($1, $2, 'ADESAO', 'GLOBAL', 'NACIONAL', 'Acesso a hospitais de referência e rede odontológica ampliada.', 24, 30, 30, 180, 720)
          RETURNING id
        `, [op.id, p2Name]);
        const p2Id = p2Res.rows[0].id;

        // Insert Prices 2
        await client.query(`
          INSERT INTO precos ("planoId", "faixa0a18", "faixa19a23", "faixa24a28", "faixa29a33", "faixa34a38", "faixa39a43", "faixa44a48", "faixa49a53", "faixa54a58", "faixa59mais")
          VALUES ($1, 238.12, 255.45, 280.99, 310.22, 350.56, 395.12, 480.34, 550.23, 630.90, 890.45)
        `, [p2Id]);
      }
      console.log("Seeded planos and precos successfully!");
    }

    client.release();
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

main();
