
import { db } from './db.js';

async function checkZeros() {
  try {
    const [rows1] = await db.query("SELECT count(*) as count FROM member_data_diri WHERE member_id = 0");
    console.log("member_data_diri with member_id=0:", rows1[0].count);

    const [rows2] = await db.query("SELECT count(*) as count FROM member_riwayat_pendidikan WHERE id = 0");
    console.log("member_riwayat_pendidikan with id=0:", rows2[0].count);
  } catch (err) {
    console.error(err);
  }
  process.exit();
}

checkZeros();
