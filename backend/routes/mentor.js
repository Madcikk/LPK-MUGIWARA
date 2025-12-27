import express from "express";
import { db } from "../db.js";
import { verifyToken } from "../middleware/auth.js";
import bcrypt from "bcryptjs";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Setup multer untuk multiple files
const uploadsDir = "uploads";
const mentorDir = `${uploadsDir}/mentor_documents`;
const mentorFotoDir = `${uploadsDir}/mentor_foto`;
const mentorIjazahDir = `${mentorDir}/ijazah`;
const mentorSertifikatDir = `${mentorDir}/sertifikat`;

[uploadsDir, mentorDir, mentorFotoDir, mentorIjazahDir, mentorSertifikatDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "foto") {
      cb(null, mentorFotoDir);
    } else if (file.fieldname.startsWith("ijazah_")) {
      cb(null, mentorIjazahDir);
    } else if (file.fieldname.startsWith("sertifikat_")) {
      cb(null, mentorSertifikatDir);
    } else {
      cb(null, uploadsDir);
    }
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    if (file.fieldname === "foto") {
      cb(null, `foto-${unique}${path.extname(file.originalname)}`);
    } else if (file.fieldname.startsWith("ijazah_")) {
      cb(null, `ijazah-${unique}${path.extname(file.originalname)}`);
    } else if (file.fieldname.startsWith("sertifikat_")) {
      cb(null, `sertifikat-${unique}${path.extname(file.originalname)}`);
    } else {
      cb(null, unique + path.extname(file.originalname));
    }
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Hanya file gambar (JPG/PNG) atau PDF yang diizinkan"));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter
});

// ============================================
// REGISTER MENTOR (3-step form)
// ============================================
router.post("/register", upload.any(), async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      tempat_lahir,
      tanggal_lahir,
      jenis_kelamin,
      alamat,
      bahasa_inggris,
      bahasa_korea,
      bahasa_jepang,
      pengalaman_mengajar,
      alasan_menjadi_mentor,
      // Pendidikan (JSON array)
      pendidikan,
      // Sertifikat (JSON array)
      sertifikat
    } = req.body;

    // Validasi
    if (!name || !email || !password || !phone || !tempat_lahir || !tanggal_lahir || !jenis_kelamin || !alamat) {
      return res.status(400).json({ error: "Semua field biodata wajib diisi" });
    }

    // Get files from request
    const files = req.files || [];
    const fotoFile = files.find(f => f.fieldname === "foto");

    if (!fotoFile) {
      return res.status(400).json({ error: "Foto profil wajib diupload" });
    }

    console.log("Files received:", files.map(f => ({ fieldname: f.fieldname, filename: f.filename })));

    // Validasi bahasa
    const bahasaInggris = bahasa_inggris === "true" || bahasa_inggris === true;
    const bahasaKorea = bahasa_korea === "true" || bahasa_korea === true;
    const bahasaJepang = bahasa_jepang === "true" || bahasa_jepang === true;

    if (!bahasaInggris && !bahasaKorea && !bahasaJepang) {
      return res.status(400).json({ error: "Pilih minimal 1 bahasa yang akan diajarkan" });
    }

    // Validasi pendidikan
    let pendidikanData = [];
    try {
      pendidikanData = JSON.parse(pendidikan || "[]");
    } catch (e) {
      return res.status(400).json({ error: "Format data pendidikan tidak valid" });
    }

    if (pendidikanData.length === 0) {
      return res.status(400).json({ error: "Minimal 1 riwayat pendidikan wajib diisi" });
    }

    // Validasi pendidikan terakhir minimal S1 atau D3
    const pendidikanTerakhir = pendidikanData[0]; // Yang pertama adalah terakhir
    if (pendidikanTerakhir.tingkat !== "S1" && pendidikanTerakhir.tingkat !== "D3") {
      return res.status(400).json({ error: "Pendidikan terakhir minimal S1 atau D3" });
    }

    // Validasi sertifikat
    let sertifikatData = [];
    try {
      sertifikatData = JSON.parse(sertifikat || "[]");
    } catch (e) {
      return res.status(400).json({ error: "Format data sertifikat tidak valid" });
    }

    if (sertifikatData.length === 0) {
      return res.status(400).json({ error: "Minimal 1 sertifikat skill wajib diupload" });
    }

    // Cek email sudah terdaftar
    const [existingUser] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: "Email sudah terdaftar" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Mulai transaction
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // 1. Insert user
      const [userResult] = await connection.query(
        `INSERT INTO users (name, email, password, role, status, phone, foto)
         VALUES (?, ?, ?, 'mentor', 'pending_approval', ?, ?)`,
        [name, email, hashedPassword, phone, `/mentor_foto/${fotoFile.filename}`]
      );

      const userId = userResult.insertId;

      // 2. Insert mentor profile
      const [profileResult] = await connection.query(
        `INSERT INTO mentor_profiles
         (user_id, tempat_lahir, tanggal_lahir, jenis_kelamin, alamat,
          bahasa_inggris, bahasa_korea, bahasa_jepang,
          pengalaman_mengajar, alasan_menjadi_mentor)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          tempat_lahir,
          tanggal_lahir,
          jenis_kelamin,
          alamat,
          bahasaInggris,
          bahasaKorea,
          bahasaJepang,
          pengalaman_mengajar || null,
          alasan_menjadi_mentor || null
        ]
      );

      const mentorProfileId = profileResult.insertId;

      // 3. Insert pendidikan (multiple)
      for (let i = 0; i < pendidikanData.length; i++) {
        const p = pendidikanData[i];
        // Find corresponding ijazah file
        const ijazahFile = files.find(f => f.fieldname === `ijazah_${i}`);
        const ijazahFilePath = ijazahFile ? `/mentor_documents/ijazah/${ijazahFile.filename}` : null;

        await connection.query(
          `INSERT INTO mentor_pendidikan
           (mentor_profile_id, tingkat, tingkat_lainnya, jurusan, universitas,
            tahun_masuk, tahun_lulus, ijazah_file, urutan)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            mentorProfileId,
            p.tingkat,
            p.tingkat_lainnya || null,
            p.jurusan,
            p.universitas,
            p.tahun_masuk || null,
            p.tahun_lulus,
            ijazahFilePath,
            i + 1
          ]
        );
      }

      // 4. Insert sertifikat (multiple)
      for (let i = 0; i < sertifikatData.length; i++) {
        const s = sertifikatData[i];
        // Find corresponding sertifikat file
        const sertifikatFile = files.find(f => f.fieldname === `sertifikat_${i}`);
        const sertifikatFilePath = sertifikatFile ? `/mentor_documents/sertifikat/${sertifikatFile.filename}` : null;

        await connection.query(
          `INSERT INTO mentor_sertifikat
           (mentor_profile_id, nama_sertifikat, penerbit, tahun, file)
           VALUES (?, ?, ?, ?, ?)`,
          [
            mentorProfileId,
            s.nama_sertifikat,
            s.penerbit,
            s.tahun,
            sertifikatFilePath
          ]
        );
      }

      await connection.commit();
      connection.release();

      res.status(201).json({
        message: "Registrasi mentor berhasil! Pendaftaran sedang dalam proses review.",
        userId: userId
      });

    } catch (err) {
      await connection.rollback();
      connection.release();
      throw err;
    }

  } catch (err) {
    console.error("Error registering mentor:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

/* ================= KELAS ================= */

/* ================= KELAS ================= */
router.get("/kelas", verifyToken, async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM kelas WHERE mentor_id=?",
    [req.user.id]
  );
  res.json(rows);
});

