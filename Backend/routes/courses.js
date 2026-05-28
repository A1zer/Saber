import express from "express";
import db from "../db.js";
import authMiddleware from "../middleware/auth.js";

import multer from "multer";
import path from "path";
import {trackActivity} from "../services/achievementService.js";

const router = express.Router();

// Nastavení úložiště pro soubory
const storage = multer.diskStorage({
  destination: "./uploads/", // složka, kam se obrázky fyzicky uloží
  filename: (req, file, cb) => {
    // Přejmenuje soubor na unikitání název (např. kurz-17156348.jpg)
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// 2. Nastavení úložiště pro VIDEA lektorů
const videoStorage = multer.diskStorage({
  destination: "./uploads/videos/", // Nezapomeň si tuto složku fyzicky vytvořit v projektu!
  filename: (req, file, cb) => {
    cb(null, "video-" + Date.now() + path.extname(file.originalname));
  },
});

const uploadVideo = multer({
  storage: videoStorage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    // Povolíme standardní video formáty
    if (ext !== ".mp4" && ext !== ".mkv" && ext !== ".mov" && ext !== ".avi") {
      return cb(new Error("Only video files (.mp4, .mkv, .mov, .avi) are allowed!"));
    }
    cb(null, true);
  }
});

const companyName = process.env.COMPANY_NAME || "Saber";

// Route to get all courses
router.get("/", authMiddleware, async (req, res) => {
  const roleId = req.user.roleId;

  let courseTypes = [];

  if (roleId === 1) {
    courseTypes = [1, 2];     // Admin sees all
  } else if (roleId === 2) {
      courseTypes = [1];      // Casual sees public
  } else if (roleId === 3) {
    courseTypes = [1];        // Teacher
  }

  const placeholders = courseTypes.map(() => "?").join(", ");

  // Nahrazen pevný text otazníkem pro dosazení z .env
  const query = `
    SELECT c.id, c.title, c.description, c.image_url, c.is_private, c.creator_user_id, c.course_type_id,
           CASE WHEN u.role_id = 1 THEN ? ELSE u.username END AS author
    FROM courses c
           JOIN users u ON c.creator_user_id = u.id
    WHERE c.course_type_id IN (${placeholders})
  `;

  try {
    // Předáme companyName jako PRVNÍ parametr, protože první otazník v SQL patří jménu firmy
    const [courses] = await db.query(query, [companyName, ...courseTypes]);
    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to retrieve courses", error: err.message });
  }
});

// Nová routa pro Dashboard data
router.get("/dashboard", authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    // 1. SEKCE: Created – dosazujeme proměnnou companyName z .env
    const createdQuery = `
      SELECT c.id, c.title, c.description, c.image_url, c.course_type_id, c.is_private,
             'Author' AS status,
             CASE WHEN u.role_id = 1 THEN ? ELSE u.username END AS author
      FROM courses c JOIN users u ON c.creator_user_id = u.id WHERE c.creator_user_id = ?
    `;
    const [createdCourses] = await db.query(createdQuery, [companyName, userId]);

    // 2. SEKCE: In Progress – dosazujeme proměnnou companyName z .env
    const inProgressQuery = `
      SELECT c.id, c.title, c.description, c.image_url, c.course_type_id,
             CASE WHEN u.role_id = 1 THEN ? ELSE u.username END AS author,
             'In Progress' AS status, 50 AS progress
      FROM course_progress cp
             JOIN courses c ON cp.course_id = c.id
             JOIN users u ON c.creator_user_id = u.id
      WHERE cp.user_id = ? AND cp.progress_state_id = 2
    `;
    const [inProgressCourses] = await db.query(inProgressQuery, [companyName, userId]);

    // 3. SEKCE: Discover / Katalog – dosazujeme proměnnou companyName z .env
    const publicCoursesQuery = `
      SELECT c.id, c.title, c.description, c.image_url, c.course_type_id, c.is_private,
             '' AS status,
             CASE WHEN u.role_id = 1 THEN ? ELSE u.username END AS author
      FROM courses c JOIN users u ON c.creator_user_id = u.id WHERE c.course_type_id = 1
    `;
    const [publicCourses] = await db.query(publicCoursesQuery, [companyName]);

    // 4. NOVÁ SEKCE: Completed (Kurzy, které už uživatel KOMPLETNĚ DOKONČIL - STAV 3)
    const completedQuery = `
      SELECT c.id, c.title, c.description, c.image_url, c.course_type_id,
             CASE WHEN u.role_id = 1 THEN ? ELSE u.username END AS author, 
             'Completed' AS status, 
             100 AS progress 
      FROM course_progress cp
             JOIN courses c ON cp.course_id = c.id
             JOIN users u ON c.creator_user_id = u.id
      WHERE cp.user_id = ? AND cp.progress_state_id = 3 -- ◄── POUZE DOKONČENÉ
    `;
    const [completedCourses] = await db.query(completedQuery, [companyName, userId]);

    res.json({
      created: createdCourses,
      inProgress: inProgressCourses,
      completed: completedCourses,
      all: publicCourses
    });

  } catch (err) {
    console.error("Dashboard DB Error:", err);
    res.status(500).json({ message: "Failed to retrieve dashboard data", error: err.message });
  }
});

