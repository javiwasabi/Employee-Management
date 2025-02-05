const express = require('express');
const router = express.Router();

const { agregarCapacitacion, getCapacitaciones, getCapacitacionPorRut } = require('../controllers/capacitacionController');



router.get('/listar/capacitaciones', getCapacitaciones);

router.get('/listar/:rut', getCapacitacionPorRut);

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
