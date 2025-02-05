const express = require('express');
const router = express.Router();
const { agregarPermiso } = require('../controllers/permisosController');
const { getPermisos, getPermisosPorRut } = require('../controllers/permisosController');

// Ruta para obtener todos los permisos
router.get('/listar', getPermisos);
// Obtener permisos por RUT
router.get('/listar/:rut', getPermisosPorRut);
router.post('/agregar/:rut', async (req, res) => {
    const { rut } = req.params;
    const permisoData = req.body; // Datos del permiso

    try {
        const permisoAgregado = await agregarPermiso(rut, permisoData);
        res.json({ message: 'Permiso agregado correctamente', permiso: permisoAgregado });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