// ROUTA PRO VYTVOŘENÍ KURZU (včetně nahraného obrázku)
router.post("/create", authMiddleware, upload.single("image"), async (req, res) => {
  const { title, description, course_type_id } = req.body;
  const creatorUserId = req.user.id;

  // Pokud uživatel nahrál obrázek, sestavíme plnou URL adresu
  let imageUrl = "http://localhost:3000/uploads/default-course.jpg"; // výchozí obrázek
  if (req.file) {
    imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;
  }

  try {
    const query = `
      INSERT INTO courses (title, description, image_url, course_type_id, creator_user_id) 
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(query, [
        title, description, imageUrl, course_type_id, creatorUserId
    ]);

    res.status(201).json({ message: "Course created successfully", courseId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create course", error: err.message });
  }
});

// ROUTA PRO PŘIDÁNÍ LEKCE DO KURZU (Dostupná pouze pro autory kurzu)
router.post("/:id/lessons", authMiddleware, uploadVideo.single("video"), async (req, res) => {
  const courseId = req.params.id;
  const userId = req.user.id;
  const { title, description } = req.body;

  try {
    // BEZPEČNOST: Ověříme, zda je přihlášený uživatel skutečně autorem tohoto kurzu
    const [courseCheck] = await db.query(
        "SELECT creator_user_id FROM courses WHERE id = ?",
        [courseId]
    );

    if (!courseCheck || courseCheck.length === 0) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Pokud není autor ani admin (role 1), vyhodíme chybu 403 Forbidden
    if (courseCheck[0].creator_user_id !== userId && req.user.roleId !== 1) {
      return res.status(403).json({ message: "Forbidden: You are not the author of this course." });
    }

    // Spočítáme automaticky order_index, aby šly lekce pěkně po sobě (1, 2, 3...)
    const [indexCheck] = await db.query(
        "SELECT MAX(order_index) as maxIndex FROM lessons WHERE course_id = ?",
        [courseId]
    );
    const nextIndex = (indexCheck[0].maxIndex || 0) + 1;

    // Sestavíme URL pro video (pokorud ho lektor nahrál, jinak povolíme prázdné pro budoucí texty/kvízy)
    let videoUrl = "";
    if (req.file) {
      videoUrl = `http://localhost:3000/uploads/videos/${req.file.filename}`;
    }

    const query = `
      INSERT INTO lessons (course_id, title, description, video_url, order_index)
      VALUES (?, ?, ?, ?, ?)
    `;
    await db.query(query, [courseId, title, description, videoUrl, nextIndex]);

    res.status(201).json({ message: "Lesson added successfully!" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add lesson", error: err.message });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  const courseId = req.params.id;
  const userId = req.user.id;

  try {
    // 1. Ověříme, zda kurz existuje a kdo je jeho tvůrcem
    const [courseCheck] = await db.query(
        "SELECT creator_user_id FROM courses WHERE id = ?",
        [courseId]
    );

    if (!courseCheck || courseCheck.length === 0) {
      return res.status(404).json({ message: "Course not found" });
    }

    // 2. Bezpečnostní kontrola: Smazat smí pouze autor kurzu nebo Admin (role_id === 1)
    if (courseCheck[0].creator_user_id !== userId && req.user.roleId !== 1) {
      return res.status(403).json({ message: "Forbidden: You are not authorized to delete this course." });
    }

    // 3. Spustíme smazání z databáze
    await db.query("DELETE FROM courses WHERE id = ?", [courseId]);

    // LOGOVÁNÍ AKTIVITY (Smazání kurzu - ID 5)
    // Předáváme ID relace a do detailů ukládáme, který kurz byl smazán
    await trackActivity(userId, 5, req.user.relationId, { course_id: Number(courseId) });

    res.json({ message: "Course deleted successfully." });

  } catch (err) {
    console.error("Error deleting course:", err);
    res.status(500).json({ message: "Failed to delete course", error: err.message });
  }
});

// =========================================================================
//  REST ENDPOINTY PRO SLEDOVÁNÍ AUTOMATICKÉHO POKROKU (Sedí s handleVideoEnded)
// =========================================================================

// 1. PUT - Spustí se automaticky z handleVideoEnded, když video dojede na konec
router.put("/:courseId/lessons/:lessonId/progress", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { courseId, lessonId } = req.params;

  try {
    // Zapíšeme splněnou lekci (IGNORE zabrání chybám při duplicitním dohrání)
    const [insertResult] = await db.query(
        "INSERT IGNORE INTO lesson_progress (user_id, lesson_id, is_completed) VALUES (?, ?, 1)",
        [userId, lessonId]
    );

    let newlyEarnedBadges = [];

    // LOGOVÁNÍ AKTIVITY (Dokončení lekce - ID 6)
    // Pouze pokud INSERT reálně přidal nový řádek (affectedRows > 0),
    // tzn. uživatel tuto lekci dokončil poprvé a nespamuje body znovu dokola.

    if (insertResult.affectedRows > 0) {
      // Zachytíme odznaky z dokončení lekce
      newlyEarnedBadges = await trackActivity(userId, 6, req.user.relationId, { lesson_id: Number(lessonId), course_id: Number(courseId) });
    }

    // Přepočítáme celkovou matematiku kurzu a procenta
    const { totalLessons, completedLessons, percentage, nextProgressStateId } = await updateCourseProgressLogic(userId, courseId);

    // 1. Zkontrolujeme, zda stav kurzu je 3 (Completed)
    if (nextProgressStateId === 3) {

      // 2. POJISTKA: Ověříme, zda uživatel už za tento konkrétní kurz náhodou nedostal log v activity_log.
      // Tím zabráníme, aby se mu odznak připisoval znovu a znovu, když si video pustí podruhé.
      const [duplicateCourseCheck] = await db.query(
          "SELECT id FROM activity_log WHERE user_id = ? AND activity_type_id = 3 AND details LIKE ?",
          [userId, `%${courseId}%`]
      );

      // Pokud ještě záznam o dokončení tohoto kurzu neexistuje, zapíšeme aktivitu a udělíme odznak
      if (duplicateCourseCheck.length === 0) {
        console.log(`[Course Completed] Uživatel ID ${userId} dokončil kurz ID ${courseId}. Uděluji odznak.`);

        const courseBadges = await trackActivity(userId, 3, req.user.relationId, { course_id: Number(courseId) });

        // Bezpečné sloučení polí pomocí .push, které nikdy neselže
        if (courseBadges && courseBadges.length > 0) {
          courseBadges.forEach(badge => newlyEarnedBadges.push(badge));
        }
      }
    }

    // Vrátíme JSON odpověď, ze které si frontend přečte nové percentage
    res.json({
      message: "Lesson marked as completed automatically",
      completedLessons,
      totalLessons,
      percentage,
      statusId: nextProgressStateId,
      newBadges: newlyEarnedBadges
    });
  } catch (err) {
    console.error("Error in PUT lesson progress:", err);
    res.status(500).json({ message: "Failed to update progress", error: err.message });
  }
});

// 2. DELETE - Pokud bys v budoucnu potřeboval pokrok lekce smazat
router.delete("/:courseId/lessons/:lessonId/progress", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { courseId, lessonId } = req.params;

  try {
    // Smažeme pokrok lekce z databáze
    await db.query(
        "DELETE FROM lesson_progress WHERE user_id = ? AND lesson_id = ?",
        [userId, lessonId]
    );

    // Přepočítáme matematiku po smazání
    const { totalLessons, completedLessons, percentage, nextProgressStateId } = await updateCourseProgressLogic(userId, courseId);

    res.json({
      message: "Lesson progress removed",
      completedLessons,
      totalLessons,
      percentage
    });
  } catch (err) {
    console.error("Error in DELETE lesson progress:", err);
    res.status(500).json({ message: "Failed to remove progress", error: err.message });
  }
});

