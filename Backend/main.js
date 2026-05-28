// import "dotenv/config";
// import express from "express";
// import mysql from "mysql2/promise";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import path from "path";
// import { fileURLToPath } from "url";

// // Simulace __dirname pro ES moduly
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();
// app.use(express.json()); // DŮLEŽITÉ: Povolí čtení JSON z frontendu

// // Připojení k MySQL databázi
// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   port: Number(process.env.DB_PORT) || 3306,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });

// // API ENDPOINT PRO PŘIHLÁŠENÍ
// app.post("/api/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ message: "Zadejte email a heslo" });
//     }

//     // 1. Hledání uživatele v databázi
//     const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [
//       email,
//     ]);

//     if (rows.length === 0) {
//       return res.status(401).json({ message: "Nesprávný e-mail nebo heslo" });
//     }

//     const user = rows[0];

//     // 2. Ověření hesla pomocí bcrypt
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ message: "Nesprávný e-mail nebo heslo" });
//     }

//     // 3. Vygenerování JWT tokenu při úspěchu
//     const token = jwt.sign(
//       { id: user.id, email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" },
//     );

//     // 4. Odeslání čistého JSONu zpět do Vue
//     return res.status(200).json({
//       token,
//       username: user.username,
//     });
//   } catch (error) {
//     // Tady se chyba vytiskne VÁM do terminálu WebStormu
//     console.error("CRITICAL BACKEND ERROR:", error);

//     // Frontend dostane JSON, takže už NEBUDE hlásit "Unexpected token S"
//     return res
//       .status(500)
//       .json({ message: "Interní chyba serveru při komunikaci s DB" });
//   }
// });

// // SPA Fallback pro Express 5 (opraveno /*catchall)
// app.get("/*catchall", (req, res, next) => {
//   if (req.path.startsWith("/api")) return next();
//   res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () =>
//   console.log(`🚀 Backend úspěšně běží na http://localhost:${PORT}`),
// );
