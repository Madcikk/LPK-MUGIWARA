// routes/berita.js
import express from "express";
import upload from "../middleware/upload.js";
import { verifyToken, requireRole } from "../middleware/auth.js";

import {
  getBerita,
  getBeritaById,
  addBerita,
  updateBerita,
  deleteBerita,
} from "../controllers/beritaController.js";

const router = express.Router();

// GET ALL BERITA
router.get("/", getBerita);

// GET SINGLE BERITA BY ID
router.get("/:id", getBeritaById);

// POST / CREATE BERITA
router.post(
  "/",
  verifyToken,
  requireRole(["admin"]),
  upload.single("image"),
  addBerita
);

// UPDATE BERITA
router.put(
  "/:id",
  verifyToken,
  requireRole(["admin"]),
  upload.single("image"),
  updateBerita
);

// DELETE BERITA
router.delete(
  "/:id",
  verifyToken,
  requireRole(["admin"]),
  deleteBerita
);

export default router;
