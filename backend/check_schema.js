
import { db } from './db.js';

async function checkSchema() {
  try {
    const [columns] = await db.query("SHOW COLUMNS FROM member_data_diri WHERE Field = 'member_id'");
    console.log("member_data_diri member_id:", columns);

    const [columns2] = await db.query("SHOW COLUMNS FROM member_riwayat_pendidikan WHERE Field = 'id'");
    console.log("member_riwayat_pendidikan id:", columns2);
  } catch (err) {
    console.error(err);
  }
  process.exit();
}

checkSchema();
