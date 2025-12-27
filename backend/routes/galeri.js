import express from "express";
import { db } from "../db.js";
import { verifyToken, requireRole } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// GET GALERI
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM galeri ORDER BY id DESC");

    const result = rows.map(r => ({
      ...r,
      image: "/uploads/" + r.image
    }));

    res.json(result);

  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil galeri" });
  }
});

// POST GALERI
router.post("/", upload.single("image"), async (req, res) => {
  const caption = req.body.caption;
  const image = req.file ? req.file.filename : null;

  if (!image) {
    return res.status(400).json({ message: "File tidak ditemukan" });
  }

  await db.query(
    "INSERT INTO galeri (caption, image) VALUES (?, ?)",
    [caption, image]
  );

  res.json({ message: "Berhasil upload galeri" });
});


// DELETE GALERI
router.delete("/:id", verifyToken, requireRole(["admin"]), async (req, res) => {
  try {
    await db.query("DELETE FROM galeri WHERE id=?", [req.params.id]);
    res.json({ message: "Galeri dihapus" });
  } catch (err) {
    res.status(500).json({ message: "Gagal menghapus galeri" });
  }
});

export default router;
