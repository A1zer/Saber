import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import express from "express";
import db from "../db.js";
import { validationResult, body } from "express-validator";

const router = express.Router();

// Diagnostic endpoint to test DB connection
router.get("/test-connection", async (req, res) => {
  try {
    const [result] = await db.query("SELECT 1 as connection_test");
    res.json({
      status: "Database connection successful",
      result,
    });
  } catch (err) {
    console.error("DB Connection Test Failed:", err);
    res.status(500).json({
      status: "Database connection FAILED",
      error: err.message,
    });
  }
});

// Diagnostic endpoint to test env variables
router.get("/test-config", (req, res) => {
  res.json({
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD ? "***SET***" : "MISSING",
    DB_NAME: process.env.DB_NAME,
    JWT_SECRET: process.env.JWT_SECRET ? "***SET***" : "MISSING",
  });
});

// Helper funkce pro vytvoření relace (sezení) pro uživatele
async function createLoginRelation(userId) {
  // 1. Zjistíme ID z tabulky authentication pro tohoto uživatele
  let [authRows] = await db.query("SELECT id FROM authentication WHERE user_id = ?", [userId]);

  let authId;
  if (authRows.length === 0) {
    // Vkládáme metodu 'local' a aktuální čas
    const [authInsert] = await db.query(
        "INSERT INTO authentication (user_id, method, created_at) VALUES (?, ?, NOW())",
        [userId, 'local']
    );
    authId = authInsert.insertId;
  } else {
    authId = authRows[0].id;
  }

  // 2. Vytvoříme novou aktivní přihlašovací relaci
  // Přidali jsme created_at a prázdný JSON objekt '{}' do details, aby sloupec nebyl prázdný
  const [relationInsert] = await db.query(
      "INSERT INTO relation (authentication_id, details, created_at) VALUES (?, ?, NOW())",
      [authId, '{}']
  );

  return relationInsert.insertId; // Vrací unikátní relation_id pro JWT
}

// Signup Route
router.post(
  "/signup",
  [
    body("username")
      .isLength({ min: 5, max: 45 })
      .withMessage("Username is required and max 45 characters"),
    body("email").isEmail().withMessage("Please enter a valid email address"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation errors:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;
    console.log("Signup process started for:", email);

    try {
      // Check if user already exists
      const [existingUser] = await db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
      );
      console.log("DB check finished, found:", existingUser.length);
      if (existingUser.length > 0) {
        return res.status(409).json({ message: "Email already in use" });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const defaultRoleId = 2;

      if (!process.env.JWT_SECRET) {
        console.error("FATAL: JWT_SECRET is missing!");
        throw new Error("Server configuration error (JWT)");
      }

      // Insert new user into the database
      const [result] = await db.query(
        "INSERT INTO users (username, email, password_hash, role_id) VALUES (?, ?, ?, ?)",
        [username, email, hashedPassword, defaultRoleId],
      );
      console.log("User inserted, ID:", result.insertId);

      const newUserId = result.insertId;

      // =========================================================================
      // NOVÉ: Vytvoření relace pro nově registrovaného a přihlášeného uživatele
      // =========================================================================
      const relationId = await createLoginRelation(newUserId);

      // Respond with success
      // Create JWT token for the newly created user
      const token = jwt.sign(
        {
          userId: result.insertId,
          email,
          roleId: defaultRoleId,
          relationId: relationId,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" },
      );

      // Respond with success and token
      res.status(201).json({
        message: "User created successfully",
        userId: result.insertId,
        token,
        username,
      });
      console.log("Signup successful response sent");
    } catch (err) {
      console.error(err);
      // Zde by chyba mohla být např. duplicitní email, i když už je kontrolován výše
      // nebo problém s připojením k DB při INSERTu
      console.error("!!! SIGNUP ROUTE ERROR:", err);
      res.status(500).json({
        message: "Registration failed due to server error",
        error: err.message,
      });
    }
  },
);

// Login Route
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // 1. Spustíme dotaz do DB
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    // 2. Bezpečná kontrola: Pokud rows neexistuje, nebo je pole prázdné
    if (!rows || rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Vytáhneme si prvního nalezeného uživatele z pole rows
    const foundUser = rows[0];

    // 3. Kontrola hesla (Ujistěte se, že se sloupec v MySQL jmenuje přesně password_hash !)
    const isMatch = await bcrypt.compare(password, foundUser.password_hash);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // =========================================================================
    // NOVÉ: Generování nové relace při každém úspěšném přihlášení uživatele
    // =========================================================================
    const relationId = await createLoginRelation(foundUser.id);

    // 4. Vytvoření JWT tokenu (Používáme ID a data z nalezeného uživatele)
    const token = jwt.sign(
      {
        userId: foundUser.id,
        email: foundUser.email,
        roleId: foundUser.role_id,
        relationId: relationId,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    // 5. Odeslání čistého JSON zpět do Vue
    return res.json({
      message: "Login successful",
      token,
      username: foundUser.username,
    });
  } catch (err) {
    console.error("LOGIN ROUTE CRASHED:", err);
    // Předá chybu do vašeho hlavního serveru, který ji vypíše do konzole ve WebStormu
    next(err);
  }
});

export default router;
