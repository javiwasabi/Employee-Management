const express = require('express');
const { register, login } = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);


router.get('/verify-token', authenticate, (req, res) => {
    res.json({
        valid: true,
        role: req.user.role, 
        permissions: req.user.permissions,
        rut: req.user.rut
    });
});

module.exports = router;
