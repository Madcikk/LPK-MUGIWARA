import {db} from "../db.js";
import fs from "fs";

export const getPrograms = async (req, res) => {
  const [rows] = await db.query("SELECT * FROM program ORDER BY id DESC");
  res.json(rows);
};

export const getProgram = async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM program WHERE id = ?",
    [req.params.id]
  );
  res.json(rows[0] || null);
};

export const createProgram = async (req, res) => {
  const { title, description } = req.body;
  const image = req.file ? req.file.filename : null;

  const [r] = await pool.query(
    "INSERT INTO program (title, description, image) VALUES (?,?,?)",
    [title, description, image]
  );

  res.json({ id: r.insertId, message: "created" });
};

export const updateProgram = async (req, res) => {
  const { title, description } = req.body;
  let image = req.body.oldImage || null;

  if (req.file) image = req.file.filename;

  await db.query(
    "UPDATE program SET title=?, description=?, image=? WHERE id=?",
    [title, description, image, req.params.id]
  );

  res.json({ message: "updated" });
};

export const deleteProgram = async (req, res) => {
  await db.query("DELETE FROM program WHERE id = ?", [req.params.id]);
  res.json({ message: "deleted" });
};
