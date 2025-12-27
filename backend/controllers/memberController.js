import { db } from "../db.js";

export const registerMember = (req, res) => {
  const {
    nama, umur, gender, status, kewarganegaraan,
    tempat_lahir, tanggal_lahir, alamat_rumah, no_hp,
    tujuan, gol_darah, hobi, agama,

    nama_smp, tahun_masuk_smp, tahun_lulus_smp,
    nama_sma_smk, tahun_masuk_sma_smk, tahun_lulus_sma_smk,

    perusahaan, posisi, tahun_masuk_kerja, tahun_selesai_kerja
  } = req.body;

  const foto = req.file ? req.file.filename : null;

  // ====================================
  // 1. Insert ke tabel member_data_diri
  // ====================================
  const sql1 = `
    INSERT INTO member_data_diri 
    (nama, umur, gender, status, kewarganegaraan, tempat_lahir, tanggal_lahir,
     alamat_rumah, no_hp, tujuan, gol_darah, hobi, agama)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql1,
    [
     nama, umur, gender, status, kewarganegaraan,
      tempat_lahir, tanggal_lahir, alamat_rumah, no_hp,
      tujuan, gol_darah, hobi, agama,
    ],
    (err, result1) => {
      if (err) return res.status(500).json(err);

      const memberId = result1.insertId;

      // ====================================
      // 2. Insert Riwayat Pendidikan
      // ====================================
      const sql2 = `
        INSERT INTO member_riwayat_pendidikan 
        (member_id, nama_smp, tahun_masuk_smp, tahun_lulus_smp,
         nama_sma_smk, tahun_masuk_sma_smk, tahun_lulus_sma_smk)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      db.query(sql2,
        [
          memberId,
          nama_smp, tahun_masuk_smp, tahun_lulus_smp,
          nama_sma_smk, tahun_masuk_sma_smk, tahun_lulus_sma_smk
        ]
      );

      // ====================================
      // 3. Insert Riwayat Pekerjaan
      // ====================================
      const sql3 = `
        INSERT INTO member_riwayat_pekerjaan
        (member_id, perusahaan, posisi, tahun_masuk_kerja, tahun_selesai_kerja)
        VALUES (?, ?, ?, ?, ?)
      `;

      db.query(sql3,
        [
          memberId,
          perusahaan, posisi, tahun_masuk_kerja, tahun_selesai_kerja
        ]
      );

      res.json({
        message: "Registrasi member berhasil!",
        member_id: memberId
      });
    }
  );
};