// =========================================================================
//  POMOCNÁ LOGIKA PRO VÝPOČET PROCENT A AKTUALIZACI STAVU KURZU
// =========================================================================
async function updateCourseProgressLogic(userId, courseId) {
  // A) Zjistíme celkový počet lekcí, které tento kurz v databázi má
  const [totalRows] = await db.query(
      "SELECT COUNT(*) as total FROM lessons WHERE course_id = ?",
      [courseId]
  );
  // OPRAVENO: Přidán index [0], aby JavaScript správně přečetl číslo z MySQL odpovědi
  const totalLessons = totalRows[0].total;

  // B) Zjistíme, kolik z nich už má student reálně splněných (is_completed = 1)
  const [completedRows] = await db.query(
      `SELECT COUNT(*) as completed FROM lesson_progress lp
     JOIN lessons l ON lp.lesson_id = l.id
     WHERE lp.user_id = ? AND l.course_id = ? AND lp.is_completed = 1`,
      [userId, courseId]
  );
  // OPRAVENO: Přidán index [0], aby JavaScript správně přečetl číslo z MySQL odpovědi
  const completedLessons = completedRows[0].completed;

  // C) Vyhodnocení celkového stavu kurzu pro tvou tabulku course_progress
  let nextProgressStateId = 1; // 1 = Not Started (výchozí)

  if (completedLessons === totalLessons && totalLessons > 0) {
    nextProgressStateId = 3; // 3 = Completed (Všechna videa dokoukána!)
  } else if (completedLessons > 0) {
    nextProgressStateId = 2; // 2 = In Progress (Kurz je rozdělaný)
  }

  // Zapíšeme nebo aktualizujeme celkový stav kurzu
  await db.query(
      `INSERT INTO course_progress (user_id, course_id, progress_state_id) 
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE progress_state_id = ?`,
      [userId, courseId, nextProgressStateId, nextProgressStateId]
  );

  // Spočítáme reálná procenta pokroku (např. 3 z 10 = 30 %)
  const percentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return { totalLessons, completedLessons, percentage, nextProgressStateId };
}

