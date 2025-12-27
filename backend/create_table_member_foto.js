// Script untuk membuat tabel member_foto secara otomatis
// Jalankan dengan: node backend/create_table_member_foto.js

import { db } from "./db.js";

const createMemberFotoTable = async () => {
  try {
    console.log("Creating member_foto table...");
    
    // Cek apakah tabel sudah ada
    const [tables] = await db.query(
      "SHOW TABLES LIKE 'member_foto'"
    );
    
    if (tables.length > 0) {
      console.log("✅ Tabel member_foto sudah ada!");
      process.exit(0);
    }
    
    // Buat tabel jika belum ada
    await db.query(`
      CREATE TABLE IF NOT EXISTS \`member_foto\` (
        \`foto_id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`member_id\` INT NOT NULL,
        \`foto\` VARCHAR(255) NOT NULL,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX \`idx_member_id\` (\`member_id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    console.log("✅ Tabel member_foto berhasil dibuat!");
    
    // Cek apakah foreign key bisa ditambahkan (jika tabel member_data_diri ada)
    try {
      await db.query(`
        ALTER TABLE \`member_foto\`
        ADD CONSTRAINT \`fk_member_foto_member_id\`
        FOREIGN KEY (\`member_id\`) REFERENCES \`member_data_diri\`(\`member_id\`)
        ON DELETE CASCADE
      `);
      console.log("✅ Foreign key constraint berhasil ditambahkan!");
    } catch (fkErr) {
      console.warn("⚠️  Foreign key constraint tidak bisa ditambahkan:", fkErr.message);
      console.warn("   (Ini tidak masalah, tabel tetap bisa digunakan)");
    }
    
    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating table:", err);
    process.exit(1);
  }
};

createMemberFotoTable();

