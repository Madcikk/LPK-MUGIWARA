
import { db } from './db.js';

async function fixDb() {
  try {
    console.log("Deleting invalid member_data_diri (id=0)...");
    await db.query("DELETE FROM member_data_diri WHERE member_id = 0");
    
    console.log("Applying AUTO_INCREMENT...");
    
    const tables = [
      { name: 'member_data_diri', col: 'member_id' },
      { name: 'member_riwayat_pendidikan', col: 'id' },
      { name: 'member_riwayat_pekerjaan', col: 'id' },
      { name: 'member_foto', col: 'foto_id' },
      { name: 'pembayaran', col: 'id' },
      { name: 'program_daftar', col: 'id' },
      { name: 'berita', col: 'id' },
      { name: 'kontak', col: 'id' },
      { name: 'galeri', col: 'id' }
    ];

    for (const t of tables) {
      try {
        console.log(`Fixing ${t.name}...`);
        await db.query(`ALTER TABLE ${t.name} MODIFY ${t.col} INT(11) NOT NULL AUTO_INCREMENT`);
      } catch (e) {
        console.log(`Failed to fix ${t.name}:`, e.message);
      }
    }
    
    console.log("Done.");
  } catch (err) {
    console.error("Critical error:", err);
  }
  process.exit();
}

fixDb();
