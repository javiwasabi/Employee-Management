const express = require('express');
const { register, login } = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);


router.get('/verify-token', authenticate, (req, res) => {
    res.json({ valid: true, permissions: req.user.permissions });
});

module.exports = router;
