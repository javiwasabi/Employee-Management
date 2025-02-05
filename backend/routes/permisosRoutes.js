const express = require('express');
const router = express.Router();
const { agregarPermiso } = require('../controllers/permisosController');
const { getPermisos, getPermisosPorRut } = require('../controllers/permisosController');


router.get('/listar', getPermisos);

app.get('/permisos/listar/:rut', async (req, res) => {
    const rut = req.params.rut;

    try {
        const permisos = await Permiso.find({ rut });
        res.status(200).json(permisos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener permisos' });
    }
});

router.post('/agregar/:rut', async (req, res) => {
    const { rut } = req.params;
    const permisoData = req.body; 

    try {
        const permisoAgregado = await agregarPermiso(rut, permisoData);
        res.json({ message: 'Permiso agregado correctamente', permiso: permisoAgregado });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
