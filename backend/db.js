import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

console.log('Cek connection DB:', process.env.DB_NAME);

const dbHost = process.env.DB_HOST || 'localhost';
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD ?? process.env.DB_PASS ?? '';
const dbName = process.env.DB_NAME || '';
const dbPort = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3307;

export const db = mysql.createPool({
  host: dbHost,
  user: dbUser,
  password: dbPassword,
  database: dbName,
  port: dbPort,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Database connection test
(async () => {
  try {
    console.log('Attempting database connection...');
    const conn = await db.getConnection();
    await conn.ping();
    conn.release();
    console.log('✓ Database connection OK');

    // Create tables if not exist
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'mentor', 'member') DEFAULT 'member',
        status ENUM('active', 'inactive', 'pending_approval', 'rejected') DEFAULT 'active',
        phone VARCHAR(20),
        foto VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Add missing columns to existing users table if they don't exist
    try {
      await db.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS role ENUM('admin', 'mentor', 'member') DEFAULT 'member'`);
    } catch (err) {
      console.log('Column role might already exist or error:', err.message);
    }

    try {
      await db.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS status ENUM('active', 'inactive', 'pending_approval', 'rejected') DEFAULT 'active'`);
    } catch (err) {
      console.log('Column status might already exist or error:', err.message);
    }

    try {
      await db.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20)`);
    } catch (err) {
      console.log('Column phone might already exist or error:', err.message);
    }

    try {
      await db.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS foto VARCHAR(255)`);
    } catch (err) {
      console.log('Column foto might already exist or error:', err.message);
    }

    try {
      await db.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`);
    } catch (err) {
      console.log('Column created_at might already exist or error:', err.message);
    }

    // Alter mentor tables to make file columns nullable
    try {
      await db.query(`ALTER TABLE mentor_pendidikan MODIFY COLUMN ijazah_file VARCHAR(255) NULL`);
    } catch (err) {
      console.log('mentor_pendidikan ijazah_file column might already be nullable:', err.message);
    }

    try {
      await db.query(`ALTER TABLE mentor_sertifikat MODIFY COLUMN file VARCHAR(255) NULL`);
    } catch (err) {
      console.log('mentor_sertifikat file column might already be nullable:', err.message);
    }

    await db.query(`
      CREATE TABLE IF NOT EXISTS mentor_profiles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        tempat_lahir VARCHAR(255),
        tanggal_lahir DATE,
        jenis_kelamin ENUM('L', 'P'),
        alamat TEXT,
        bahasa_inggris BOOLEAN DEFAULT FALSE,
        bahasa_korea BOOLEAN DEFAULT FALSE,
        bahasa_jepang BOOLEAN DEFAULT FALSE,
        pengalaman_mengajar TEXT,
        alasan_menjadi_mentor TEXT,
        approved_at DATETIME,
        approved_by INT,
        admin_notes TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS mentor_pendidikan (
        id INT AUTO_INCREMENT PRIMARY KEY,
        mentor_profile_id INT NOT NULL,
        tingkat VARCHAR(50),
        tingkat_lainnya VARCHAR(255),
        jurusan VARCHAR(255),
        universitas VARCHAR(255),
        tahun_masuk YEAR,
        tahun_lulus YEAR,
        ijazah_file VARCHAR(255),
        urutan INT,
        FOREIGN KEY (mentor_profile_id) REFERENCES mentor_profiles(id) ON DELETE CASCADE
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS mentor_sertifikat (
        id INT AUTO_INCREMENT PRIMARY KEY,
        mentor_profile_id INT NOT NULL,
        nama_sertifikat VARCHAR(255) NOT NULL,
        penerbit VARCHAR(255),
        tahun YEAR,
        file VARCHAR(255),
        FOREIGN KEY (mentor_profile_id) REFERENCES mentor_profiles(id) ON DELETE CASCADE
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS kelas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        mentor_id INT NOT NULL,
        judul VARCHAR(255) NOT NULL,
        deskripsi TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (mentor_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS materi (
        id INT AUTO_INCREMENT PRIMARY KEY,
        kelas_id INT NOT NULL,
        judul VARCHAR(255) NOT NULL,
        konten TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (kelas_id) REFERENCES kelas(id) ON DELETE CASCADE
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS tugas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        kelas_id INT NOT NULL,
        judul VARCHAR(255) NOT NULL,
        deskripsi TEXT,
        deadline DATETIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (kelas_id) REFERENCES kelas(id) ON DELETE CASCADE
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS pengumpulan_tugas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tugas_id INT NOT NULL,
        user_id INT NOT NULL,
        file_path VARCHAR(255),
        nilai INT,
        feedback TEXT,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tugas_id) REFERENCES tugas(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    console.log('✓ Tables checked/created');
  } catch (err) {
    console.error('✗ Database connection failed — please ensure MySQL is running and .env settings are correct.');
    console.error('DB host:', dbHost, 'port:', dbPort, 'user:', dbUser, 'database:', dbName);
    console.error('Error:', err && err.message ? err.message : err);
    // Don't exit the process, just log the error
    // process.exit(1);
  }
})().catch((err) => {
  console.error('Unhandled error in database initialization:', err);
  // Don't exit the process
});
