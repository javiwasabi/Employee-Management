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
        const { rut, password, role } = req.body;

        const user = await User.findOne({ rut });
        if (!user) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log("¿Contraseña válida?", isMatch);
        if (!isMatch) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }

 
        const token = jwt.sign(
            { id: user._id, role: user.role, permissions: user.permissions },  
            secret,
            { expiresIn: "1h" }
        );


        console.log(user.role)
        res.json({ token, role: user.role }); 
    } catch (error) {
        console.error(error); 
        res.status(500).json({ message: "Error en el inicio de sesión" });
    }
};