// Route pro přidání hodnocení ke kurzu (POST - Pouze pro novou recenzi)
router.post("/:id/reviews", authMiddleware, async (req, res) => {
  const courseId = req.params.id;
  const userId = req.user.id;
  const { rating, comment } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Hodnocení musí být číslo mezi 1 a 5." });
  }
  if (!comment || comment.trim() === "") {
    return res.status(400).json({ message: "Komentář nesmí být prázdný." });
  }

  try {
    const [courseRows] = await db.query(
        "SELECT creator_user_id FROM courses WHERE id = ?",
        [courseId]
    );

    if (courseRows.length === 0) {
      return res.status(404).json({ message: "Kurz nebyl nalezen." });
    }

    if (courseRows[0].creator_user_id === userId) {
      return res.status(403).json({ message: "Nemůžeš hodnotit svůj vlastní kurz." });
    }

    const [existingReview] = await db.query(
        "SELECT id FROM course_ratings WHERE course_id = ? AND user_id = ?",
        [courseId, userId]
    );

    if (existingReview.length > 0) {
      return res.status(409).json({ message: "Tento kurz už jsi jednou hodnotil. Použij tlačítko upravit." });
    }

    await db.query(
        "INSERT INTO course_ratings (course_id, user_id, rating, comment, created_at) VALUES (?, ?, ?, ?, NOW())",
        [courseId, userId, rating, comment.trim()]
    );

    const newlyEarnedBadges = await trackActivity(userId, 14, req.user.relationId, { course_id: Number(courseId), rating: rating });

    // Vracíme status 201 a pole s odznaky
    return res.status(201).json({
      message: "Hodnocení úspěšně přidáno.",
      newBadges: newlyEarnedBadges
    });
  } catch (err) {
    console.error("Error in POST review:", err);
    return res.status(500).json({ message: "Selhalo ukládání hodnocení.", error: err.message });
  }
});

