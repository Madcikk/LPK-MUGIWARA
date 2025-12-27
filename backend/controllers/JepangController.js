import { db } from "../db.js";

const MAKSIMAL_PESERTA = 15;

// ===============================
// CEK KAPASITAS PROGRAM JEPANG
// ===============================
export const getKapasitasJepang = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT kapasitas, terdaftar 
      FROM program_kelas 
      WHERE nama_program = 'Jepang'
    `);

    const kapasitas = rows[0].kapasitas;
    const terdaftar = rows[0].terdaftar;

    return res.json({
      program: "Jepang",
      total_pendaftar: terdaftar,
      kapasitas_maksimal: kapasitas,
      sisa_kursi: kapasitas - terdaftar,
      status: terdaftar >= kapasitas ? "Penuh" : "Tersedia",
    });

  } catch (err) {
    return res.status(500).json({ message: "Database error", err });
  }
};


// ===============================
// DAFTAR PROGRAM JEPANG
// ===============================
export const daftarProgramJepang = async (req, res) => {
  const { nama, email, telp, metode } = req.body;

  if (!nama || !email || !telp || !metode) {
    return res.status(400).json({ message: "Semua field wajib diisi." });
  }

  try {
    // CEK KUOTA
    const [cek] = await db.query(`
      SELECT terdaftar, kapasitas 
      FROM program_kelas 
      WHERE nama_program = 'Jepang'
    `);

    const total = cek[0].terdaftar;
    const kapasitas = cek[0].kapasitas;

    if (total >= kapasitas) {
      return res.status(403).json({
        success: false,
        message: "Pendaftaran ditutup. Kuota penuh.",
      });
    }

    // INSERT DATA PENDAFTAR
    const [result] = await db.query(
      `
      INSERT INTO program_daftar
      (program, nama, email, telp, metode)
      VALUES (?, ?, ?, ?, ?)
      `,
      ["Jepang", nama, email, telp, metode]
    );

    // UPDATE terdaftar di program_kelas
    await db.query(`
      UPDATE program_kelas 
      SET terdaftar = terdaftar + 1
      WHERE nama_program = 'Jepang'
    `);

    return res.json({
      success: true,
      message: "Pendaftaran berhasil!",
      id: result.insertId,
      terdaftar: total + 1
    });

  } catch (err) {
    return res.status(500).json({ message: "Gagal menyimpan data", err });
  }
};
