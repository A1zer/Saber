import express from "express";
import db from "../db.js";

const router = express.Router();

// Route to get all permissions
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM permissions");
    res.json(rows); // Return all permissions
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to retrieve permissions", error: err.message });
  }
});

export default router;
