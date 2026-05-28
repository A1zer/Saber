import express from "express";
import db from "../db.js";
import bcrypt from "bcryptjs";

import authMiddleware from "../middleware/auth.js";
import checkRole from "../middleware/checkRole.js";
import { validationResult, body } from "express-validator";

const router = express.Router();

// Create Admin Route (protected)
router.post(
  "/create-admin",
  [
    body("username")
      .isLength({ min: 5, max: 45 })
      .withMessage("Username is required and max 45 characters"),
    body("email").isEmail().withMessage("Please enter a valid email address"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    authMiddleware,
    checkRole("admin"),
  ],
  async (req, res) => {
    const { username, email, password } = req.body;

    try {
      const [existingUser] = await db.query(
        "SELECT id FROM users WHERE email = ?",
        [email],
      );

      if (existingUser.length > 0) {
        return res.status(409).json({ message: "Email already registered" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const roleId = 1; // Admin role

      await db.query(
        "INSERT INTO users (username, email, password_hash, role_id) VALUES (?, ?, ?, ?)",
        [username, email, hashedPassword, roleId],
      );

      res.status(201).json({ message: "Admin user created successfully" });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "Failed to create admin user", error: err.message });
    }
  },
);

// Logged User Info (Protected)
router.get("/me", authMiddleware, async (req, res) => {
  // BEST PRACTICE: Sjednocené a konzistentní ID uživatele z middleware (req.user.id)
  const userId = req.user.id || req.user.userId;

  try {
    const [rows] = await db.query(
        "SELECT id, username, email, role_id FROM users WHERE id = ?",
        [userId]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // BEST PRACTICE: Vracíme čistý objekt s konkrétními daty (nikdy neposíláme heslo!)
    const user = rows[0];


    const [permRows] = await db.query(
        "SELECT * FROM role_permissions WHERE role_id = ? AND permission_id IN (1, 3)",
        [user.role_id]
    );

    // Pokud databáze našla záznam, uživatel má právo vytvářet kurzy
    const canCreateCourses = permRows.length > 0;

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      roleId: user.role_id,
      canCreateCourses: canCreateCourses
    });

  } catch (err) {
    console.error("Error in /me endpoint:", err);
    res.status(500).json({
      message: "Failed to retrieve user info",
      error: err.message
    });
  }
});

// GET - Načtení všech odznaků (splněných i nesplněných) pro aktuálně přihlášeného uživatele
router.get("/me/achievements", authMiddleware, async (req, res) => {
  const userId = req.user.id; // ID získáme bezpečně z dekódovaného tokenu v authMiddlewaru

  try {
    const query = `
      SELECT
        a.id,
        a.name,
        a.description,
        a.image_url,
        ua.date_earned,
        IF(ua.achievement_id IS NOT NULL, 1, 0) AS is_earned
      FROM achievements a
             LEFT JOIN user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = ?
      ORDER BY a.id ASC
    `;

    const [badges] = await db.query(query, [userId]);

    // Vracíme objekt s klíčem "badges", přesně tak, jak to očekává váš frontend: data.badges
    res.json({ badges });
  } catch (err) {
    console.error("Chyba při načítání odznaků z DB:", err);
    res.status(500).json({ message: "Failed to retrieve achievements data", error: err.message });
  }
});

// Route to get all users
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM users");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to retrieve users", error: err.message });
  }
});

// Route to get a specific user by ID
router.get("/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [userId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(rows[0]); // Return the specific user
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
