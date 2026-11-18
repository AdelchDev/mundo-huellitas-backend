export function requireRefugio(req, res, next) {
    if (req.user?.rol !== "refugio") {
        return res.status(403).json({
            message: "Esta operación solamente está permitida para refugios"
        });
    }

    next();
}