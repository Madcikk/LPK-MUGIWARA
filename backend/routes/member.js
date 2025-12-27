import express from "express";
import upload from "../middleware/upload.js";
import { db } from "../db.js";
import bcrypt from "bcryptjs";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* ===========================================================
   STEP 1 - DATA DIRI
=========================================================== */
router.post("/step1", async (req, res) => {
  try {
  const data = req.body;
    console.log("Step 1: Menerima data", data);

    // Hitung umur dari tanggal lahir jika tidak ada
    let umur = data.umur || '';
    if (!umur && data.tanggal_lahir) {
      const tanggalLahir = new Date(data.tanggal_lahir);
      const today = new Date();
      const yearDiff = today.getFullYear() - tanggalLahir.getFullYear();
      const monthDiff = today.getMonth() - tanggalLahir.getMonth();
      umur = (monthDiff < 0 || (monthDiff === 0 && today.getDate() < tanggalLahir.getDate())) 
        ? (yearDiff - 1).toString() 
        : yearDiff.toString();
    }

  const sql = `
    INSERT INTO member_data_diri
    (nama, umur, gender, status, kewarganegaraan, tempat_lahir, tanggal_lahir,
     alamat_rumah, no_hp, tujuan, gol_darah, hobi, agama)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

    const [result] = await db.query(
    sql,
    [
        data.nama, umur || '', data.gender, data.status, data.kewarganegaraan,
      data.tempat_lahir, data.tanggal_lahir, data.alamat_rumah, data.no_hp,
        data.tujuan, data.gol_darah, data.hobi || '', data.agama
      ]
    );

    console.log("Step 1: Berhasil menyimpan, member_id:", result.insertId);
      res.json({ message: "Step 1 berhasil", member_id: result.insertId });
  } catch (err) {
    console.error("Step 1 Error:", err);
    res.status(500).json({ error: err.message });
    }
});


/* ===========================================================
   STEP 2 - RIWAYAT PENDIDIKAN
=========================================================== */
router.post("/step2", async (req, res) => {
  try {
  const {
    member_id,
    nama_smp,
    tahun_masuk_smp,
    tahun_lulus_smp,
    nama_sma_smk,
    tahun_masuk_sma_smk,
    tahun_lulus_sma_smk
  } = req.body;

    console.log("Step 2: Menerima data", req.body);

    if (!member_id) {
      return res.status(400).json({ error: "member_id diperlukan" });
    }

  const sql = `
    INSERT INTO member_riwayat_pendidikan
    (member_id, nama_smp, tahun_masuk_smp, tahun_lulus_smp,
     nama_sma_smk, tahun_masuk_sma_smk, tahun_lulus_sma_smk)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

    const [result] = await db.query(
    sql,
    [
      member_id,
        nama_smp || null,
        tahun_masuk_smp || null,
        tahun_lulus_smp || null,
        nama_sma_smk || null,
        tahun_masuk_sma_smk || null,
        tahun_lulus_sma_smk || null
      ]
    );

    console.log("Step 2: Berhasil menyimpan", result);
    res.json({ message: "Step 2 berhasil", member_id });
  } catch (err) {
    console.error("Step 2 Error:", err);
    res.status(500).json({ error: err.message });
  }
});


