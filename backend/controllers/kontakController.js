import {db} from "../db.js";

export const getKontak = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM kontak ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil pesan" });
  }
};

export const addKontak = async (req, res) => {
  const { nama, email, pesan } = req.body;

  try {
    await db.query(
      "INSERT INTO kontak (nama, email, pesan) VALUES (?, ?, ?)",
      [nama, email, pesan]
    );
    res.json({ message: "Pesan terkirim" });
  } catch (err) {
    res.status(500).json({ message: "Gagal mengirim pesan" });
  }
};