// Pouze pro zmeny (PUT - Pouze pro aktualizaci stávající recenze)
router.put("/:id/reviews", authMiddleware, async (req, res) => {
  const courseId = req.params.id;
  const userId = req.user.id;
  const { rating, comment } = req.body;

  try {
    const [result] = await db.query(
        "UPDATE course_ratings SET rating = ?, comment = ?, created_at = NOW() WHERE course_id = ? AND user_id = ?",
        [rating, comment.trim(), courseId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Recenze k úpravě nebyla nalezena." });
    }

    const [duplicateCheck] = await db.query(
        "SELECT id FROM activity_log WHERE user_id = ? AND activity_type_id = 14 AND details LIKE ?",
        [userId, `%${courseId}%`]
    );

    let newlyEarnedBadges = [];
    if (duplicateCheck.length === 0) {
      newlyEarnedBadges = await trackActivity(userId, 14, req.user.relationId, { course_id: Number(courseId), rating: rating });
    }

    return res.json({
      message: "Hodnocení úspěšně upraveno.",
      newBadges: newlyEarnedBadges
    });
  } catch (err) {
    console.error("Error in PUT review:", err);
    return res.status(500).json({ message: "Selhalo upravení hodnocení.", error: err.message });
  }
});

// Route pro smazání konkrétní recenze (DELETE http://localhost:3000/api/courses/:id/reviews/:reviewId)
router.delete("/:id/reviews/:reviewId", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const roleId = req.user.roleId;
  const { reviewId } = req.params; // Správně taháme reviewId z URL

  try {
    // 1. Ověříme, zda recenze existuje a kdo je její autor
    const [reviewCheck] = await db.query(
        "SELECT user_id FROM course_ratings WHERE id = ?",
        [reviewId]
    );

    if (reviewCheck.length === 0) {
      return res.status(404).json({ message: "Review not found." });
    }

    // 2. Kontrola oprávnění: Smazat může pouze ten, kdo ji napsal (index [0]), nebo Admin (role 1)
    if (reviewCheck[0].user_id !== userId && roleId !== 1) {
      return res.status(403).json({ message: "You are not authorized to delete this review." });
    }

    // 3. Smazání konkrétní recenze z databáze
    await db.query("DELETE FROM course_ratings WHERE id = ?", [reviewId]);

    res.json({ message: "Review deleted successfully." });
  } catch (err) {
    console.error("Error in DELETE review:", err);
    res.status(500).json({ message: "Failed to delete review.", error: err.message });
  }
});

// GET - Načtení všech oblíbených kurzů pro přihlášeného uživatele
router.get("/favorites", authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    // Dotaz vytáhne informace o kurzu a spojí je s tabulkou uživatelů, abychom zástupně vypsali jméno autora/firmy
    const query = `
      SELECT c.*,
             CASE WHEN u.role_id = 1 THEN ? ELSE u.username END AS author
      FROM courses c
      JOIN favorite_courses fc ON c.id = fc.course_id
      JOIN users u ON c.creator_user_id = u.id
      WHERE fc.user_id = ?
      ORDER BY fc.created_at DESC
    `;

    const [favorites] = await db.query(query, [companyName, userId]);

    // Vracíme pole oblíbených kurzů
    res.json({ favorites: favorites || [] });
  } catch (err) {
    console.error("Chyba při načítání oblíbených kurzů:", err);
    res.status(500).json({ message: "Failed to retrieve favorite courses", error: err.message });
  }
});

