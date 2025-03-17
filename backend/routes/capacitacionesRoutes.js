const express = require('express');
const router = express.Router();

const { agregarCapacitacion, getCapacitaciones, getCapacitacionPorRut, eliminarCapacitacion} = require('../controllers/capacitacionController');
router.get('/listar/capacitaciones', getCapacitaciones);

router.get('/listar/:rut', getCapacitacionPorRut);


router.delete('/eliminar/:rut', async (req, res) => {
    console.log("Datos recibidos en DELETE:", req.params, req.body); 

    const CapacitacionData = req.body; 
    const result = await eliminarCapacitacion(CapacitacionData);

    if (result.error) {
        return res.status(result.status).json({ message: result.error });
    }

    res.json({ message: result.message, permiso: result.user });
});

router.post('/agregar/:rut', async (req, res) => {
    const { rut } = req.params;
    const capacitacionData = req.body; 

    try {
        const CapacitacionAgregado = await agregarCapacitacion(rut, capacitacionData);
        res.json({ message: 'Capacitacion agregada correctamente', capacitacion: CapacitacionAgregado });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
