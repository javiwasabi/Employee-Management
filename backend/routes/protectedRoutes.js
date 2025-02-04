const express = require('express');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/ver', authenticate, authorize("ver"), (req, res) => {
    res.json({ message: "Puedes ver los datos" });
});

router.post('/crear', authenticate, authorize("crear"), (req, res) => {
    res.json({ message: "Puedes crear registros" });
});

router.delete('/eliminar', authenticate, authorize("eliminar"), (req, res) => {
    res.json({ message: "Puedes eliminar registros" });
});

router.put('/editar', authenticate, authorize("editar"), (req, res) => {
    res.json({ message: "Puedes editar registros" });
});

module.exports = router;

