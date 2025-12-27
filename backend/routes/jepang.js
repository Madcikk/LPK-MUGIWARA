import express from "express";
import {
  getKapasitasJepang,
  daftarProgramJepang
} from "../controllers/JepangController.js";

const router = express.Router();

// ROUTES
router.get("/jepang/kapasitas", getKapasitasJepang);
router.post("/jepang/daftar", daftarProgramJepang);

export default router;
