
import { db } from './db.js';

async function repair() {
  try {
    console.log("Adding Primary Keys and Auto Increment...");

    const fixList = [
      { tbl: 'admin', col: 'id' },
      { tbl: 'berita', col: 'id' },
      { tbl: 'classes', col: 'id' },
      { tbl: 'galeri', col: 'id' },
      { tbl: 'kontak', col: 'id' },
      { tbl: 'member_data_diri', col: 'member_id' },
      { tbl: 'member_foto', col: 'foto_id' },
      { tbl: 'member_riwayat_pekerjaan', col: 'id' },
      { tbl: 'member_riwayat_pendidikan', col: 'id' }
    ];

    for (const item of fixList) {
      try {
        console.log(`Processing ${item.tbl}...`);
        // Check if PK exists first to avoid error? No, just try catch.
        await db.query(`ALTER TABLE ${item.tbl} ADD PRIMARY KEY (${item.col})`);
        console.log(`  Added PK to ${item.tbl}`);
        
        await db.query(`ALTER TABLE ${item.tbl} MODIFY ${item.col} INT(11) NOT NULL AUTO_INCREMENT`);
        console.log(`  Added AUTO_INCREMENT to ${item.tbl}`);
      } catch (err) {
        if (err.message.includes('Multiple primary key defined')) {
             console.log(`  PK already exists for ${item.tbl}, trying AUTO_INCREMENT...`);
             try {
                await db.query(`ALTER TABLE ${item.tbl} MODIFY ${item.col} INT(11) NOT NULL AUTO_INCREMENT`);
                console.log(`  Added AUTO_INCREMENT to ${item.tbl}`);
             } catch (e) {
                console.error(`  Error adding AI to ${item.tbl}:`, e.message);
             }
        } else {
             console.error(`  Error on ${item.tbl}:`, err.message);
        }
      }
    }
    
    console.log("Repair complete.");
  } catch (err) {
    console.error(err);
  }
  process.exit();
}

repair();
