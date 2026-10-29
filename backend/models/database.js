const fs = require('fs');
const { Pool } = require('pg');
const { DATABASE_URL, SEED_PATH } = require('../config');

let memoryData = {
  institutions: [],
  members: [],
  users: []
};

let pool = null;
let isPostgresActive = false;

function loadLocalSeeds() {
  try {
    const raw = fs.readFileSync(SEED_PATH, 'utf8');
    memoryData = JSON.parse(raw);
  } catch (err) {
    console.error('[DB Error]', err.message);
  }
}

async function initDatabase() {
  loadLocalSeeds();

  if (!DATABASE_URL) {
    isPostgresActive = false;
    return;
  }

  try {
    pool = new Pool({
      connectionString: DATABASE_URL,
      ssl: DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
    });

    await pool.query(`
      CREATE TABLE IF NOT EXISTS institutions (
        id VARCHAR(100) PRIMARY KEY,
        slug VARCHAR(100),
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        tagline TEXT,
        address VARCHAR(255) NOT NULL,
        phone VARCHAR(100),
        is_premium BOOLEAN DEFAULT FALSE,
        owner JSONB DEFAULT '{}',
        plans JSONB DEFAULT '[]',
        stats JSONB DEFAULT '{}'
      );

      CREATE TABLE IF NOT EXISTS members (
        id VARCHAR(100) PRIMARY KEY,
        institution_id VARCHAR(100) NOT NULL,
        registered_at VARCHAR(100),
        source VARCHAR(100),
        full_name VARCHAR(255) NOT NULL,
        dni VARCHAR(50) NOT NULL,
        phone VARCHAR(100),
        email VARCHAR(255),
        plan_name VARCHAR(100),
        monthly_amount NUMERIC(10, 2),
        payment_status VARCHAR(50),
        last_payment_date VARCHAR(50),
        due_date VARCHAR(50),
        attendances_this_month INT DEFAULT 0,
        last_attendance VARCHAR(100),
        notes TEXT
      );

      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(100),
        username VARCHAR(100) PRIMARY KEY,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        institution_id VARCHAR(100),
        dni VARCHAR(50),
        phone VARCHAR(100),
        email VARCHAR(255),
        terms_accepted BOOLEAN DEFAULT TRUE,
        terms_accepted_date VARCHAR(50)
      );
    `);

    const countRes = await pool.query('SELECT COUNT(*) FROM institutions');
    if (parseInt(countRes.rows[0].count, 10) === 0) {
      await pool.query('BEGIN');
      try {
        for (const inst of memoryData.institutions) {
          await pool.query(
            `INSERT INTO institutions (id, slug, name, category, tagline, address, phone, is_premium, owner, plans, stats)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
            [
              inst.id,
              inst.slug,
              inst.name,
              inst.category,
              inst.tagline,
              inst.address,
              inst.phone,
              Boolean(inst.isPremium),
              JSON.stringify(inst.owner || {}),
              JSON.stringify(inst.plans || []),
              JSON.stringify(inst.stats || {})
            ]
          );
        }

        for (const m of memoryData.members) {
          await pool.query(
            `INSERT INTO members (id, institution_id, registered_at, source, full_name, dni, phone, email, plan_name, monthly_amount, payment_status, last_payment_date, due_date, attendances_this_month, last_attendance, notes)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
            [
              m.id,
              m.institutionId,
              m.registeredAt,
              m.source,
              m.fullName,
              m.dni,
              m.phone,
              m.email,
              m.planName,
              m.monthlyAmount,
              m.paymentStatus,
              m.lastPaymentDate,
              m.dueDate,
              m.attendancesThisMonth || 0,
              m.lastAttendance,
              m.notes
            ]
          );
        }

        for (const u of memoryData.users) {
          await pool.query(
            `INSERT INTO users (id, username, password, name, role, institution_id, dni, phone, email, terms_accepted, terms_accepted_date)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
            [
              u.id,
              u.username,
              u.password,
              u.name,
              u.role,
              u.institutionId,
              u.dni,
              u.phone,
              u.email,
              Boolean(u.termsAccepted),
              u.termsAcceptedDate
            ]
          );
        }
        await pool.query('COMMIT');
      } catch (insertErr) {
        await pool.query('ROLLBACK');
        throw insertErr;
      }
    }

    isPostgresActive = true;
  } catch (err) {
    console.error('[PostgreSQL Error]', err.message);
    isPostgresActive = false;
  }
}

async function query(text, params) {
  if (isPostgresActive && pool) {
    return pool.query(text, params);
  }
  return null;
}

async function resetDatabase() {
  loadLocalSeeds();

  if (isPostgresActive && pool) {
    await pool.query('BEGIN');
    try {
      await pool.query('TRUNCATE TABLE members, institutions, users');

      for (const inst of memoryData.institutions) {
        await pool.query(
          `INSERT INTO institutions (id, slug, name, category, tagline, address, phone, is_premium, owner, plans, stats)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
          [
            inst.id,
            inst.slug,
            inst.name,
            inst.category,
            inst.tagline,
            inst.address,
            inst.phone,
            Boolean(inst.isPremium),
            JSON.stringify(inst.owner || {}),
            JSON.stringify(inst.plans || []),
            JSON.stringify(inst.stats || {})
          ]
        );
      }

      for (const m of memoryData.members) {
        await pool.query(
          `INSERT INTO members (id, institution_id, registered_at, source, full_name, dni, phone, email, plan_name, monthly_amount, payment_status, last_payment_date, due_date, attendances_this_month, last_attendance, notes)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
          [
            m.id,
            m.institutionId,
            m.registeredAt,
            m.source,
            m.fullName,
            m.dni,
            m.phone,
            m.email,
            m.planName,
            m.monthlyAmount,
            m.paymentStatus,
            m.lastPaymentDate,
            m.dueDate,
            m.attendancesThisMonth || 0,
            m.lastAttendance,
            m.notes
          ]
        );
      }

      for (const u of memoryData.users) {
        await pool.query(
          `INSERT INTO users (id, username, password, name, role, institution_id, dni, phone, email, terms_accepted, terms_accepted_date)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
          [
            u.id,
            u.username,
            u.password,
            u.name,
            u.role,
            u.institutionId,
            u.dni,
            u.phone,
            u.email,
            Boolean(u.termsAccepted),
            u.termsAcceptedDate
          ]
        );
      }
      await pool.query('COMMIT');
    } catch (resetErr) {
      await pool.query('ROLLBACK');
      throw resetErr;
    }
  }
}

module.exports = {
  initDatabase,
  resetDatabase,
  query,
  isPostgres: () => isPostgresActive,
  getMemoryData: () => memoryData
};
