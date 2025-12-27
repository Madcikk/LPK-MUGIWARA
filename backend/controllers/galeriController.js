import {db} from "../db.js";

export const getGaleri = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM galeri ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil data galeri" });
  }
};

export const addGaleri = async (req, res) => {
  const { caption } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    await db.query(
      "INSERT INTO galeri (caption, image) VALUES (?, ?)",
      [caption, image]
    );
    res.json({ message: "Galeri ditambahkan" });
  } catch (err) {
    res.status(500).json({ message: "Gagal menambah galeri" });
  }
};

export const deleteGaleri = async (req, res) => {
  try {
    await db.query("DELETE FROM galeri WHERE id=?", [req.params.id]);
    res.json({ message: "Galeri dihapus" });
  } catch (err) {
    res.status(500).json({ message: "Gagal menghapus galeri" });
  }
};
