import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function createDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD ?? process.env.DB_PASS ?? '',
  });

  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS lpk_dashboard`);
    console.log("Database 'lpk_dashboard' created or already exists.");
  } catch (error) {
    console.error("Error creating database:", error);
  } finally {
    await connection.end();
  }
}

createDatabase();
