import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    // Čteme standardní Authorization hlavičku místo x-auth-token
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    // Ořízneme slovo "Bearer " a vezmeme jen samotný token
    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // DŮLEŽITÉ: Do req.user uložíme přesně to, co jste zakódoval v auth.js (userId, email, roleId)
        req.user = {
            id: decoded.userId,
            email: decoded.email,
            roleId: decoded.roleId,
            relationId: decoded.relationId
        };

        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

export default authMiddleware;