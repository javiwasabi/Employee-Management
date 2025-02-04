const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { secret } = require('../config/jwtConfig');

exports.register = async (req, res) => {
    try {
        const { nombres, apellidos, rut, email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ nombres, apellidos, rut, email, password: hashedPassword, role });
        await user.save();
        res.status(201).json({ message: "Usuario registrado" });
    } catch (error) {
        res.status(500).json({ message: "Error en el registro" });
    }
};

exports.login = async (req, res) => {
    try {
        const { rut, password } = req.body;

        // Buscar usuario por RUT
        const user = await User.findOne({ rut });
        if (!user) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }

        // Comparar contraseñas
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("¿Contraseña válida?", isMatch);
        if (!isMatch) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }

        // Crear token con permisos del usuario
        const token = jwt.sign(
            { id: user._id, permissions: user.permissions },  // <--- Cambié 'role' por 'permissions'
            secret,
            { expiresIn: "1h" }
        );

        res.json({ token });

    } catch (error) {
        console.error(error); // <-- Esto ayuda a ver el error en la consola del backend
        res.status(500).json({ message: "Error en el inicio de sesión" });
    }
};

