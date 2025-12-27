
import { db } from './db.js';

async function checkMissingKeys() {
  try {
    const [rows] = await db.query(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = 'lpk_dashboard'
    `);
    
    const tableNames = rows.map(r => r.TABLE_NAME);
    console.log("Tables found:", tableNames);

    for (const table of tableNames) {
      const [keys] = await db.query(`
        SHOW KEYS FROM ${table} WHERE Key_name = 'PRIMARY'
      `);
      if (keys.length === 0) {
        console.log(`Table ${table} is missing PRIMARY KEY`);
      }
    }
  } catch (err) {
    console.error(err);
  }
  process.exit();
}

checkMissingKeys();
