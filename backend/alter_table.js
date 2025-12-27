import mysql from 'mysql2/promise';

async function alterTable() {
  const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'lpk_dashboard'
  });

  try {
    await db.query('ALTER TABLE users ADD COLUMN role ENUM("admin", "mentor", "member") DEFAULT "member"');
    console.log('✓ Added role column');
  } catch (e) {
    console.log('Role column error:', e.message);
  }

  try {
    await db.query('ALTER TABLE users ADD COLUMN status ENUM("active", "inactive", "pending_approval", "rejected") DEFAULT "active"');
    console.log('✓ Added status column');
  } catch (e) {
    console.log('Status column error:', e.message);
  }

  try {
    await db.query('ALTER TABLE users ADD COLUMN phone VARCHAR(20)');
    console.log('✓ Added phone column');
  } catch (e) {
    console.log('Phone column error:', e.message);
  }

  try {
    await db.query('ALTER TABLE users ADD COLUMN foto VARCHAR(255)');
    console.log('✓ Added foto column');
  } catch (e) {
    console.log('Foto column error:', e.message);
  }

  console.log('✓ Table alteration completed');
  process.exit(0);
}

alterTable();