# 🚀 Micro-learning & Gamified LMS Platform

A modern, full-stack micro-learning platform designed to deliver short, high-impact video courses. The platform features an advanced **Gamification System** with dynamic badge unlocking, alongside an **Audit Trail** network that logs user activity securely linked to active login sessions.

---

## 🛠️ Tech Stack

- **Frontend:** Vue.js 3 (Composition API, `<script setup>`), TypeScript, Vue Router, Pinia, Vanilla CSS
- **Backend:** Node.js, Express.js, JWT Authentication, Multer (File Uploads)
- **Database:** MySQL (Relational schema with cascade integrity and audit log)

---

## ✨ Key Features

- **Dynamic Video Progress:** Automatically marks video lessons as 100% completed immediately when the video finishes (`@ended`).
- **Advanced Gamification:** Evaluates activity logs in real-time and triggers premium Vue `<Transition>` modals with a bounce effect when achievements are unlocked.
- **Session-bound Activity Log:** Tracks platform telemetry (lesson completions, course finishes, reviews) tied securely to specific `relation_id` keys from active logins.
- **Inline Editing (Instructor Mode):** Allows verified instructors and admins to change course metadata (titles, descriptions) on-the-fly via reactive inline text areas without submission buttons.
- **Enterprise Identity Masking:** Automatically replaces administrative usernames (`admin`) with a customizable company name defined via global backend `.env` variables.
- **Hand-picked Favorites:** Saves selected courses into a dedicated grid component, utilizing highly reusable `<CourseSection>` architectures.

---

## 💻 Local Installation & Setup

Follow these steps to run the application locally on your machine.

### 1. Prerequisites
Ensure you have **Node.js** and **MySQL Server** installed and running.

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` or `info.env` file in the root of the `Backend/` directory and configure your variables:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=your_database_name
   JWT_SECRET=your_jwt_secure_secret_key
   COMPANY_NAME=your_company_name
   ```
4. Run the database migration scripts to seed the `achievements` and `achievement_rules` tables.
5. Start the server:
   ```bash
   npm start
   ```

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root of the `Frontend/` directory to configure the Vite compiler fallback link:
   ```env
   VITE_API_URL=http://localhost:3000
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🔑 User Roles for Testing
- **Student Profile:** Default account created upon sign-up. Access to watching videos, liking courses, writing reviews, and earning badges.
- **Instructor / Admin Profile:** Elevated permissions (`role_id = 1` or active `can_create_courses`). Unlocks video uploading capabilities and inline structure manipulation under the `Manage Course` control suite.