
import { db } from './db.js';

async function createMissingTables() {
  try {
    console.log("Creating missing tables...");

    await db.query(`
      CREATE TABLE IF NOT EXISTS pembayaran (
        id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        order_id varchar(50) NOT NULL,
        program_id int(11) DEFAULT NULL,
        nama varchar(255) DEFAULT NULL,
        email varchar(255) DEFAULT NULL,
        telp varchar(20) DEFAULT NULL,
        metode varchar(50) DEFAULT NULL,
        biaya int(11) DEFAULT NULL,
        status enum('pending','settlement','cancel') NOT NULL DEFAULT 'pending',
        snap_token varchar(100) NOT NULL,
        created_at timestamp NULL DEFAULT current_timestamp()
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);
    console.log("Created pembayaran");

    await db.query(`
      CREATE TABLE IF NOT EXISTS program_daftar (
        id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        program varchar(50) DEFAULT NULL,
        nama varchar(100) DEFAULT NULL,
        email varchar(100) DEFAULT NULL,
        telp varchar(20) DEFAULT NULL,
        metode varchar(50) DEFAULT NULL,
        order_id varchar(100) DEFAULT NULL,
        status varchar(20) DEFAULT 'UNPAID',
        created_at timestamp NULL DEFAULT current_timestamp()
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);
    console.log("Created program_daftar");

    await db.query(`
      CREATE TABLE IF NOT EXISTS program_kelas (
        id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        nama_program varchar(255) DEFAULT NULL,
        kapasitas int(11) DEFAULT NULL,
        terdaftar int(11) DEFAULT 0
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);
    console.log("Created program_kelas");

  } catch (err) {
    console.error(err);
  }
  process.exit();
}

createMissingTables();
