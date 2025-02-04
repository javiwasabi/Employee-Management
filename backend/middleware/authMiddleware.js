const jwt = require('jsonwebtoken');
const { secret } = require('../config/jwtConfig');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(403).json({ message: "No autorizado" });

    try {
        const decoded = jwt.verify(token, secret);
        const user = await User.findById(decoded.id);

        if (!user) return res.status(403).json({ message: "Usuario no encontrado" });

        const isSupervisor = user.cargo.toLowerCase() === "supervisor";
        req.user = {
            id: user._id,
            cargo: user.cargo,
            permissions: isSupervisor ? ["ver", "crear", "eliminar", "editar"] : user.permissions
        };

        next();
    } catch (error) {
        res.status(403).json({ message: "Token inválido" });
    }
};

const authorize = (requiredPermission) => (req, res, next) => {
    if (!req.user.permissions.includes(requiredPermission)) {
        return res.status(403).json({ message: "No tienes permiso para acceder" });
    }
    next();
};

module.exports = { authenticate, authorize };