/* ===========================================================
   STEP 3 - RIWAYAT PEKERJAAN
=========================================================== */
router.post("/step3", (req, res) => {
  const {
    member_id,
    perusahaan,
    posisi,
    tahun_masuk_kerja,
    tahun_selesai_kerja
  } = req.body;

  const sql = `
    INSERT INTO member_riwayat_pekerjaan
    (member_id, perusahaan, posisi, tahun_masuk_kerja, tahun_selesai_kerja)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      member_id,
      perusahaan,
      posisi,
      tahun_masuk_kerja,
      tahun_selesai_kerja
    ],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Step 3 berhasil" });
    }
  );
});


/* ===========================================================
   STEP 4 - UPLOAD FOTO
=========================================================== */
router.post("/step4", upload.single("foto"), (req, res) => {
  const { member_id } = req.body;
  const foto = req.file?.filename;

  if (!foto) return res.status(400).json({ error: "Foto wajib diupload" });

  const sql = `
    INSERT INTO member_foto (member_id, foto)
    VALUES (?, ?)
  `;

  db.query(sql, [member_id, foto], (err) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json({
      message: "Upload foto berhasil",
      file: foto
    });
  });
});


/* ===========================================================
   STEP 5 - FINAL KIRIM DATA & CREATE USER ACCOUNT (dari Step 3 Login)
=========================================================== */
router.post("/step5", async (req, res) => {
  const { member_id, email, password } = req.body;

  try {
    // Validasi input
    if (!email || !password) {
      return res.status(400).json({ error: "Email dan password wajib diisi" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password minimal 6 karakter" });
    }

    // 1. Cek apakah email sudah digunakan
    const [existingUsers] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: "Email sudah terdaftar. Silakan gunakan email lain." });
    }

    // 2. Ambil data member
    const [memberRows] = await db.query(
      "SELECT nama FROM member_data_diri WHERE member_id = ?",
      [member_id]
    );

    if (memberRows.length === 0) {
      return res.status(404).json({ error: "Member tidak ditemukan" });
    }

    const member = memberRows[0];

    // 3. Update email di member_data_diri jika berbeda
    await db.query(
      "UPDATE member_data_diri SET email = ? WHERE member_id = ?",
      [email, member_id]
    );

    // 4. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6. Insert ke tabel users (tanpa member_id karena kolom tidak ada)
    const [userResult] = await db.query(
      `INSERT INTO users (name, email, password, role)
       VALUES (?, ?, ?, 'member')`,
      [member.nama, email, hashedPassword]
    );
    
    res.json({ 
      message: "Pendaftaran selesai dan akun user berhasil dibuat",
      member_id,
      user_id: userResult.insertId,
      email: email
    });

  } catch (err) {
    console.error("Error in step5:", err);
    return res.status(500).json({ error: err.message });
  }
});


/* ===========================================================
   GET MEMBER PROFILE (by user email from token)
=========================================================== */
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const userEmail = req.user.email;
    console.log("Fetching profile for email:", userEmail);

    // Ambil data user (tanpa member_id karena kolom tidak ada)
    const [userRows] = await db.query(
      "SELECT id, email, name FROM users WHERE email = ?",
      [userEmail]
    );

    if (userRows.length === 0) {
      console.log("User not found for email:", userEmail);
      return res.status(404).json({ error: "User tidak ditemukan" });
    }

    const user = userRows[0];
    console.log("User found:", user);

    // Cari member_id dari member_data_diri berdasarkan email
    let memberData = null;
    let member_id = null;
    let foto = null;

    try {
      const [memberRows] = await db.query(
        "SELECT * FROM member_data_diri WHERE email = ? LIMIT 1",
        [userEmail]
      );

      if (memberRows.length > 0) {
        memberData = memberRows[0];
        member_id = memberData.member_id;
        console.log("Member data found, member_id:", member_id);
        
        // Ambil foto dari member_foto jika member_id ada
        if (member_id) {
          try {
            const [fotoRows] = await db.query(
              "SELECT foto FROM member_foto WHERE member_id = ? ORDER BY foto_id DESC LIMIT 1",
              [member_id]
            );
            
            foto = fotoRows.length > 0 ? fotoRows[0].foto : null;
            console.log("Foto found in member_foto:", foto);
          } catch (fotoErr) {
            console.error("Error fetching foto from member_foto:", fotoErr.message);
            // Coba ambil dari member_data_diri sebagai fallback
            try {
              const [fotoRowsFallback] = await db.query(
                "SELECT foto FROM member_data_diri WHERE member_id = ? LIMIT 1",
                [member_id]
              );
              foto = fotoRowsFallback.length > 0 && fotoRowsFallback[0].foto ? fotoRowsFallback[0].foto : null;
              console.log("Foto found in member_data_diri (fallback):", foto);
            } catch (fallbackErr) {
              console.error("Error fetching foto from member_data_diri:", fallbackErr.message);
              // Foto tidak wajib, lanjutkan tanpa foto
              foto = null;
            }
          }
        }
      } else {
        console.log("No member_data_diri found for email:", userEmail);
      }
    } catch (memberErr) {
      console.error("Error fetching member_data_diri:", memberErr);
      // Jika error, tetap return data user saja
    }

    // Jika ada data member, return data lengkap
    if (memberData && member_id) {
      return res.json({
        id: user.id,
        email: user.email,
        name: memberData.nama || user.name,
        member_id: member_id,
        foto: foto,
        nama: memberData.nama || user.name,
        no_hp: memberData.no_hp || "",
        alamat_rumah: memberData.alamat_rumah || "",
        ...memberData
      });
    }

    // Jika tidak ada data di member_data_diri, return data user saja
    return res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      member_id: null,
      foto: null,
      nama: user.name,
      no_hp: "",
      alamat_rumah: ""
    });

  } catch (err) {
    console.error("Error in /profile:", err);
    console.error("Error stack:", err.stack);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

/* ===========================================================
   UPDATE MEMBER PROFILE
=========================================================== */
router.put("/update-profile", verifyToken, upload.single("foto"), async (req, res) => {
  try {
    const userId = req.user.id;
    // Ambil nilai dari body, trim whitespace, dan hanya ambil jika tidak kosong
    const nama = req.body.nama?.trim() || null;
    const email = req.body.email?.trim() || null;
    const no_hp = req.body.no_hp?.trim() || null;
    const alamat_rumah = req.body.alamat_rumah?.trim() || null;
    const foto = req.file ? req.file.filename : null;

    console.log("Update profile:", { userId, nama, email, no_hp, alamat_rumah, foto });

    // Validasi: minimal harus ada 1 field yang diubah
    if (!nama && !email && !no_hp && !alamat_rumah && !foto) {
      return res.status(400).json({ error: "Minimal harus ada satu field yang diubah" });
    }

    // Validasi format email jika diisi
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Format email tidak valid" });
    }

    // Update users table
    if (nama || email) {
      const updateUserFields = [];
      const updateUserValues = [];
      
      if (nama) {
        updateUserFields.push("name = ?");
        updateUserValues.push(nama);
      }
      if (email) {
        updateUserFields.push("email = ?");
        updateUserValues.push(email);
      }
      
      if (updateUserFields.length > 0) {
        updateUserValues.push(userId);
        await db.query(
          `UPDATE users SET ${updateUserFields.join(", ")} WHERE id = ?`,
          updateUserValues
        );
      }
    }

    // Get email from users table untuk mencari member_id
    let member_id = null;
    
    try {
      // Ambil email dari users table (bisa berubah jika user update email)
      const currentEmail = email || null;
      
      // Jika email di-update, gunakan email baru, jika tidak gunakan email dari database
      let userEmail = currentEmail;
      
      if (!userEmail) {
        const [userRows] = await db.query(
          "SELECT email FROM users WHERE id = ?",
          [userId]
        );
        if (userRows.length > 0) {
          userEmail = userRows[0].email;
        }
      }
      
      console.log("🔍 Searching member_id for email:", userEmail);
      
      if (userEmail) {
        // Cari member_id dari member_data_diri berdasarkan email
        try {
          const [memberRows] = await db.query(
            "SELECT member_id FROM member_data_diri WHERE email = ? LIMIT 1",
            [userEmail]
          );
          
          if (memberRows.length > 0) {
            member_id = memberRows[0].member_id;
            console.log("✅ Member ID found:", member_id);
          } else {
            console.warn("⚠️  No member_data_diri found for email:", userEmail);
            console.warn("   Foto akan tersimpan di folder uploads tapi tidak terhubung ke database.");
          }
        } catch (memberErr) {
          console.error("❌ Error fetching member_id:", memberErr.message);
          // Lanjutkan tanpa member_id
        }
      } else {
        console.warn("⚠️  User email tidak ditemukan, tidak bisa mencari member_id");
      }
    } catch (userErr) {
      console.error("❌ Error fetching user email:", userErr.message);
      // Lanjutkan tanpa member_id
    }

    if (member_id) {
      // Update member_data_diri table
      const updateMemberFields = [];
      const updateMemberValues = [];
      
      // Hanya update field yang memiliki nilai (tidak null dan tidak kosong)
      if (nama && nama.trim() !== "") {
        updateMemberFields.push("nama = ?");
        updateMemberValues.push(nama.trim());
      }
      if (email && email.trim() !== "") {
        updateMemberFields.push("email = ?");
        updateMemberValues.push(email.trim());
      }
      if (no_hp && no_hp.trim() !== "") {
        updateMemberFields.push("no_hp = ?");
        updateMemberValues.push(no_hp.trim());
      }
      if (alamat_rumah && alamat_rumah.trim() !== "") {
        updateMemberFields.push("alamat_rumah = ?");
        updateMemberValues.push(alamat_rumah.trim());
      }
      
      if (updateMemberFields.length > 0) {
        updateMemberValues.push(member_id);
        await db.query(
          `UPDATE member_data_diri SET ${updateMemberFields.join(", ")} WHERE member_id = ?`,
          updateMemberValues
        );
      }

      // Update foto if provided
      if (foto) {
        console.log(`📸 Processing foto upload: ${foto} for member_id: ${member_id}`);
        
        if (!member_id) {
          console.warn("⚠️  Member ID tidak ditemukan. Foto akan tersimpan di folder uploads tapi tidak terhubung ke database.");
          console.warn("   Pastikan user memiliki data di member_data_diri dengan email yang sesuai.");
        } else {
          try {
          // Cek apakah tabel member_foto ada, jika tidak ada buat dulu
          try {
            await db.query("SELECT 1 FROM member_foto LIMIT 1");
          } catch (tableCheckErr) {
            if (tableCheckErr.message.includes("doesn't exist") || tableCheckErr.message.includes("Table")) {
              console.log("📝 Tabel member_foto tidak ada, membuat tabel...");
              // Buat tabel member_foto
              await db.query(`
                CREATE TABLE IF NOT EXISTS \`member_foto\` (
                  \`foto_id\` INT AUTO_INCREMENT PRIMARY KEY,
                  \`member_id\` INT NOT NULL,
                  \`foto\` VARCHAR(255) NOT NULL,
                  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                  INDEX \`idx_member_id\` (\`member_id\`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
              `);
              console.log("✅ Tabel member_foto berhasil dibuat!");
            }
          }
          
          // Check if foto already exists in member_foto
          const [existingFoto] = await db.query(
            "SELECT foto_id FROM member_foto WHERE member_id = ?",
            [member_id]
          );

          if (existingFoto.length > 0) {
            // Update existing foto
            await db.query(
              "UPDATE member_foto SET foto = ? WHERE member_id = ?",
              [foto, member_id]
            );
            console.log(`✅ Foto updated in member_foto table for member_id: ${member_id}`);
          } else {
            // Insert new foto
            await db.query(
              "INSERT INTO member_foto (member_id, foto) VALUES (?, ?)",
              [member_id, foto]
            );
            console.log(`✅ Foto inserted into member_foto table for member_id: ${member_id}, filename: ${foto}`);
          }
          } catch (fotoErr) {
            console.error("❌ Error with member_foto table:", fotoErr.message);
            console.error("Error stack:", fotoErr.stack);
            
            // Coba buat tabel lagi jika error
            if (fotoErr.message.includes("doesn't exist") || fotoErr.message.includes("Table")) {
              try {
                console.log("🔄 Mencoba membuat tabel member_foto lagi...");
                await db.query(`
                  CREATE TABLE IF NOT EXISTS \`member_foto\` (
                    \`foto_id\` INT AUTO_INCREMENT PRIMARY KEY,
                    \`member_id\` INT NOT NULL,
                    \`foto\` VARCHAR(255) NOT NULL,
                    \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    INDEX \`idx_member_id\` (\`member_id\`)
                  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                `);
                
                // Coba insert lagi setelah tabel dibuat
                await db.query(
                  "INSERT INTO member_foto (member_id, foto) VALUES (?, ?)",
                  [member_id, foto]
                );
                console.log(`✅ Foto berhasil disimpan setelah membuat tabel!`);
              } catch (retryErr) {
                console.error("❌ Gagal membuat tabel atau menyimpan foto:", retryErr.message);
                console.warn("⚠️  Foto sudah tersimpan di folder uploads, tapi tidak terhubung ke database.");
              }
            }
          }
        }
      }
    } else {
      // Jika tidak ada member_id, tetap bisa update users table
      console.log("Warning: User tidak memiliki member_id, hanya update users table");
    }

    res.json({ 
      message: "Profile berhasil diperbarui",
      foto: foto || null
    });

  } catch (err) {
    console.error("Error updating profile:", err);
    console.error("Error stack:", err.stack);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

/* ===========================================================
   CHECK USERS TABLE STRUCTURE
=========================================================== */
router.get("/check-users-table", async (req, res) => {
  try {
    const [rows] = await db.query("DESCRIBE users");
    res.json({ 
      message: "Struktur tabel users",
      columns: rows 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
