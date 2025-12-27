import express from "express";
import { login } from "../controllers/authController.js";
import { db } from "../db.js";
import bcrypt from "bcryptjs";

const router = express.Router();

router.post("/login", login);

// Register Mentor Sederhana
router.post("/register-mentor", async (req, res) => {
  try {
    const { nama, email, password, keahlian, bio } = req.body;

    if (!nama || !email || !password) {
      return res.status(400).json({ message: "Nama, email, dan password wajib diisi" });
    }

    // Cek email sudah terdaftar
    const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await db.query(
      "INSERT INTO users (name, email, password, role, status) VALUES (?, ?, ?, 'mentor', 'active')",
      [nama, email, hashedPassword]
    );

    // Insert mentor profile sederhana (asumsi tabel mentor_profiles ada)
    await db.query(
      "INSERT INTO mentor_profiles (user_id, keahlian, bio) VALUES (?, ?, ?)",
      [result.insertId, keahlian || null, bio || null]
    );

    res.status(201).json({ message: "Registrasi mentor berhasil" });
  } catch (err) {
    console.error("Error registering mentor:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