// POST - Přepínání oblíbeného kurzu (Add / Remove)
router.post("/:id/favorite", authMiddleware, async (req, res) => {
  const courseId = req.params.id;
  const userId = req.user.id;

  try {
    // 1. Zkontrolujeme, zda už kurz v oblíbených je
    const [existing] = await db.query(
        "SELECT * FROM favorite_courses WHERE user_id = ? AND course_id = ?",
        [userId, courseId]
    );

    if (existing.length > 0) {
      // Pokud existuje, uživatel chce kurz odebrat
      await db.query(
          "DELETE FROM favorite_courses WHERE user_id = ? AND course_id = ?",
          [userId, courseId]
      );
      return res.json({ isFavorite: false, message: "Removed from favorites" });
    } else {
      // Pokud neexistuje, uživatel chce kurz přidat
      await db.query(
          "INSERT INTO favorite_courses (user_id, course_id) VALUES (?, ?)",
          [userId, courseId]
      );
      return res.json({ isFavorite: true, message: "Added to favorites" });
    }
  } catch (err) {
    console.error("Chyba u oblíbených kurzů:", err);
    res.status(500).json({ message: "Failed to update favorites" });
  }
});

// Route to get a specific course by ID
router.get("/:id", authMiddleware, async (req, res) => {
  const courseId = req.params.id;
  const userId = req.user.id;

  try {
    const courseQuery = `
      SELECT c.*,
             CASE WHEN u.role_id = 1 THEN ? ELSE u.username END AS author,
             IFNULL(cp.progress_state_id, 1) AS progress_state_id,
             (SELECT COUNT(*) FROM favorite_courses WHERE user_id = ? AND course_id = c.id) AS is_favorite
      FROM courses c
             JOIN users u ON c.creator_user_id = u.id
             LEFT JOIN course_progress cp ON c.id = cp.course_id AND cp.user_id = ?
      WHERE c.id = ?
    `;
    // DŮLEŽITÉ: Do pole parametrů jsme přidali userId pro kontrolu oblíbených kurzů
    const [courses] = await db.query(courseQuery, [companyName, userId, userId, courseId]);

    if (courses.length === 0) {
      return res.status(404).json({ message: "Course not found" });
    }
    const course = courses[0];

    // 2. Bezpečné načtení lekcí pro playlist
    const lessonsQuery = `
      SELECT l.id, l.title, l.description, l.video_url, l.order_index,
             CASE WHEN lp.is_completed = 1 THEN 1 ELSE 0 END AS is_completed
      FROM lessons l
             LEFT JOIN lesson_progress lp ON l.id = lp.lesson_id AND lp.user_id = ?
      WHERE l.course_id = ?
      ORDER BY l.order_index ASC
    `;
    const [lessons] = await db.query(lessonsQuery, [userId, courseId]);

    // 3. Načtení recenzí kurzu (s firemním autorem, pokud role_id = 1)
    const ratingsQuery = `
      SELECT cr.id, cr.user_id, cr.rating, cr.comment, cr.created_at,
             CASE WHEN u.role_id = 1 THEN ? ELSE u.username END AS username
      FROM course_ratings cr
             JOIN users u ON cr.user_id = u.id
      WHERE cr.course_id = ?
      ORDER BY cr.created_at DESC
    `;
    const [ratings] = await db.query(ratingsQuery, [companyName, courseId]);

    // Odeslání dat na frontend
    res.json({
      course: course,
      lessons: lessons || [],
      reviews: ratings || []
    });

  } catch (err) {
    console.error("Error retrieving course data:", err);
    res.status(500).json({ message: "Failed to retrieve course data", error: err.message });
  }
});

export default router;
