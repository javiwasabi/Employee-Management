const express = require('express');
const router = express.Router();
const { agregarPermiso } = require('../controllers/permisosController');
const { getPermisos, getPermisosPorRut } = require('../controllers/permisosController');

router.get('/listar', getPermisos);
router.get('/listar/:rut', getPermisosPorRut);

router.post('/agregar/:rut', async (req, res) => {

    const permisoData = req.body; 

    try {
        const permisoAgregado = await agregarPermiso(permisoData);
        res.json({ message: 'Permiso agregado correctamente', permiso: permisoAgregado });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
