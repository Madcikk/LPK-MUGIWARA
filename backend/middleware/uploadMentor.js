import multer from "multer";
import path from "path";
import fs from "fs";

// Pastikan folder uploads ada
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

// Storage untuk foto profil mentor
const fotoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, mentorFotoDir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `foto-${unique}${path.extname(file.originalname)}`);
  }
});

// Storage untuk ijazah
const ijazahStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, mentorIjazahDir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `ijazah-${unique}${path.extname(file.originalname)}`);
  }
});

// Storage untuk sertifikat
const sertifikatStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, mentorSertifikatDir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `sertifikat-${unique}${path.extname(file.originalname)}`);
  }
});

// File filter
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

// Upload configurations
export const uploadFotoMentor = multer({
  storage: fotoStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: fileFilter
});

export const uploadIjazah = multer({
  storage: ijazahStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter
});

export const uploadSertifikat = multer({
  storage: sertifikatStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter
});

// Upload multiple files untuk ijazah dan sertifikat
export const uploadMultipleIjazah = multer({
  storage: ijazahStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter
}).array("ijazah_files", 10); // Max 10 files

export const uploadMultipleSertifikat = multer({
  storage: sertifikatStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter
}).array("sertifikat_files", 10); // Max 10 files

