const checkRole = (requiredRoleId) => {
    return (req, res, next) => {
        // Kontrolujeme roleId, které jsme si výše vytáhli z tokenu
        if (!req.user || req.user.roleId !== requiredRoleId) {
            return res.status(403).json({ message: "Forbidden" });
        }
        next();
    };
};

export default checkRole;