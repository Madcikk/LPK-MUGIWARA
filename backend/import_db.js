import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

async function importDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD ?? process.env.DB_PASS ?? '',
    database: 'lpk_dashboard',
    multipleStatements: true
  });

  try {
    const sqlPath = path.resolve('../lpk_dashboard.sql');
    if (!fs.existsSync(sqlPath)) {
        console.error("SQL file not found:", sqlPath);
        return;
    }
    const sql = fs.readFileSync(sqlPath, 'utf8');
    await connection.query(sql);
    console.log("Database imported successfully.");
  } catch (error) {
    console.error("Error importing database:", error);
  } finally {
    await connection.end();
  }
}

importDatabase();
