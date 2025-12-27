import express from "express";
import * as ctrl from "../controllers/programController.js";
import { verifyToken, requireRole } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", ctrl.getPrograms);
router.get("/:id", ctrl.getProgram);

router.post(
  "/",
  verifyToken,
  requireRole(["admin"]),
  upload.single("image"),
  ctrl.createProgram
);

router.put(
  "/:id",
  verifyToken,
  requireRole(["admin"]),
  upload.single("image"),
  ctrl.updateProgram
);

router.delete(
  "/:id",
  verifyToken,
  requireRole(["admin"]),
  ctrl.deleteProgram
);

export default router;
