// controllers/berita.js
import { db } from "../db.js";

// GET BERITA (ALL)
export const getBerita = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM berita ORDER BY id DESC");
    

    const result = rows.map((b) => ({
      ...b,
      image: b.image ? "/uploads/" + b.image : null,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil data berita" });
  }
};

// GET SINGLE BERITA BY ID
export const getBeritaById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query("SELECT * FROM berita WHERE id = ?", [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: "Berita tidak ditemukan" });
    }

    const result = {
      ...rows[0],
      image: rows[0].image ? "/uploads/" + rows[0].image : null,
    };

    res.json(result);
  } catch (err) {
    console.error("Error fetching berita by id:", err);
    res.status(500).json({ message: "Gagal mengambil data berita" });
  }
};

// ADD BERITA
export const addBerita = async (req, res) => {
  const { title, content } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    await db.query(
      "INSERT INTO berita (title, content, image) VALUES (?, ?, ?)",
      [title, content, image]
    );

    res.json({ message: "Berita ditambahkan" });
  } catch (err) {
    res.status(500).json({ message: "Gagal menambah berita" });
  }
};

// UPDATE BERITA
export const updateBerita = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const image = req.file ? req.file.filename : null;

    // Jika ada gambar baru, update dengan gambar
    if (image) {
      await db.query(
        "UPDATE berita SET title = ?, content = ?, image = ? WHERE id = ?",
        [title, content, image, id]
      );
    } else {
      // Jika tidak ada gambar baru, hanya update title dan content
      await db.query(
        "UPDATE berita SET title = ?, content = ? WHERE id = ?",
        [title, content, id]
      );
    }

    res.json({ message: "Berita berhasil diperbarui" });
  } catch (err) {
    console.error("Error updating berita:", err);
    res.status(500).json({ message: "Gagal memperbarui berita" });
  }
};

// DELETE BERITA
export const deleteBerita = async (req, res) => {
  try {
    await db.query("DELETE FROM berita WHERE id=?", [req.params.id]);
    res.json({ message: "Berita dihapus" });
  } catch (err) {
    res.status(500).json({ message: "Gagal menghapus berita" });
  }
};
