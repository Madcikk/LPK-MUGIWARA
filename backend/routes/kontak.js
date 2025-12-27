import express from "express";
import { db } from "../db.js";

const router = express.Router();

// GET semua kontak
router.get("/", async (req, res) => {
  const [data] = await db.query("SELECT * FROM kontak ORDER BY id DESC");
  res.json(data);
});

// POST kontak (public)
router.post("/", async (req, res) => {
  const { nama, email, pesan } = req.body;

  await db.query(
    "INSERT INTO kontak (nama, email, pesan) VALUES (?, ?, ?)",
    [nama, email, pesan]
  );

  res.json({ success: true });
});

export default router;