router.post("/kelas", verifyToken, async (req, res) => {
  const { judul, deskripsi } = req.body;
  await db.query(
    "INSERT INTO kelas (mentor_id, judul, deskripsi) VALUES (?,?,?)",
    [req.user.id, judul, deskripsi]
  );
  res.json({ success: true });
});

/* ================= MATERI ================= */
router.get("/materi/:kelas_id", verifyToken, async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM materi WHERE kelas_id=?",
    [req.params.kelas_id]
  );
  res.json(rows);
});

router.post("/materi", verifyToken, async (req, res) => {
  const { kelas_id, judul, konten } = req.body;
  await db.query(
    "INSERT INTO materi (kelas_id, judul, konten) VALUES (?,?,?)",
    [kelas_id, judul, konten]
  );
  res.json({ success: true });
});

/* ================= TUGAS ================= */
router.get("/tugas/:kelas_id", verifyToken, async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM tugas WHERE kelas_id=?",
    [req.params.kelas_id]
  );
  res.json(rows);
});

router.post("/tugas", verifyToken, async (req, res) => {
  const { kelas_id, judul, deskripsi, deadline } = req.body;
  await db.query(
    "INSERT INTO tugas (kelas_id, judul, deskripsi, deadline) VALUES (?,?,?,?)",
    [kelas_id, judul, deskripsi, deadline]
  );
  res.json({ success: true });
});

/* ================= PENILAIAN ================= */
router.get("/pengumpulan/:tugas_id", verifyToken, async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM pengumpulan_tugas WHERE tugas_id=?",
    [req.params.tugas_id]
  );
  res.json(rows);
});

router.post("/nilai", verifyToken, async (req, res) => {
  const { id, nilai, feedback } = req.body;
  await db.query(
    "UPDATE pengumpulan_tugas SET nilai=?, feedback=? WHERE id=?",
    [nilai, feedback, id]
  );
  res.json({ success: true });
});

export default router;

