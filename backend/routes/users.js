import express from "express";
import { db } from "../db.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

console.log("Users router initialized");

// Debug: log semua request ke router ini
router.use((req, res, next) => {
  console.log(`[Users Router] ${req.method} ${req.path}`);
  next();
});

// Test endpoint tanpa auth untuk debugging
router.get("/test", (req, res) => {
  console.log("GET /api/users/test called");
  res.json({ message: "Users route is working!" });
});

// GET semua users (kecuali admin)
router.get("/", verifyToken, async (req, res) => {
  try {
    console.log("=== GET /api/users ===");
    console.log("User making request:", req.user);
    console.log("User role:", req.user.role);
    
    // Hanya admin yang bisa akses
    if (req.user.role !== "admin") {
      console.log("Access denied - user role:", req.user.role);
      return res.status(403).json({ error: "Akses ditolak" });
    }

    // Ambil semua users dari database termasuk status
    const [allUsers] = await db.query(
      `SELECT id, name, email, role, status, created_at FROM users ORDER BY created_at DESC`
    );
    
    console.log("Total users in database:", allUsers.length);
    console.log("All users from DB:", JSON.stringify(allUsers, null, 2));
    
    if (allUsers.length === 0) {
      console.log("WARNING: No users found in database!");
      return res.json([]);
    }
    
    // Filter out admin di JavaScript untuk memastikan
    const rows = allUsers.filter(user => {
      const role = user.role ? user.role.toLowerCase().trim() : null;
      const isNotAdmin = role !== "admin";
      console.log(`User ${user.id} (${user.name}): role="${role}", isNotAdmin=${isNotAdmin}`);
      return isNotAdmin;
    });
    
    console.log("Users after filtering (excluding admin):", rows.length);
    console.log("Filtered users data:", JSON.stringify(rows, null, 2));

    if (rows.length === 0) {
      console.log("WARNING: All users are admin or no non-admin users found!");
    }

    res.json(rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    console.error("Error stack:", err.stack);
    res.status(500).json({ error: "Gagal mengambil data users", details: err.message });
  }
});

// PUT /api/users/:id/status - Update user status (approve/reject mentor)
router.put("/:id/status", verifyToken, async (req, res) => {
  try {
    console.log("=== PUT /api/users/:id/status ===");
    console.log("User making request:", req.user);
    console.log("User role:", req.user.role);
    
    // Hanya admin yang bisa akses
    if (req.user.role !== "admin") {
      console.log("Access denied - user role:", req.user.role);
      return res.status(403).json({ error: "Akses ditolak" });
    }

    const { id } = req.params;
    const { status, reason } = req.body;

    // Validasi status
    const validStatuses = ['active', 'inactive', 'pending_approval', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Status tidak valid" });
    }

    // Cek apakah user ada
    const [userCheck] = await db.query(
      "SELECT id, name, email, role, status FROM users WHERE id = ?",
      [id]
    );

    if (userCheck.length === 0) {
      return res.status(404).json({ error: "User tidak ditemukan" });
    }

    const user = userCheck[0];

    // Jika menyetujui mentor, pastikan role adalah mentor
    if (status === 'active' && user.role !== 'mentor') {
      return res.status(400).json({ error: "Hanya mentor yang bisa disetujui" });
    }

    // Update status user
    await db.query(
      "UPDATE users SET status = ? WHERE id = ?",
      [status, id]
    );

    // Jika menolak mentor, log alasan penolakan (opsional)
    if (status === 'rejected' && reason) {
      console.log(`Mentor ${user.name} (${user.email}) rejected. Reason: ${reason}`);
    }

    console.log(`User ${user.name} status updated to: ${status}`);

    res.json({
      message: "Status user berhasil diupdate",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: status
      }
    });

  } catch (err) {
    console.error("Error updating user status:", err);
    res.status(500).json({ error: "Gagal mengupdate status user", details: err.message });
  }
});

// GET /api/users/:id/detail - Get detailed user info including mentor profile
router.get("/:id/detail", verifyToken, async (req, res) => {
  try {
    console.log("=== GET /api/users/:id/detail ===");
    console.log("User making request:", req.user);
    
    // Hanya admin yang bisa akses
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Akses ditolak" });
    }

    const { id } = req.params;

    // Ambil data user
    const [userData] = await db.query(
      "SELECT id, name, email, role, status, phone, foto, created_at FROM users WHERE id = ?",
      [id]
    );

    if (userData.length === 0) {
      return res.status(404).json({ error: "User tidak ditemukan" });
    }

    const user = userData[0];
    let mentorProfile = null;

    // Jika user adalah mentor, ambil data profil mentor
    if (user.role === 'mentor') {
      const [mentorData] = await db.query(
        "SELECT * FROM mentor_profiles WHERE user_id = ?",
        [id]
      );

      if (mentorData.length > 0) {
        mentorProfile = mentorData[0];
        
        // Parse JSON fields
        try {
          mentorProfile.bahasa_ajar = JSON.parse(mentorProfile.bahasa_ajar || '[]');
          mentorProfile.pendidikan = JSON.parse(mentorProfile.pendidikan || '[]');
          mentorProfile.sertifikat = JSON.parse(mentorProfile.sertifikat || '[]');
        } catch (e) {
          console.error("Error parsing mentor profile JSON:", e);
        }
      }
    }

    res.json({
      user: user,
      mentorProfile: mentorProfile
    });

  } catch (err) {
    console.error("Error fetching user detail:", err);
    res.status(500).json({ error: "Gagal mengambil detail user", details: err.message });
  }
});

export default router;

