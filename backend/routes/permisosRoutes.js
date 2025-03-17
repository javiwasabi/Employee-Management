const express = require('express');
const router = express.Router();
const { agregarPermiso, eliminarPermiso, modificarPermiso } = require('../controllers/permisosController');
const { getPermisos, getPermisosPorRut } = require('../controllers/permisosController');

router.get('/listar', getPermisos);
router.get('/listar/:rut', getPermisosPorRut);

router.patch('/modificar-permiso/:rut', async (req, res) => {
    console.log("Datos recibidos:", req.params, req.body); 

    const permisoData = req.body; 
    const result = await modificarPermiso(permisoData);

    if (result.error) {
        return res.status(result.status).json({ message: result.error });
    }

    res.json({ message: result.message, permiso: result.user });
});

router.delete('/eliminar-permiso/:rut', async (req, res) => {
    console.log("Datos recibidos en DELETE:", req.params, req.body); 

    const permisoData = req.body; 
    const result = await eliminarPermiso(permisoData);

    if (result.error) {
        return res.status(result.status).json({ message: result.error });
    }

    res.json({ message: result.message, permiso: result.user });
});



module.exports = router;
router.post('/agregar/:rut', async (req, res) => {
    const permisoData = req.body;

    try {
        await agregarPermiso(permisoData, res); // ✅ Pasar res a la función
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
