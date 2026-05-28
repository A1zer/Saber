import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envFilePath = path.resolve(__dirname, "../.env");
const fallbackEnvPath = path.resolve(__dirname, "../info.env");
const envPath = fs.existsSync(envFilePath) ? envFilePath : fallbackEnvPath;

// DOTENV MUSÍ BÝT PŘED IMPORTY ROUTŮ
dotenv.config({ path: envPath });

import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import rolesRoutes from "./routes/roles.js";
import usersRoutes from "./routes/users.js";
import permissionsRoutes from "./routes/permissions.js";
import coursesRoutes from "./routes/courses.js";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());

app.use(express.json());

// Všechny soubory ve složce 'uploads' budou dostupné na http://localhost:3000/uploads/nazev.jpg
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Middleware pro logování požadavků (uvidíš v terminálu, co se děje)
app.use((req, res, next) => {
  console.log(`${new Date().toLocaleTimeString()} - ${req.method} ${req.url}`);
  next();
});

app.use("/api", authRoutes);
app.use("/api/roles", rolesRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/permissions", permissionsRoutes);
app.use("/api/courses", coursesRoutes);

// Final fallback (API or others)
app.use((req, res, next) => {
  // Pokud se požadavek dostane sem, znamená to, že se neshodoval s žádnou API cestou.
  // Může to být buď neexistující API endpoint, nebo požadavek na frontend,
  // který by měl být obsloužen Vite dev serverem (při vývoji) nebo Nginx/Apache (v produkci).
  res.status(404).json({
    message: `API Endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler (to avoid "Server error" plain text)
app.use((err, req, res, next) => {
  console.error("!!! GLOBAL BACKEND ERROR:", err);
  res.status(500).json({
    message: "Internal Server Error",
    error: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
