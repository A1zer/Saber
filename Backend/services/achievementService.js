import db from '../db.js';

/**
 * Zaznamená aktivitu uživatele a zkontroluje, zda nezískal nový odznak.
 * @param {number} userId - ID přihlášeného uživatele
 * @param {number} activityTypeId - ID aktivity z vaší tabulky (např. 6 pro lekci)
 * @param {number} relationId - ID aktuální přihlašovací relace (sezení)
 * @param {object|null} extraDetails - Dodatečná data (např. { lesson_id: 12 })
 */
export async function trackActivity(userId, activityTypeId, relationId, extraDetails = null) {
    try {
        // Převod objektu na textový řetězec JSON pro MySQL
        const detailsJson = extraDetails ? JSON.stringify(extraDetails) : null;

        // 1. Uložit aktivitu do vašeho activity_log (včetně relation_id a details)
        await db.query(
            'INSERT INTO activity_log (user_id, activity_type_id, relation_id, details, timestamp) VALUES (?, ?, ?, ?, NOW())',
            [userId, activityTypeId, relationId, detailsJson]
        );

        // 2. Spočítat, kolikrát uživatel tuto konkrétní aktivitu celkem udělal
        const [countResult] = await db.query(
            'SELECT COUNT(id) as total FROM activity_log WHERE user_id = ? AND activity_type_id = ?',
            [userId, activityTypeId]
        );

        // OPRAVA: mysql2 vrací pole objektů, proto musíme číst první řádek přes index [0]
        const currentCount = countResult[0].total;

        // 3. Najít pravidla pro tento typ aktivity, která uživatel ještě NEMÁ splněná
        const [rules] = await db.query(`
            SELECT r.achievement_id, r.required_count
            FROM achievement_rules r
            WHERE r.activity_type_id = ?
              AND r.achievement_id NOT IN (
                SELECT achievement_id FROM user_achievements WHERE user_id = ?
            )
        `, [activityTypeId, userId]);

        const earnedBadges = [];

        // 4. Projít pravidla a přidělit případné nové odznaky
        for (const rule of rules) {
            if (currentCount >= rule.required_count) {
                await db.query(
                    'INSERT INTO user_achievements (user_id, achievement_id, date_earned) VALUES (?, ?, NOW())',
                    [userId, rule.achievement_id]
                );

                // Vytáhneme detaily odznaku z DB, abychom je mohli poslat na frontend
                const [badgeDetails] = await db.query(
                    'SELECT name, description, image_url FROM achievements WHERE id = ?',
                    [rule.achievement_id]
                );

                if (badgeDetails.length > 0) {
                    earnedBadges.push(badgeDetails[0]);
                }
                console.log(`[Achievement] Uživatel ${userId} získal odznak ID ${rule.achievement_id}`);
            }
        }
        return earnedBadges; // Vracíme pole získaných odznaků (může být i prázdné)

    } catch (error) {
        console.error("Chyba při zpracování achievementů:", error);
        return [];
    }
}